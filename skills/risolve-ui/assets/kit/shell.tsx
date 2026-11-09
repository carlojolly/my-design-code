"use client";

/**
 * The app window: a window tint, a sidebar ("rail") inset 10 px with the product's lockup, nav items
 * with a selection that glides between them, an optional list under the nav (customers, projects),
 * and the content sheet beside it. Plus the scrolling Page, the docked ask bar and the toolbar.
 *
 * Framework-agnostic: pass your router's Link as `link` (Next.js: `import Link from "next/link"`)
 * and the current path as `path`.
 */
import { type ComponentType, type FormEvent, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { GLASS } from "./index";
import { cn } from "@/lib/utils";

type LinkLike = ComponentType<{ href: string; className?: string; title?: string; children?: ReactNode }>;
const A: LinkLike = ({ href, className, title, children }) => (
  <a href={href} className={className} title={title}>
    {children}
  </a>
);

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** A count of things waiting for a person: shown as a yellow badge. Hide it at 0. */
  badge?: number;
  match?: (path: string) => boolean;
};

export type RailItem = { href: string; label: string; logo?: string; dot?: string };

export function AppWindow({
  brand,
  mark,
  nav,
  path,
  railTitle,
  rail,
  footer,
  link: Link = A,
  children,
}: {
  /** The product name, shown at 22 px bold beside its mark. */
  readonly brand: string;
  readonly mark?: ReactNode;
  readonly nav: readonly NavItem[];
  readonly path: string;
  /** A quiet list under the nav, e.g. "Customers" with their logos. */
  readonly railTitle?: string;
  readonly rail?: readonly RailItem[];
  readonly footer?: ReactNode;
  readonly link?: LinkLike;
  readonly children: ReactNode;
}) {
  const active = nav.findIndex((n) => (n.match ? n.match(path) : n.href === "/" ? path === "/" : path.startsWith(n.href)));
  return (
    <div className="flex h-dvh gap-2.5 bg-window p-2.5 text-ink max-md:flex-col">
      <aside className="relative flex w-[230px] shrink-0 flex-col overflow-hidden rounded-[18px] bg-rail px-3 pt-7 pb-4 shadow-[inset_0_0_0_1px_rgb(var(--ink-rgb)/0.05)] max-md:w-full max-md:flex-row max-md:items-center max-md:gap-2 max-md:overflow-x-auto max-md:px-2 max-md:py-2">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2.5 font-bold text-[22px] tracking-[-0.03em] max-md:mb-0 max-md:shrink-0">
          {mark}
          <span className="max-md:hidden">{brand}</span>
        </Link>

        <nav className="relative flex flex-col gap-1 max-md:flex-row">
          {active >= 0 ? (
            <span
              aria-hidden
              className="absolute right-0 left-0 h-[40px] rounded-[12px] bg-selection shadow-select transition-[top] duration-[450ms] ease-in-out-kit max-md:hidden"
              style={{ top: active * 44 }}
            />
          ) : null}
          {nav.map((n, i) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "relative z-10 flex h-[40px] items-center gap-3 rounded-[12px] px-2.5 text-[17px] tracking-[-0.015em] transition-colors max-md:shrink-0",
                  i !== active && "hover:bg-selection/40",
                  i === active && "max-md:bg-selection",
                )}
              >
                <Icon className="size-[19px] shrink-0" />
                <span>{n.label}</span>
                {n.badge ? (
                  <span className="ml-auto flex h-[21px] min-w-[23px] items-center justify-center rounded-full bg-pending px-1.5 font-bold text-[13px] text-pending-ink tabular-nums">{n.badge}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {rail?.length ? (
          <div className="mt-9 flex min-h-0 flex-1 flex-col max-md:hidden">
            {railTitle ? <div className="mb-2.5 px-2.5 text-[13px] text-ink-78">{railTitle}</div> : null}
            <ul className="-mx-1 flex min-h-0 flex-1 flex-col overflow-y-auto px-1 pb-2 [scrollbar-width:none]">
              {rail.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="flex h-[32px] items-center gap-2.5 rounded-[10px] px-2.5 text-[16px] transition-colors hover:bg-selection/40">
                    {r.logo ? (
                      // biome-ignore lint/performance/noImgElement: a 20 px logo
                      <img src={r.logo} alt="" width={20} height={20} className="size-[20px] shrink-0 rounded-[6px] bg-white object-contain shadow-[0_0_0_1px_rgb(var(--ink-rgb)/0.08)]" />
                    ) : (
                      <span className="flex size-[20px] shrink-0 items-center justify-center">
                        <i className="block size-[8px] rounded-full" style={{ background: r.dot ?? "var(--mist)" }} />
                      </span>
                    )}
                    <span className="truncate">{r.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {footer ? <div className="mt-auto flex flex-col gap-2 px-2.5 pt-3 max-md:hidden">{footer}</div> : null}
      </aside>

      <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[18px] bg-sheet shadow-sheet">{children}</main>
    </div>
  );
}

/**
 * A scrolling page inside the sheet, 1280 px wide at most. Pass `ask` to dock an AskBar at the
 * bottom of the sheet: content scrolls above it, and questions go there instead of explanations.
 */
export function Page({ children, className, ask }: { readonly children: ReactNode; readonly className?: string; readonly ask?: ReactNode }) {
  if (ask) {
    return (
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn("mx-auto w-full max-w-[1280px] space-y-8 px-9 pt-8 pb-8 max-md:px-4", className)}>{children}</div>
        </div>
        <div className="mx-auto w-full max-w-[980px] shrink-0 px-4 pt-2 pb-4 sm:px-6">{ask}</div>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto">
      <div className={cn("mx-auto w-full max-w-[1280px] space-y-8 px-9 pt-8 pb-16 max-md:px-4", className)}>{children}</div>
    </div>
  );
}

/**
 * The ask bar: one white input with a dark send button. Suggested questions appear above it while
 * it has focus, so the docked bar stays one line high and doesn't eat the table above it.
 * Pass `showQuestions="always"` on a page with little content (an empty Home).
 */
export function AskBar({
  placeholder,
  questions = [],
  onAsk,
  busy,
  showQuestions = "focus",
}: {
  /** Name what can be asked: "Ask about these orders…" */
  readonly placeholder: string;
  readonly questions?: readonly string[];
  readonly onAsk: (q: string) => void;
  readonly busy?: boolean;
  readonly showQuestions?: "focus" | "always";
}) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const send = (e?: FormEvent) => {
    e?.preventDefault();
    const t = q.trim();
    if (!t || busy) return;
    onAsk(t);
    setQ("");
  };
  return (
    <div>
      {questions.length && (showQuestions === "always" || focused) ? (
        // mousedown would blur the input before the click lands; keep focus so the pick registers
        <div onMouseDown={(e) => e.preventDefault()} className="rise">
          <ChipRail items={questions} onPick={onAsk} className="mb-1" />
        </div>
      ) : null}
      <form onSubmit={send} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="flex items-end gap-2 rounded-[18px] bg-white p-2 pl-4 shadow-ask">
        <textarea
          rows={1}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) send(e);
          }}
          placeholder={placeholder}
          className="max-h-40 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-ink-68"
        />
        <button type="submit" aria-label="Send" disabled={!q.trim() || busy} className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-ink text-tint transition-opacity disabled:opacity-35">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5 M5.5 11.5L12 5l6.5 6.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}

const CHIP = "shrink-0 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[14px] text-ink-78 shadow-chip transition-colors hover:bg-tint hover:text-ink";
const FADE = "linear-gradient(to right, transparent, #000 28px, #000 calc(100% - 56px), transparent)";

/**
 * Question chips on one line that never wraps or gets cut: when they fit they sit still; when they
 * don't, they glide left in a loop (paused on hover or focus) and fade at both edges.
 */
export function ChipRail({ items, onPick, className }: { readonly items: readonly string[]; readonly onPick: (q: string) => void; readonly className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const set = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const w = set.current?.scrollWidth ?? 0;
      const room = box.current?.clientWidth ?? 0;
      setOverflow(w > room + 1 ? w : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    if (set.current) ro.observe(set.current);
    return () => ro.disconnect();
  }, [items]);

  if (!items.length) return null;
  const moving = overflow > 0;
  const chips = (hidden: boolean) =>
    items.map((t) => (
      <button key={t} type="button" tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined} onClick={() => onPick(t)} className={CHIP}>
        {t}
      </button>
    ));
  return (
    <div ref={box} className={cn("group/rail relative overflow-hidden pt-1 pb-2.5", className)} style={moving ? { maskImage: FADE, WebkitMaskImage: FADE } : undefined}>
      <div
        className={cn("flex w-max", moving && "marquee group-hover/rail:[animation-play-state:paused] group-focus-within/rail:[animation-play-state:paused]")}
        style={moving ? { animationDuration: `${Math.round(overflow / 28)}s` } : undefined}
      >
        <div ref={set} className={cn("flex gap-2", moving && "pr-2")}>
          {chips(false)}
        </div>
        {moving ? <div className="flex gap-2 pr-2">{chips(true)}</div> : null}
      </div>
    </div>
  );
}

/** The toolbar at the right of every PageHeader: a Search capsule, a + capsule, the account. */
export function Toolbar({ onSearch, newHref, account, link: Link = A }: { readonly onSearch?: (q: string) => void; readonly newHref?: string; readonly account?: ReactNode; readonly link?: LinkLike }) {
  return (
    <>
      <div className="relative">
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-[11px] left-[14px] z-10 size-[16px]" fill="none" stroke="rgb(var(--ink-rgb) / 0.72)" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5L21 21" />
        </svg>
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => onSearch?.(e.target.value)}
          className={cn("h-[38px] w-[150px] rounded-full pr-3 pl-[38px] text-[15px] outline-none transition-[width] duration-300 placeholder:text-ink-78 focus:w-[220px]", GLASS)}
        />
      </div>
      {newHref ? (
        <Link href={newHref} title="New" className={cn("flex size-[38px] items-center justify-center rounded-full", GLASS)}>
          <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14 M5 12h14" />
          </svg>
        </Link>
      ) : null}
      {account ?? null}
    </>
  );
}
