#!/usr/bin/env node
/**
 * Screenshot pages and audit what is actually on screen against the Risolve rules.
 *
 *   node audit_page.mjs http://localhost:3000 / /orders /settings
 *   node audit_page.mjs http://localhost:3000 /orders --out shots --wait 4000 --width 1280
 *
 * Needs Node 22+ (global WebSocket) and Chrome or Chromium (set CHROME=/path if it isn't found).
 * Writes <out>/<page>.png and <out>/<page>.audit.json, and prints the findings.
 *
 * It measures the rendered page, so it sees what static checks can't: the real title size, a
 * subtitle under it, row heights and cell sizes, the same text repeated down a column, boxes
 * around lists, dark or red pills, more than one dark primary button, small-print explanations,
 * code-like labels and ISO dates, thin demo data. Look at the screenshot as well: the audit
 * finds rule breaks, it does not judge the composition.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return false;
  args.splice(i, 1);
  return true;
};
const outDir = opt("out", "ui-audit");
const waitMs = Number(opt("wait", "3000"));
const width = Number(opt("width", "1440"));
const height = Number(opt("height", "900"));
const jsonOnly = flag("json");
const [base, ...rawPaths] = args;
if (!base || base.startsWith("--")) {
  console.error("usage: node audit_page.mjs <base-url> [path ...] [--out dir] [--wait ms] [--width px] [--height px] [--json]");
  process.exit(2);
}
const paths = rawPaths.length ? rawPaths : ["/"];

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const mac = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"];
  for (const p of mac) if (existsSync(p)) return p;
  for (const n of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"]) {
    const r = spawnSync("which", [n], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  console.error("Chrome not found. Set CHROME=/path/to/chrome.");
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "ui-audit-"));
const port = 9300 + Math.floor(Math.random() * 600);
const chrome = spawn(
  findChrome(),
  ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", `--window-size=${width},${height}`, "about:blank"],
  { stdio: "ignore" },
);
// Chrome keeps writing to its profile until it has exited, so wait for that before deleting it.
const chromeExited = new Promise((r) => chrome.once("exit", r));
const cleanup = async () => {
  try {
    chrome.kill();
  } catch {}
  await Promise.race([chromeExited, sleep(5000)]);
  for (let i = 0; i < 5; i++) {
    try {
      rmSync(profile, { recursive: true, force: true });
      return;
    } catch {
      await sleep(300);
    }
  }
};
process.on("SIGINT", async () => {
  await cleanup();
  process.exit(130);
});

async function pageSocket() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome did not start");
}

const ws = new WebSocket(await pageSocket());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const waiting = new Map();
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && waiting.has(m.id)) {
    waiting.get(m.id)(m);
    waiting.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((res) => {
    const id = ++seq;
    waiting.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });

/* ------------------------------------------------------------------ the in-page audit */
const AUDIT = String.raw`(() => {
  const VW = innerWidth, VH = innerHeight;
  const out = { findings: [] };
  const find = (level, rule, detail) => out.findings.push({ level, rule, detail });

  // colours: rgb(), rgba(), color(srgb …), oklch()
  const oklchToRgb = (L, C, H) => {
    const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
    const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
    return lin.map((c) => 255 * Math.max(0, Math.min(1, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)));
  };
  const col = (s) => {
    if (!s || s === "transparent") return null;
    let m = s.match(/^rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    m = s.match(/^color\(srgb ([^)]+)\)/);
    if (m) { const p = m[1].split(/[\s\/]+/).filter(Boolean).map(parseFloat); return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p.length > 3 ? p[3] : 1 }; }
    m = s.match(/^oklch\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[\s\/]+/).filter(Boolean);
      const L = p[0].endsWith("%") ? parseFloat(p[0]) / 100 : parseFloat(p[0]);
      const [r, g, b] = oklchToRgb(L, parseFloat(p[1]) || 0, parseFloat(p[2]) || 0);
      return { r, g, b, a: p.length > 3 ? parseFloat(p[3]) / (p[3].endsWith("%") ? 100 : 1) : 1 };
    }
    return null;
  };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const hsl = (c) => { const r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; if (!d) return { h: 0, s: 0, l }; const s = d / (1 - Math.abs(2 * l - 1)); let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return { h, s, l }; };
  const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

  const shown = (el) => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05 && r.bottom > 0 && r.top < VH * 3 && r.right > 4 && r.left < VW - 4; };
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
  const px = (v) => parseFloat(v) || 0;
  const median = (xs) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

  // ---- text
  const sizes = {}, weights = {};
  let chars = 0, upper = 0, small = 0;
  const em = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode()); ) {
    const t = n.textContent.trim();
    if (!t || !n.parentElement || !shown(n.parentElement)) continue;
    const cs = getComputedStyle(n.parentElement);
    if (cs.position === "fixed" && px(cs.fontSize) === 0) continue;
    const fs = Math.round(px(cs.fontSize)), w = cs.fontWeight;
    sizes[fs] = (sizes[fs] || 0) + t.length; weights[w] = (weights[w] || 0) + t.length; chars += t.length;
    if (fs < 12) small += t.length;
    if (cs.textTransform === "uppercase" && /[a-z]{3}/i.test(t)) upper += 1;
    if (t.includes("—") && em.length < 6) em.push(t.slice(0, 80));
  }
  out.text = { sizes, weights, chars };
  if ((weights["600"] || 0) > chars * 0.02) find("fix", "semibold", Math.round(100 * weights["600"] / chars) + "% of text is weight 600. Use Medium (500) and Bold (700) only.");
  if (upper) find("fix", "uppercase", upper + " uppercase labels. Sentence case.");
  if (em.length) find("fix", "em-dash", "Em dashes in copy: " + em.map((t) => JSON.stringify(t)).join(", "));
  if (small > chars * 0.04) find("look", "small-text", Math.round(100 * small / chars) + "% of text is under 12 px.");

  // ---- title and subtitle
  const h1 = [...document.querySelectorAll("h1")].find(shown);
  if (!h1) find("look", "no-title", "No visible h1. Every page has one plain title.");
  else {
    const r = h1.getBoundingClientRect(), cs = getComputedStyle(h1);
    out.title = { text: h1.innerText.trim().slice(0, 60), size: px(cs.fontSize), weight: cs.fontWeight };
    if (px(cs.fontSize) < 28) find("fix", "small-title", "Title is " + px(cs.fontSize) + " px. Titles are 30 px bold.");
    // A line of text, counting inline children ("23 open · <b>2 overdue</b>"), not a block of blocks.
    const lineText = (el) => ([...el.children].every((c) => getComputedStyle(c).display.startsWith("inline")) ? el.innerText.trim() : ownText(el));
    // Only text in the title's own header counts (not a KPI label below it), and only while the
    // title itself is visible (not under an open drawer).
    const common = (a, b) => { let e = a; while (e && !e.contains(b)) e = e.parentElement; return e; };
    const hc = { x: r.left + Math.min(r.width / 2, 40), y: r.top + r.height / 2 };
    const titleVisible = h1.contains(document.elementFromPoint(hc.x, hc.y));
    const sub = !titleVisible ? null : [...document.querySelectorAll("p, div, span, h2, h3")].find((el) => {
      if (h1.contains(el) || el.contains(h1) || !shown(el)) return false;
      const c = common(h1, el); if (!c || c.getBoundingClientRect().height > 220) return false;
      const t = lineText(el); if (t.length < 12) return false;
      if (el.closest("button, a, input, label, nav, [role=tablist], [role=button], h2, h3, h4")) return false;
      if (+getComputedStyle(el).fontWeight >= 600) return false;
      const e = el.getBoundingClientRect();
      return e.top >= r.bottom - 2 && e.top <= r.bottom + 70 && Math.abs(e.left - r.left) < 48 && px(getComputedStyle(el).fontSize) < px(cs.fontSize) * 0.9;
    });
    if (sub) { out.subtitle = lineText(sub).slice(0, 120); find("fix", "subtitle", "Subtitle under the title: " + JSON.stringify(out.subtitle) + ". Delete it; questions go to the ask bar."); }
  }

  // ---- pills (found first: a repeated status in a pill is judged more softly)
  const pills = [...document.querySelectorAll("span, div, em, b, strong, small")].filter((el) => {
    if (!shown(el) || el.closest("button, a, input, [role=button], [role=tab]")) return false;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (r.height < 16 || r.height > 34 || r.width > 260 || r.width < r.height * 1.3) return false;
    if (px(cs.borderTopLeftRadius) < r.height / 2 - 2) return false;
    const c = col(cs.backgroundColor); if (!c || c.a < 0.5) return false;
    return el.innerText.trim().length >= 2;
  });
  const pillText = new Set(pills.map((p) => p.innerText.trim()));

  // ---- tables and row-like lists
  const sameness = (rowsCells, label) => {
    const n = rowsCells.length; if (n < 4) return;
    const cols = Math.max(...rowsCells.map((r) => r.length));
    for (let j = 0; j < cols; j++) {
      const vals = rowsCells.map((r) => (r[j] || "").trim()).filter((v) => v.length >= 2);
      if (vals.length < 4) continue;
      const count = {}; for (const v of vals) count[v] = (count[v] || 0) + 1;
      const [top, k] = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
      if (k / n < 0.6) continue;
      if (pillText.has(top) && k < n) find("look", "repeated-status", label + ": " + k + " of " + n + " rows are " + JSON.stringify(top) + ". Fine if most things are fine, but the few that differ must stand out by colour, or come first.");
      else find("fix", "repeated-text", label + ": " + k + " of " + n + " rows say " + JSON.stringify(top.slice(0, 60)) + ". Drop the column, or show what differs (a specific reason, a person, a value).");
    }
    const flat = rowsCells.flat().map((v) => v.trim());
    const iso = flat.filter((v) => /\b\d{4}-\d{2}-\d{2}\b|\b\d{4}-W\d{2}\b|^W\d{1,2}$/.test(v));
    if (iso.length >= 2) find("fix", "iso-dates", label + ": ISO dates or week numbers (" + iso.slice(0, 3).join(", ") + "). Write “12 Nov” or “6 of 12 weeks”.");
    const codeCols = [];
    for (let j = 0; j < cols; j++) {
      const vals = rowsCells.map((r) => (r[j] || "").trim()).filter(Boolean);
      const codes = vals.filter((v) => /^[A-Z0-9]{2,}(?:[-_/.][A-Z0-9]{1,})+$/.test(v) && /[A-Z]/.test(v));
      if (vals.length && codes.length / vals.length > 0.6) codeCols.push(codes[0]);
    }
    if (codeCols.length >= 2) find("look", "code-labels", label + ": " + codeCols.length + " columns of codes (" + codeCols.join(", ") + "). Keep one ID column; show names elsewhere.");
  };
  out.tables = [];
  for (const t of document.querySelectorAll("table")) {
    if (!shown(t)) continue;
    const rows = [...t.querySelectorAll("tbody tr")].filter(shown);
    if (!rows.length) continue;
    const hts = rows.map((r) => r.getBoundingClientRect().height);
    const cells = rows.map((r) => [...r.children].map((c) => c.innerText.replace(/\s+/g, " ")));
    const fonts = rows.flatMap((r) => [...r.children].map((c) => px(getComputedStyle(c).fontSize)));
    const info = { rows: rows.length, rowHeight: Math.round(median(hts)), cellFont: median(fonts) };
    out.tables.push(info);
    const label = "Table " + out.tables.length;
    if (info.rowHeight < 52) find("fix", "short-rows", label + ": rows are " + info.rowHeight + " px. Rows are 60 px.");
    if (info.cellFont < 14.5) find("fix", "small-table-text", label + ": cells are " + info.cellFont + " px. Cells are 15 px, the main cell 16 px bold.");
    if (info.rows < 8) find("look", "thin-data", label + ": " + info.rows + " rows. Seed realistic volume (20+) before judging the design.");
    sameness(cells, label);
  }
  // div lists: a parent with 4+ visible children of the same tag and similar height, full width rows
  out.lists = [];
  const listParents = new Set();
  for (const p of document.querySelectorAll("ul, ol, div, section")) {
    if (p.closest("table") || !shown(p)) continue;
    const kids = [...p.children].filter(shown);
    if (kids.length < 4) continue;
    const pr = p.getBoundingClientRect();
    if (pr.width < 320) continue;
    const tag = kids[0].tagName;
    const rs = kids.map((k) => k.getBoundingClientRect());
    if (!kids.every((k) => k.tagName === tag)) continue;
    if (!rs.every((r) => r.width > pr.width * 0.8 && r.height >= 24 && r.height <= 160)) continue;
    const h = median(rs.map((r) => r.height));
    if (!rs.every((r) => Math.abs(r.height - h) < h * 0.35)) continue;
    if ([...listParents].some((q) => q.contains(p) || p.contains(q))) continue;
    listParents.add(p);
    const cells = kids.map((k) => k.innerText.split("\n").map((s) => s.trim()).filter(Boolean));
    const info = { rows: kids.length, rowHeight: Math.round(h) };
    out.lists.push(info);
    const label = "List " + out.lists.length;
    if (kids.length < 8 && kids.length >= 4) find("look", "thin-data", label + ": " + kids.length + " rows. Seed realistic volume before judging the design.");
    sameness(cells, label);
  }

  // ---- boxes
  const area = VW * VH;
  const bgOf = (el) => { for (let e = el.parentElement; e; e = e.parentElement) { const c = col(getComputedStyle(e).backgroundColor); if (c && c.a > 0.3) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const isBox = (el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const a = r.width * r.height;
    if (a < area * 0.015 || a > area * 0.6 || px(cs.borderTopLeftRadius) < 8) return false;
    if (r.height < 60) return false;
    const border = ["Top", "Right", "Bottom", "Left"].filter((s) => px(cs["border" + s + "Width"]) >= 1 && (col(cs["border" + s + "Color"]) || { a: 0 }).a > 0.04).length >= 3;
    const shadow = cs.boxShadow && cs.boxShadow !== "none";
    const bg = col(cs.backgroundColor), pb = bgOf(el);
    const diff = bg && bg.a > 0.3 && Math.abs(bg.r - pb.r) + Math.abs(bg.g - pb.g) + Math.abs(bg.b - pb.b) > 6;
    return border || shadow || diff;
  };
  // The window's own panes (a full-height sidebar, the sheet) are chrome, not boxes.
  const chrome = (el) => el.getBoundingClientRect().height > VH * 0.88 || el.matches("nav, header") || !!el.querySelector("nav");
  const boxes = [...document.querySelectorAll("div, section, article, aside, li")].filter((el) => shown(el) && !el.closest("button, a, [role=dialog]") && isBox(el) && !chrome(el));
  out.boxes = boxes.length;
  const rowsIn = (b) => Math.max(b.querySelectorAll("li").length, ...[...listParents].filter((l) => b.contains(l) && l !== b).map((l) => [...l.children].filter(shown).length), 0);
  const boxedTables = boxes.filter((b) => [...b.querySelectorAll("table")].some(shown));
  const tall = (b) => b.getBoundingClientRect().height > VH * 0.5;
  const boxedLong = boxes.filter((b) => !boxedTables.includes(b) && rowsIn(b) >= 3 && (tall(b) || rowsIn(b) > 12));
  const boxedShort = boxes.filter((b) => !boxedTables.includes(b) && !boxedLong.includes(b) && rowsIn(b) >= 3);
  const nested = boxes.filter((b) => boxes.some((o) => o !== b && o.contains(b)));
  const split = boxes.filter((b) => tall(b) && boxes.some((o) => o !== b && tall(o) && o.parentElement === b.parentElement && Math.abs(o.getBoundingClientRect().top - b.getBoundingClientRect().top) < 40));
  if (split.length >= 2) find("fix", "split-pane", "A list box beside a detail box. Use one full-width table, and open details in a drawer.");
  const desc = (b) => { const r = b.getBoundingClientRect(); return b.tagName.toLowerCase() + "." + String(b.className).split(/\s+/).slice(0, 8).join(".") + " " + Math.round(r.width) + "x" + Math.round(r.height); };
  out.boxedDetail = [...boxedTables, ...boxedLong, ...boxedShort].map(desc);
  if (boxedTables.length + boxedLong.length) find("fix", "boxed-list", (boxedTables.length + boxedLong.length) + " box(es) around a table or a long list. Lists and tables sit on the sheet; box single objects only.");
  if (boxedShort.length) find("look", "boxed-short-list", boxedShort.length + " short list(s) in a box. Fine for a desk widget that links to its full page; otherwise drop the frame.");
  if (nested.length) find("look", "box-in-box", nested.length + " box(es) inside another box.");
  if (boxes.length > 12) find("look", "many-boxes", boxes.length + " framed boxes on one screen. Remove frames that aren't earned.");

  // ---- pill colours
  const pillCols = {};
  const dark = [], red = [];
  for (const p of pills) {
    const c = col(getComputedStyle(p).backgroundColor), h = hsl(c), L = lum(c);
    const key = hex({ r: Math.round(c.r / 12) * 12, g: Math.round(c.g / 12) * 12, b: Math.round(c.b / 12) * 12 });
    pillCols[key] = (pillCols[key] || 0) + 1;
    if (L < 0.18) dark.push(p.innerText.trim().slice(0, 30));
    else if ((h.h < 20 || h.h > 345) && h.s > 0.45 && L < 0.45) red.push(p.innerText.trim().slice(0, 30));
  }
  out.pills = { count: pills.length, colours: pillCols };
  if (dark.length) find("fix", "dark-pill", dark.length + " dark status pill(s): " + [...new Set(dark)].slice(0, 4).join(", ") + ". No dark fills on status.");
  if (red.length) find("fix", "red-fill", red.length + " red pill(s): " + [...new Set(red)].slice(0, 4).join(", ") + ". A person must act = yellow; red only as a small mark.");
  if (Object.keys(pillCols).length > 5) find("look", "pill-colours", Object.keys(pillCols).length + " pill colours on one screen. Keep to done, acted, needs, quiet, reject.");
  if (pills.length >= 6 && Object.keys(pillCols).length === 1) find("look", "flat-status", "All " + pills.length + " pills are one colour, so nothing stands out. Colour should separate what needs a person from what is on track.");

  // ---- buttons
  const primaries = [...document.querySelectorAll("button, a, [role=button]")].filter((b) => {
    if (!shown(b)) return false;
    const c = col(getComputedStyle(b).backgroundColor), r = b.getBoundingClientRect();
    const sibs = b.parentElement ? [...b.parentElement.children].filter((x) => x !== b && x.matches("button, a, [role=tab]")) : [];
    if (sibs.length && sibs.every((x) => { const cc = col(getComputedStyle(x).backgroundColor); return !cc || cc.a < 0.3; })) return false;
    return c && c.a > 0.8 && lum(c) < 0.2 && r.height >= 28 && r.width >= 60 && b.innerText.trim().length >= 3;
  }).map((b) => b.innerText.trim().slice(0, 30));
  out.primaries = primaries;
  if (primaries.length > 1) find("look", "many-primaries", primaries.length + " dark primary buttons: " + primaries.slice(0, 4).join(", ") + ". One primary per view.");

  // ---- things cut off or scrolling sideways (mostly on narrow screens)
  const sideways = [...document.querySelectorAll("table")].filter(shown).map((t) => t.parentElement).filter((w) => w && w.scrollWidth > w.clientWidth + 4);
  if (sideways.length) find(VW < 768 ? "fix" : "look", "table-scrolls-sideways", sideways.length + " table(s) wider than their space at " + VW + " px. Keep the ID, the main fact, the value and the status; move the rest into the drawer.");
  // Text partly clipped by a container (or the screen). Scrollers and masked rails (gliding
  // question chips) are deliberate; things fully outside their clip box (a closed drawer) are hidden.
  const partly = (r, box) => (r.right > box.right + 1 && r.left < box.right) || (r.left < box.left - 1 && r.right > box.left);
  const isCut = (el) => {
    let r = el.getBoundingClientRect();
    for (let e = el.parentElement; e; e = e.parentElement) {
      const cs = getComputedStyle(e), mask = cs.maskImage || cs.webkitMaskImage;
      if (mask && mask !== "none") return false;
      if (cs.overflowX === "visible") continue;
      const er = e.getBoundingClientRect();
      // A sideways scroller (a wide table) is deliberate; a page that scrolls down is a clip box.
      const sideways = (cs.overflowX === "auto" || cs.overflowX === "scroll") && e.scrollHeight <= e.clientHeight + 2;
      if (sideways) { r = er; continue; }
      if (partly(r, er)) return true;
      if (r.left >= er.right || r.right <= er.left) return false;
    }
    return partly(r, { left: 0, right: VW });
  };
  const cut = [...document.querySelectorAll("body *")].filter((el) => {
    if (!ownText(el) || el.closest("nav, aside, [aria-hidden=true]")) return false;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.top > VH) return false;
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || +cs.opacity < 0.05 || cs.textOverflow === "ellipsis") return false;
    return isCut(el);
  }).map((el) => ownText(el).slice(0, 30));
  const wide = [...document.querySelectorAll("body, main, div, section")].filter((e) => e.clientWidth > VW * 0.5 && e.scrollHeight > e.clientHeight + 2 && e.scrollWidth > e.clientWidth + 4 && ["auto", "scroll"].includes(getComputedStyle(e).overflowY));
  if (document.documentElement.scrollWidth > VW + 2 || wide.length) find(VW < 768 ? "fix" : "look", "page-wider-than-screen", "The page is wider than the screen at " + VW + " px, so it scrolls sideways or clips.");
  if (cut.length) find(VW < 768 ? "fix" : "look", "cut-off", cut.length + " piece(s) of text run past the screen edge: " + [...new Set(cut)].slice(0, 3).map((t) => JSON.stringify(t)).join(", ") + ".");

  // ---- explanations and fake data
  const notes = [...document.querySelectorAll("p, small, span, div")].filter((el) => {
    if (!shown(el) || el.closest("button, a, td, th, li, [role=dialog], textarea, label")) return false;
    const t = ownText(el); if (t.length < 60) return false;
    return px(getComputedStyle(el).fontSize) <= 13.5;
  }).map((el) => ownText(el).slice(0, 100));
  out.smallPrint = notes;
  if (notes.length) find("look", "explanations", notes.length + " small-print explanation(s): " + notes.slice(0, 2).map((t) => JSON.stringify(t)).join(", ") + ". If it explains the screen, delete it.");
  const body = document.body.innerText;
  const fake = body.match(/\b(?:John|Jane) (?:Doe|Smith)\b|Lorem ipsum|\bAcme\b|Example (?:Corp|Inc)|user@example\.com|\bItem \d\b/g);
  if (fake) find("fix", "fake-data", "Placeholder data on screen: " + [...new Set(fake)].slice(0, 4).join(", ") + ".");
  const filler = body.match(/Welcome back[^\n]{0,40}|Here's (?:an overview|what's happening)[^\n]{0,40}|Overview of your[^\n]{0,40}/gi);
  if (filler) find("fix", "filler-copy", "Filler copy: " + filler.slice(0, 2).map((t) => JSON.stringify(t)).join(", "));
  return out;
})()`;

/* ------------------------------------------------------------------ run */
await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
mkdirSync(outDir, { recursive: true });
const all = {};
for (const p of paths) {
  const url = new URL(p, base).toString();
  try {
    await fetch(url, { signal: AbortSignal.timeout(180000) });
  } catch {}
  await send("Page.navigate", { url });
  await sleep(waitMs);
  const name = p.replace(/^\//, "").replace(/[/?=&#]+/g, "_") || "home";
  const shot = await send("Page.captureScreenshot", { format: "png" });
  if (shot.result?.data) writeFileSync(join(outDir, `${name}.png`), Buffer.from(shot.result.data, "base64"));
  const ev = await send("Runtime.evaluate", { expression: AUDIT, returnByValue: true });
  const res = ev.result?.result?.value ?? { error: ev.result?.exceptionDetails?.exception?.description ?? "audit failed" };
  res.url = url;
  writeFileSync(join(outDir, `${name}.audit.json`), JSON.stringify(res, null, 2));
  all[p] = res;
  if (!jsonOnly) {
    const fs = res.findings ?? [];
    console.log(`\n${p}  (${join(outDir, name)}.png)`);
    if (res.error) console.log(`  error: ${res.error}`);
    if (res.title) console.log(`  title ${res.title.size}px "${res.title.text}"; ${res.tables?.length ?? 0} tables, ${res.lists?.length ?? 0} lists, ${res.boxes ?? 0} boxes, ${res.pills?.count ?? 0} pills`);
    for (const f of fs.sort((a, b) => (a.level === b.level ? 0 : a.level === "fix" ? -1 : 1))) console.log(`  [${f.level}] ${f.rule}: ${f.detail}`);
    if (!fs.length && !res.error) console.log("  no rule breaks found; still look at the screenshot");
  }
}
if (jsonOnly) console.log(JSON.stringify(all, null, 2));
ws.close();
await cleanup();
const fixes = Object.values(all).reduce((n, r) => n + (r.findings ?? []).filter((f) => f.level === "fix").length, 0);
process.exit(fixes ? 1 : 0);
