#!/usr/bin/env python3
"""
Static check of UI source against the Risolve rules. Fast, no dependencies, works on any repo.

    python3 check_ui.py src/                 # every .tsx/.jsx/.ts/.js/.vue/.svelte/.html/.css below
    python3 check_ui.py app/orders/page.tsx  # one file
    python3 check_ui.py src/ --json          # machine-readable

It reads code, not the screen, so it catches what is written down (classes, copy, structure).
For what only shows when rendered (repeated cells, row heights, real sizes), use audit_page.mjs.

Findings are "fix" (breaks a rule the redesign enforced) or "look" (often wrong, sometimes right:
look at the screen before changing it). Exit code 1 when there is at least one "fix".
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import asdict, dataclass

EXTS = {".tsx", ".jsx", ".ts", ".js", ".vue", ".svelte", ".html", ".css", ".astro", ".mdx"}
SKIP_DIRS = {"node_modules", ".next", "dist", "build", ".git", ".turbo", "out", "coverage", ".vercel", "storybook-static"}
SKIP_FILES = {"tokens.css"}


@dataclass
class Finding:
    rule: str
    level: str  # fix | look
    file: str
    line: int
    text: str


# (rule, level, regex, why) checked line by line on code that is not a comment.
LINE_RULES: list[tuple[str, str, re.Pattern[str], str]] = [
    ("stock-grey", "fix", re.compile(r"\b(?:text|bg|border|ring|fill|stroke|from|via|to|divide|outline|placeholder)-(?:gray|slate|zinc|neutral|stone)-\d{2,3}\b"),
     "Default Tailwind greys. Use the ink at 78/68/50% or the tints."),
    ("stock-accent", "fix", re.compile(r"\b(?:text|bg|border|ring|from|via|to|fill|stroke)-(?:indigo|violet|purple|fuchsia|blue|sky|cyan|teal|emerald|pink)-\d{2,3}\b"),
     "Stock Tailwind accent. Colour comes from the theme: signal for the one good state, nothing else."),
    ("semibold", "fix", re.compile(r"\bfont-semibold\b|font-weight:\s*600\b|fontWeight:\s*['\"]?600\b"),
     "Only Medium and Bold. Semibold is the default-template weight."),
    ("uppercase", "fix", re.compile(r"\buppercase\b|text-transform:\s*uppercase|textTransform:\s*['\"]uppercase|\btracking-(?:wide|wider|widest)\b"),
     "No uppercase or wide-tracked labels. Sentence case; tracking tightens as size grows."),
    ("red-fill", "fix", re.compile(r"\bbg-(?:red|rose)-(?:[4-9]00|950)\b|\bbg-destructive\b(?!/)"),
     "Red as a fill. A person must act = yellow (pending); red only as a small mark or a soft 'rejected' pill."),
    ("gradient", "look", re.compile(r"\bbg-(?:gradient|linear|radial|conic)-|(?<!mask-image:\s)(?<!mask:\s)\b(?:linear|radial|conic)-gradient\("),
     "Gradient. Fine for a mask or a chart band; not as decoration."),
    ("big-shadow", "look", re.compile(r"\bshadow-(?:lg|xl|2xl)\b|\bdrop-shadow-(?:lg|xl|2xl)\b"),
     "Big drop shadow. Depth comes from tint steps and faint rims."),
    ("small-text", "look", re.compile(r"\btext-xs\b|\btext-\[(?:[0-9]|10|11)px\]|font-size:\s*(?:[0-9]|10|11)px"),
     "Text under 12 px. Only source tags go this small."),
    ("glow-or-blob", "fix", re.compile(r"\bblur-(?:2xl|3xl)\b(?![^\n]*backdrop)|\banimate-(?:bounce|ping)\b"),
     "Glows, blobs, bouncing or pinging. Motion is a slow rise out of a blur."),
    ("pulse", "look", re.compile(r"\banimate-pulse\b"),
     "Pulse. Fine on a loading placeholder; never on live content or a status dot."),
    ("fake-data", "fix", re.compile(r"\b(?:John|Jane) (?:Doe|Smith)\b|\bLorem ipsum\b|\bAcme(?: Corp| Inc)?\b|\bExample (?:Corp|Inc|Company)\b|\buser@example\.com\b|['\"]Item [0-9]+['\"]|\bFoo(?:bar)?\b"),
     "Placeholder data. Seed realistic names, values and dates before styling."),
    ("filler-copy", "fix", re.compile(r"Welcome back|Here(?:'|’)s (?:an overview|what(?:'|’)s happening)|Overview of your|Manage your [a-z]+ (?:and|with)|at a glance|Get started by|Unlock |Seamless(?:ly)?|Supercharge", re.I),
     "Filler copy explaining the screen. Delete it; the screen should answer by itself."),
    ("iso-date-in-ui", "look", re.compile(r">[^<{]*\b\d{4}-\d{2}-\d{2}\b[^<]*<|>[^<{]*\bW\d{1,2}\b[^<]*<"),
     "ISO date or week number shown to people. Write '12 Nov' or '6 of 12 weeks'."),
]

EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-⛿⭐⭕✅❌✨‼⁉️]")
EM_DASH = re.compile("—")
HEX_IN_CLASS = re.compile(r"(?:bg|text|border|ring|fill|stroke|from|via|to)-\[#[0-9a-fA-F]{3,8}\]")

H1 = re.compile(r"<h1\b|<PageHeader\b|<CardTitle\b(?=[^>]*\bpage)", re.I)
SUBTITLE_PROP = re.compile(r"\b(?:subtitle|sub|description|subheading|caption|tagline)=[\"'{]")
HEADER_TAG = re.compile(r"<(?:PageHeader|Header|PageTitle|SectionHeader|CardHeader|Hero)\b")
MUTED_P = re.compile(r"<p\b[^>]*(?:muted|text-ink-[5-7]\d|text-(?:gray|slate|zinc|neutral)-[3-6]00|opacity-[5-7]0|text-sm)|<CardDescription\b|<p\b[^>]*>")
BOX_OPEN = re.compile(
    r"<(?:Card|Panel|Paper|Box|section|div|article)\b[^>]*className=[\"'{`][^\"'`]*(?=[^\"'`]*\brounded(?:-[a-z0-9\[\]px]+)?\b)(?=[^\"'`]*(?:\bborder\b|\bring-1\b|\bshadow(?:-sm|-md)?\b|\bbg-(?:white|card)\b|\bbg-sheet\b))(?=[^\"'`]*\bp[xy]?-\d)"
)
SHADCN_CARD = re.compile(r"<(?:Card|Panel|Tile|Widget|Paper|Box)\b(?!Title|Header|Content|Description|Footer|Body)")
LIST_INSIDE = re.compile(r"<(?:table|Table|DataTable|ul|ol)\b|\.map\(")
TD_SHORT = re.compile(r"<(?:td|th|tr|TableCell|TableRow)\b[^>]*\b(?:h-(?:[0-9]|1[0-3])\b|h-\[(?:[1-4]\d|5[0-5])px\]|py-(?:0|0\.5|1|1\.5|2)\b)")
TABLE_TEXT_SMALL = re.compile(r"<(?:td|TableCell)\b[^>]*\btext-(?:xs|sm|\[1[0-4]px\])")
DARK_PILL = re.compile(r"<(?:span|Badge)\b[^>]*rounded-full[^>]*\bbg-(?:black|gray-[89]00|slate-[89]00|zinc-[89]00|neutral-[89]00|stone-[89]00|foreground|primary)\b")
BADGE = re.compile(r"<Badge\b(?![^>]*variant=[\"'](?:outline|secondary)[\"'])")


def is_comment(line: str) -> bool:
    s = line.strip()
    return s.startswith(("//", "/*", "*", "{/*", "<!--", "#")) and not s.startswith("#[")


def indent(line: str) -> int:
    return len(line) - len(line.lstrip(" \t"))


def block_end(lines: list[str], i: int, limit: int = 120) -> int:
    """End of the JSX block that opens on line i, by indentation (prettier-formatted code)."""
    base = indent(lines[i])
    for j in range(i + 1, min(len(lines), i + limit)):
        if lines[j].strip() and indent(lines[j]) <= base:
            return j
    return min(len(lines), i + limit)


def check_file(path: str) -> list[Finding]:
    try:
        src = open(path, encoding="utf-8").read()
    except (UnicodeDecodeError, OSError):
        return []
    lines = src.splitlines()
    out: list[Finding] = []
    css = path.endswith(".css")

    def add(rule: str, level: str, i: int):
        out.append(Finding(rule, level, path, i + 1, lines[i].strip()[:160]))

    for i, line in enumerate(lines):
        if is_comment(line):
            continue
        for rule, level, rx, _ in LINE_RULES:
            if css and rule in ("fake-data", "filler-copy", "iso-date-in-ui"):
                continue
            if rx.search(line):
                if rule == "gradient" and re.search(r"mask|chart|band|shimmer|skeleton", line, re.I):
                    continue
                add(rule, level, i)
        if not css:
            if EMOJI.search(line):
                add("emoji", "fix", i)
            if EM_DASH.search(line):
                add("em-dash", "fix", i)
            if HEX_IN_CLASS.search(line):
                add("hardcoded-colour", "look", i)
            if TD_SHORT.search(line):
                add("short-rows", "fix", i)
            if TABLE_TEXT_SMALL.search(line):
                add("small-table-text", "look", i)
            if DARK_PILL.search(line):
                add("dark-pill", "fix", i)

    if css:
        return out

    # A subtitle prop on a header component, possibly on a later line of the same tag.
    for i, line in enumerate(lines):
        if HEADER_TAG.search(line) and not is_comment(line):
            for j in range(i, min(len(lines), i + 8)):
                seg = lines[j] if j > i else line[HEADER_TAG.search(line).start():]
                if SUBTITLE_PROP.search(seg.split(">")[0] if ">" in seg else seg):
                    add("subtitle", "fix", j)
                    break
                if ">" in seg:
                    break

    # A muted paragraph right under the page title is a subtitle.
    for i, line in enumerate(lines):
        if H1.search(line) and not is_comment(line):
            for j in range(i + 1, min(len(lines), i + 6)):
                if MUTED_P.search(lines[j]) and not is_comment(lines[j]):
                    add("subtitle", "fix", j)
                    break

    # A box (rounded + border/ring/shadow/white + padding) around a list or table.
    for i, line in enumerate(lines):
        if is_comment(line):
            continue
        if BOX_OPEN.search(line) or SHADCN_CARD.search(line):
            end = block_end(lines, i)
            inner = "\n".join(lines[i + 1 : end])
            if LIST_INSIDE.search(inner) and not re.search(r"chart|map|Chart|Map\b|<svg|<canvas", inner):
                add("boxed-list", "fix", i)

    # Badges in shadcn are dark by default.
    for i, line in enumerate(lines):
        if BADGE.search(line) and not is_comment(line):
            add("default-badge", "look", i)
    return out


WHY = {r: why for r, _, _, why in LINE_RULES}
WHY.update(
    {
        "emoji": "Emoji in the UI. Use the kit's icons or plain words.",
        "em-dash": "Em dash in copy. Use a comma, colon or full stop.",
        "hardcoded-colour": "Hex colour in a class. Use a token so the theme can change.",
        "subtitle": "Subtitle or explanation under a title. The redesign removed all of them; questions go to the ask bar.",
        "short-rows": "Short table rows. Rows are 60 px.",
        "small-table-text": "Small table text. Cells are 15 px, the main cell 16 px bold.",
        "dark-pill": "Dark pill. No dark fills on status; 'the system acted' is ink on a tint.",
        "boxed-list": "A box around a list or table. Lists and tables sit on the sheet; box single objects only.",
        "default-badge": "shadcn Badge with its default dark fill. Use the kit's Pill.",
    }
)


def walk(paths: list[str]) -> list[str]:
    files = []
    for p in paths:
        if os.path.isfile(p):
            files.append(p)
            continue
        for root, dirs, names in os.walk(p):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
            for n in names:
                if os.path.splitext(n)[1] in EXTS and n not in SKIP_FILES and not n.endswith((".d.ts", ".test.ts", ".test.tsx", ".spec.ts")):
                    files.append(os.path.join(root, n))
    return sorted(files)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--max", type=int, default=6, help="examples shown per rule (default 6)")
    a = ap.parse_args()

    findings: list[Finding] = []
    files = walk(a.paths)
    for f in files:
        findings += check_file(f)

    if a.json:
        print(json.dumps({"files": len(files), "findings": [asdict(x) for x in findings]}, indent=2))
    else:
        by: dict[str, list[Finding]] = {}
        for x in findings:
            by.setdefault(x.rule, []).append(x)
        order = sorted(by, key=lambda r: (by[r][0].level != "fix", -len(by[r])))
        print(f"{len(files)} files, {sum(1 for x in findings if x.level == 'fix')} to fix, {sum(1 for x in findings if x.level == 'look')} to look at\n")
        for r in order:
            xs = by[r]
            print(f"[{xs[0].level}] {r} ({len(xs)}): {WHY.get(r, '')}")
            for x in xs[: a.max]:
                print(f"    {os.path.relpath(x.file)}:{x.line}  {x.text}")
            if len(xs) > a.max:
                print(f"    … {len(xs) - a.max} more")
            print()
    sys.exit(1 if any(x.level == "fix" for x in findings) else 0)


if __name__ == "__main__":
    main()
