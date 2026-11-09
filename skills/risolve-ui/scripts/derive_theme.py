#!/usr/bin/env python3
"""
Make a full token sheet from one brand ink and one accent.

    python3 derive_theme.py --ink "#1d2a44" --accent "#7cc4ff" > app/tokens.css
    python3 derive_theme.py                      # Risolve's own values, exactly

The method is Risolve's: one dark ink used at four strengths, quiet tints of that ink for the
window, sidebar ("rail") and selection, a neutral sheet, one bright "signal" fill for the single
positive state that should shout, a deeper version of it for numbers on white, and fixed status
colours (yellow when a person must act, soft red only for rejected).

The tints keep the ink's hue and Risolve's lightness steps. Their chroma follows the ink: a grey
ink gives grey tints, a strong ink is capped so the window never turns into a colour block.

No third-party packages. Prints the CSS to stdout and the checks to stderr.
"""
from __future__ import annotations

import argparse
import math
import sys

RISOLVE_INK = "#203119"
RISOLVE_ACCENT = "#bfff80"

# Risolve's exact values, used when the inputs are Risolve's own colours.
RISOLVE = {
    "ink": "#203119",
    "window": "#eef3e8",
    "rail": "#e3ebdb",
    "tint": "#ebf1e4",
    "selection": "#fbfdf9",
    "sheet": "#f9f9f9",
    "mist": "#cfe2cf",
    "signal": "#bfff80",
    "signal-deep": "#6fb514",
    "chart-expect": "#559646",
    "chart-other": "#9fc6bf",
}

# Lightness and chroma of each tint in Risolve (OKLCH), measured from the shipped tokens.
# Chroma is the value at Risolve's ink chroma (0.047); it scales down for greyer inks.
TINTS = {
    "window": (0.957, 0.015),
    "rail": (0.930, 0.023),
    "tint": (0.950, 0.018),
    "selection": (0.991, 0.006),
    "mist": (0.893, 0.033),
}
RISOLVE_INK_C = 0.047

# Status colours do not follow the brand: a person must act is yellow, rejected is a soft red.
STATUS = {
    "pending": "#f6e3a1",
    "pending-ink": "#8a6400",
    "reject": "#f4c7c2",
    "reject-ink": "#b4332a",
    "wrong": "#d2473b",
}


# ---------- colour maths (OKLab / OKLCH, sRGB) ----------

def _s2l(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _l2s(c: float) -> float:
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(ch * 2 for ch in h)
    if len(h) != 6:
        raise ValueError(f"not a hex colour: {h!r}")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def rgb_to_hex(rgb: tuple[float, float, float]) -> str:
    return "#" + "".join(f"{max(0, min(255, round(v))):02x}" for v in rgb)


def hex_to_oklch(h: str) -> tuple[float, float, float]:
    r, g, b = (_s2l(v / 255) for v in hex_to_rgb(h))
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = (math.copysign(abs(x) ** (1 / 3), x) for x in (l, m, s))
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, math.hypot(a, bb), math.degrees(math.atan2(bb, a)) % 360


def _oklch_to_linear(L: float, C: float, H: float) -> tuple[float, float, float]:
    a = C * math.cos(math.radians(H))
    b = C * math.sin(math.radians(H))
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return (
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )


def oklch_to_hex(L: float, C: float, H: float) -> str:
    """Nearest in-gamut colour: keep lightness and hue, lower chroma until it fits."""
    lo, hi = 0.0, C
    rgb = _oklch_to_linear(L, C, H)
    if not all(-1e-4 <= v <= 1 + 1e-4 for v in rgb):
        for _ in range(30):
            mid = (lo + hi) / 2
            if all(-1e-4 <= v <= 1 + 1e-4 for v in _oklch_to_linear(L, mid, H)):
                lo = mid
            else:
                hi = mid
        rgb = _oklch_to_linear(L, lo, H)
    return rgb_to_hex(tuple(_l2s(max(0.0, min(1.0, v))) * 255 for v in rgb))


def luminance(h: str) -> float:
    r, g, b = (_s2l(v / 255) for v in hex_to_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


# ---------- the theme ----------

def derive(ink: str, accent: str) -> tuple[dict[str, str], list[str]]:
    notes: list[str] = []
    if ink.lower() == RISOLVE_INK and accent.lower() == RISOLVE_ACCENT:
        return {**RISOLVE, **STATUS}, ["Risolve's own values."]

    iL, iC, iH = hex_to_oklch(ink)
    aL, aC, aH = hex_to_oklch(accent)
    t: dict[str, str] = {"ink": ink.lower()}

    if iL > 0.38:
        notes.append(f"Ink is light for body text (OKLCH L={iL:.2f}). Risolve's is 0.29; pick a darker brand colour, or text at 68% will be too faint.")

    scale = min(1.0, iC / RISOLVE_INK_C) if RISOLVE_INK_C else 0
    for name, (L, C) in TINTS.items():
        t[name] = oklch_to_hex(L, C * scale, iH)
    t["sheet"] = "#f9f9f9"

    # Signal: a light, saturated fill that ink text sits on. A dark brand accent is lifted.
    sig_L = aL if aL >= 0.85 else 0.93
    if aL < 0.85:
        notes.append(f"Accent {accent} is too dark to be a fill under ink text, so the signal fill is a light version of it; the accent itself becomes signal-deep if it reads on white.")
    t["signal"] = oklch_to_hex(sig_L, max(aC, 0.12), aH)

    # Signal-deep: the accent dark enough for a big number on the sheet (3:1 or better).
    deep_L = min(aL, 0.70)
    deep = oklch_to_hex(deep_L, max(aC, 0.15), aH)
    while contrast(deep, t["sheet"]) < 3.0 and deep_L > 0.3:
        deep_L -= 0.02
        deep = oklch_to_hex(deep_L, max(aC, 0.15), aH)
    t["signal-deep"] = deep

    t["chart-expect"] = oklch_to_hex(0.61, 0.132, aH)
    t["chart-other"] = oklch_to_hex(0.796, 0.043 * max(scale, 0.4), (iH + 46) % 360)

    status = dict(STATUS)
    if 70 <= aH <= 110:
        status["pending"] = oklch_to_hex(0.90, 0.09, 65)
        status["pending-ink"] = oklch_to_hex(0.50, 0.12, 55)
        notes.append("The accent is yellow, so 'needs a person' moved to a warm orange to stay distinct from it.")
    if aH <= 40 or aH >= 350:
        notes.append("The accent is red-ish: it will read as an error. Consider a different accent, or keep it out of status pills.")
    t.update(status)
    return t, notes


def checks(t: dict[str, str]) -> list[str]:
    out = []
    pairs = [
        ("ink on sheet", t["ink"], t["sheet"], 7.0),
        ("ink on signal", t["ink"], t["signal"], 4.5),
        ("signal-deep on sheet (big numbers)", t["signal-deep"], t["sheet"], 3.0),
        ("pending-ink on pending", t["pending-ink"], t["pending"], 4.5),
        ("reject-ink on reject", t["reject-ink"], t["reject"], 4.5),
    ]
    for label, fg, bg, need in pairs:
        c = contrast(fg, bg)
        out.append(f"{'ok ' if c >= need else 'LOW'} {label}: {c:.1f}:1 (want {need}:1)")
    return out


CSS = """/*
 * UI tokens in the Risolve method: one ink at four strengths, quiet tints of it, one signal colour,
 * fixed status colours. Generated by risolve-ui/scripts/derive_theme.py --ink {ink_in} --accent {accent_in}{strict_in}.
 * Edit the :root block to retheme; the Tailwind names below never change.
 */
:root {{
  color-scheme: light;
  --ink-rgb: {ink_rgb};
  --ink: rgb(var(--ink-rgb));
  --ink-78: rgb(var(--ink-rgb) / 0.78);
  --ink-68: rgb(var(--ink-rgb) / 0.68);
  --ink-50: rgb(var(--ink-rgb) / 0.5);
  --hairline: rgb(var(--ink-rgb) / 0.08);

  --window: {window};      /* behind everything */
  --rail: {rail};        /* sidebar */
  --sheet: {sheet};       /* the content sheet, cards, drawer */
  --tint: {tint};        /* quiet pills, source tags, hovers */
  --selection: {selection};   /* selected nav item */
  --mist: {mist};        /* team avatars, empty marks */

  --signal: {signal};      /* the one state that should shout: done, confirmed */
  --signal-deep: {signal_deep}; /* a good number on the sheet: money saved, quantity to make */

  --pending: {pending};     /* a person must act */
  --pending-ink: {pending_ink};
  --reject: {reject};      /* rejected */
  --reject-ink: {reject_ink};
  --wrong: {wrong};       /* a small mark beside a wrong answer, never a fill */

  --chart-actual: var(--ink);
  --chart-expect: {chart_expect};
  --chart-band: color-mix(in srgb, var(--signal) 45%, transparent);
  --chart-other: {chart_other};
}}

/* Tailwind v4. Without Tailwind, use the variables above directly. */
@theme inline {{
  --color-ink: var(--ink);
  --color-ink-78: var(--ink-78);
  --color-ink-68: var(--ink-68);
  --color-ink-50: var(--ink-50);
  --color-hairline: var(--hairline);
  --color-window: var(--window);
  --color-rail: var(--rail);
  --color-sheet: var(--sheet);
  --color-tint: var(--tint);
  --color-selection: var(--selection);
  --color-mist: var(--mist);
  --color-signal: var(--signal);
  --color-signal-deep: var(--signal-deep);
  --color-pending: var(--pending);
  --color-pending-ink: var(--pending-ink);
  --color-reject: var(--reject);
  --color-reject-ink: var(--reject-ink);
  --color-wrong: var(--wrong);
  --color-chart-actual: var(--chart-actual);
  --color-chart-expect: var(--chart-expect);
  --color-chart-band: var(--chart-band);
  --color-chart-other: var(--chart-other);

  /* Depth comes from rims and soft lifts, never from big drop shadows. */
  --shadow-rim: inset 0 0 0 1px rgb(var(--ink-rgb) / 0.1);
  --shadow-rim-strong: inset 0 0 0 1.5px rgb(var(--ink-rgb) / 0.09);
  --shadow-sheet: inset 0 0 0 1px rgb(var(--ink-rgb) / 0.06), 0 10px 30px -18px rgb(var(--ink-rgb) / 0.25);
  --shadow-select: 0 1px 2px rgb(var(--ink-rgb) / 0.1), 0 4px 12px -4px rgb(var(--ink-rgb) / 0.16);
  --shadow-glass: inset 0 1.5px 0.5px rgb(255 255 255 / 0.95), inset 0 0 0 1px rgb(255 255 255 / 0.5), inset 0 0 0 1px rgb(var(--ink-rgb) / 0.06), 0 18px 40px -18px rgb(var(--ink-rgb) / 0.35), 0 2px 6px rgb(var(--ink-rgb) / 0.07);
  --shadow-chip: inset 0 0 0 1px rgb(var(--ink-rgb) / 0.1), 0 4px 10px -7px rgb(var(--ink-rgb) / 0.4);
  --shadow-ask: inset 0 0 0 1px rgb(var(--ink-rgb) / 0.1), 0 10px 30px -20px rgb(var(--ink-rgb) / 0.35);
  --shadow-drawer: -1px 0 0 rgb(var(--ink-rgb) / 0.06), -24px 0 60px -30px rgb(var(--ink-rgb) / 0.45);
  --shadow-pop: 0 18px 40px -14px rgb(var(--ink-rgb) / 0.4), inset 0 0 0 1px rgb(var(--ink-rgb) / 0.08);
}}

/* Not inline, so a font loader (next/font, Fontsource) can set --font-brand. */
@theme {{
  --font-sans: var(--font-brand, "Satoshi"), "Satoshi", ui-sans-serif, system-ui, sans-serif;
  --ease-out-kit: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-kit: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}}

/* In the base layer, so Tailwind utilities (text sizes, border colours) still win. Unlayered,
   these rules override every text-[13px] on a button and every border colour class; Risolve
   shipped with that bug. */
@layer base {{
  * {{
    border-color: var(--hairline);
  }}

  html {{
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }}

  body {{
    margin: 0;
    background: var(--window);
    color: var(--ink);
    font-family: var(--font-sans);
    font-weight: 500; /* Medium is the body weight; Bold for emphasis; no semibold */
  }}

  button,
  input,
  textarea,
  select {{
    font: inherit;
  }}
}}

/* "Rise": up out of a soft blur on the long ease-out. Messages and panels arrive this way. */
@keyframes rise {{
  from {{
    opacity: 0;
    transform: translateY(22px);
    filter: blur(8px);
  }}
  to {{
    opacity: 1;
    transform: none;
    filter: none;
  }}
}}

.rise {{
  animation: rise 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
}}

/* Question chips that do not fit glide left in a loop (kit/chip-rail.tsx). */
@keyframes marquee {{
  from {{
    transform: translateX(0);
  }}
  to {{
    transform: translateX(-50%);
  }}
}}

.marquee {{
  animation: marquee 30s linear infinite;
}}

@media (prefers-reduced-motion: reduce) {{
  .rise,
  .marquee {{
    animation: none;
  }}
}}
"""


def render(t: dict[str, str], ink: str, accent: str, strict: bool) -> str:
    r, g, b = hex_to_rgb(t["ink"])
    keys = {k.replace("-", "_"): v for k, v in t.items()}
    return CSS.format(ink_in=ink, accent_in=accent, strict_in=" --strict" if strict else "", ink_rgb=f"{r} {g} {b}", **keys)


def darken_until(fg: str, bg: str, need: float) -> str:
    """Lower the foreground's lightness, same hue, until it reaches the contrast it needs."""
    L, C, H = hex_to_oklch(fg)
    out = fg
    while contrast(out, bg) < need and L > 0.2:
        L -= 0.01
        out = oklch_to_hex(L, C, H)
    return out


def strict(t: dict[str, str]) -> tuple[dict[str, str], list[str]]:
    t = dict(t)
    notes = []
    for fg, bg, need in (("signal-deep", "sheet", 3.0), ("pending-ink", "pending", 4.5), ("reject-ink", "reject", 4.5)):
        new = darken_until(t[fg], t[bg], need)
        if new != t[fg]:
            notes.append(f"--strict: {fg} {t[fg]} -> {new}")
            t[fg] = new
    return t, notes


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--ink", default=RISOLVE_INK, help="the brand's darkest colour, used for all text (default Risolve's dark green)")
    p.add_argument("--accent", default=RISOLVE_ACCENT, help="the brand's bright colour, used for the one positive state (default Risolve's Flex Green)")
    p.add_argument("--json", action="store_true", help="print the token values as JSON instead of CSS")
    p.add_argument("--strict", action="store_true", help="darken the deep accent and the status inks until they pass contrast (Risolve's own values are slightly under)")
    a = p.parse_args()

    t, notes = derive(a.ink, a.accent)
    if a.strict:
        t, more = strict(t)
        notes += more
    for n in notes:
        print(f"note: {n}", file=sys.stderr)
    for c in checks(t):
        print(c, file=sys.stderr)
    if a.json:
        import json

        print(json.dumps(t, indent=2))
    else:
        print(render(t, a.ink.lower(), a.accent.lower(), a.strict), end="")


if __name__ == "__main__":
    main()
