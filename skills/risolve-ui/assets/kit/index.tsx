/**
 * The Risolve UI kit, cleaned for any project. React + Tailwind v4, tokens from assets/tokens.css.
 *
 * Copy this folder into the project as components/kit/ (index.tsx and shell.tsx).
 * Every size here is the shipped Risolve value, and most were raised in the redesign
 * (references/evolution.md): 30 px titles, 60 px table rows, 15 px table text, 28 px pills.
 * Keep them unless a screen proves they don't fit; when in doubt, go bigger, not smaller.
 *
 * Needs: `cn` (clsx + tailwind-merge, as in shadcn) at "@/lib/utils". Change the import if the
 * project keeps it elsewhere.
 */
import type React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ pills */

/**
 * Pill tones. No dark fills, and red only for "rejected":
 *   done     signal fill: the one positive state that should shout (confirmed, sent, paid)
 *   acted    the system did it on its own ("Auto: fixed"); ink on tint with a rim
 *   needs    a person must act; yellow. Name the action or the reason ("Retry the card", "18% over quote")
 *   quiet    informational, waiting, checking; tint with soft ink
 *   reject   an outcome that failed: rejected, declined, bounced, cancelled; soft red
 * A failed payment is `reject` ("Card declined"); if someone must chase it, say so in the On it
 * column ("Luis · send a payment link"), not by turning the failure yellow.
 */
export type PillTone = "done" | "acted" | "needs" | "quiet" | "reject";

const PILL: Record<PillTone, string> = {
  done: "bg-signal text-ink font-bold shadow-rim",
  acted: "bg-tint text-ink font-bold shadow-rim",
  needs: "bg-pending text-pending-ink font-bold",
  quiet: "bg-tint text-ink-68",
  reject: "bg-reject text-reject-ink font-bold",
};

export function Pill({ tone, children, className }: { readonly tone: PillTone; readonly children: ReactNode; readonly className?: string }) {
  return (
    <span className={cn("inline-flex h-[28px] items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[14px] leading-none", PILL[tone], className)}>
      {children}
    </span>
  );
}

/** A small red mark beside a wrong value. Never a red fill. */
export const WrongMark = () => <span className="ml-1.5 font-bold text-wrong">✗</span>;

/* ------------------------------------------------------- page structure */

/** Page header: one 30 px bold title and, on the right, the page's controls. No subtitle, ever. */
export function PageHeader({ title, children }: { readonly title: ReactNode; readonly children?: ReactNode }) {
  return (
    <header className="flex min-h-[40px] flex-wrap items-center justify-between gap-3">
      <h1 className="font-bold text-[30px] leading-none tracking-[-0.035em]">{title}</h1>
      {children ? <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  );
}

/** A page section: a short bold heading, an optional aside, then the content. No frame: the sheet is the frame. */
export function Section({
  title,
  aside,
  children,
  className,
  id,
}: {
  readonly title: ReactNode;
  readonly aside?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly id?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-6", className)}>
      <header className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="font-bold text-[17px] tracking-[-0.025em]">{title}</h2>
        {aside ? <div className="flex items-center gap-3 text-[13px] text-ink-68">{aside}</div> : null}
      </header>
      {children}
    </section>
  );
}

/**
 * A card frames ONE object: a chart, a map, a single widget. Never a list or a table
 * (those sit straight on the sheet).
 */
export function Card({ title, aside, children, className }: { readonly title?: ReactNode; readonly aside?: ReactNode; readonly children: ReactNode; readonly className?: string }) {
  return (
    <section className={cn("rounded-[16px] bg-sheet p-5 shadow-rim-strong", className)}>
      {title || aside ? (
        <header className="mb-3 flex items-center justify-between gap-3">
          {title ? <h2 className="font-bold text-[17px] tracking-[-0.02em]">{title}</h2> : <span />}
          {aside ? <div className="flex items-center gap-3 text-[13px] text-ink-78">{aside}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/** A legend dot and label for a chart card's aside. */
export const Legend = ({ color, children }: { readonly color: string; readonly children: ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <i className="block size-[9px] rounded-full" style={{ background: color }} />
    {children}
  </span>
);

/* ---------------------------------------------------------------- numbers */

/** A number on the sheet: label, value, a short note. No tile. */
export function Stat({ label, value, hint, className }: { readonly label: ReactNode; readonly value: ReactNode; readonly hint?: ReactNode; readonly className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="truncate text-[12px] text-ink-68">{label}</div>
      <div className="mt-0.5 font-bold text-[26px] tabular-nums leading-tight tracking-[-0.035em]">{value}</div>
      {hint ? <div className="mt-0.5 truncate text-[12px] text-ink-68">{hint}</div> : null}
    </div>
  );
}

/**
 * A KPI: label, one big number, a chevron when it leads somewhere. Every card stays the same quiet
 * sheet; only the number takes colour, and only `good` (money saved, a quantity to act on) does.
 */
const KPI_BOX = "bg-sheet shadow-rim-strong hover:bg-white";

export function Kpi({
  label,
  value,
  sub,
  tone = "plain",
  size = "md",
  onClick,
  href,
}: {
  readonly label: ReactNode;
  readonly value: ReactNode;
  /** A short line under the number, e.g. "was 7". */
  readonly sub?: ReactNode;
  readonly tone?: "plain" | "good";
  /** `sm` is a strip above a desk, so the content below keeps its room. */
  readonly size?: "md" | "sm";
  readonly onClick?: () => void;
  readonly href?: string;
}) {
  const sm = size === "sm";
  const body = (
    <>
      <span className={cn("block truncate text-ink-78", sm ? "text-[12px]" : "text-[13px]")}>{label}</span>
      <b className={cn("block font-bold tabular-nums leading-none tracking-[-0.03em]", sm ? "mt-0.5 text-[22px]" : "mt-1 text-[28px]", tone === "good" && "text-signal-deep")}>{value}</b>
      {sub ? <span className={cn("block truncate text-[13px] text-ink-68 tabular-nums", sm ? "mt-1" : "mt-1.5")}>{sub}</span> : null}
      {onClick || href ? <span className={cn("absolute text-[16px] text-ink-50", sm ? "top-2 right-3" : "top-3 right-4")}>›</span> : null}
    </>
  );
  const cls = cn("relative block min-w-0 text-left transition-colors", sm ? "rounded-[12px] px-3 pt-2 pb-2" : "rounded-[14px] px-4 pt-3 pb-3.5", KPI_BOX);
  if (href)
    return (
      <a href={href} className={cls}>
        {body}
      </a>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cls}>
        {body}
      </button>
    );
  return <div className={cls}>{body}</div>;
}

export type MeterTone = "ink" | "good" | "signal" | "wrong";
const METER: Record<MeterTone, string> = {
  ink: "bg-ink",
  good: "bg-chart-expect",
  signal: "bg-signal",
  wrong: "bg-wrong",
};

/** A thin fill bar: how full a truck is, how much cover is left. */
export function Meter({ value, max, tone = "ink", className, label }: { readonly value: number; readonly max: number; readonly tone?: MeterTone; readonly className?: string; readonly label?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className={cn("h-[6px] w-full overflow-hidden rounded-full bg-ink/[0.07]", className)} role="meter" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out-kit", METER[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ----------------------------------------------------------------- people */

export type OwnerKind = "person" | "team" | "system" | "company" | "none";

/**
 * Who has it. A person shows their face (photo) or initials on ink; a team shows initials on mist;
 * the system shows `systemMark` (your product's mark); a company is quiet initials or its logo.
 */
export function Avatar({
  kind,
  name,
  photo,
  size = 22,
  systemMark,
}: {
  readonly kind: OwnerKind;
  readonly name: string;
  readonly photo?: string;
  readonly size?: number;
  readonly systemMark?: ReactNode;
}) {
  const initials = name
    .replace(/,.*$/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const style = { width: size, height: size, fontSize: Math.round(size * 0.42) };
  if (kind === "system" && systemMark) return <span className="inline-flex shrink-0" style={style}>{systemMark}</span>;
  if (photo)
    return (
      // biome-ignore lint/performance/noImgElement: a small portrait or logo
      <img src={photo} alt={name} width={size} height={size} className={cn("shrink-0 object-cover ring-1 ring-hairline", kind === "company" ? "rounded-[6px] bg-white object-contain" : "rounded-full")} style={style} />
    );
  const tone =
    kind === "person" ? "bg-ink text-tint" : kind === "team" ? "bg-mist text-ink" : kind === "system" ? "bg-ink text-signal" : "bg-tint text-ink-78 ring-1 ring-hairline";
  if (kind === "none") return <span className="inline-flex shrink-0 rounded-full bg-mist ring-1 ring-hairline" style={style} />;
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold", tone)} style={style}>
      {initials}
    </span>
  );
}

/** "On it": face, first name, then role or what they are doing in soft ink. */
export function Owner({
  kind,
  name,
  photo,
  role,
  doing,
  compact,
  systemMark,
}: {
  readonly kind: OwnerKind;
  readonly name: string;
  readonly photo?: string;
  readonly role?: string;
  readonly doing?: string;
  readonly compact?: boolean;
  readonly systemMark?: ReactNode;
}) {
  const first = kind === "person" ? name.split(" ")[0] : name;
  return (
    <span className="inline-flex min-w-0 items-center gap-2 align-middle">
      <Avatar kind={kind} name={name} photo={photo} size={compact ? 18 : 22} systemMark={systemMark} />
      <span className={cn("truncate", compact ? "text-[12px]" : "text-[13px]")}>
        <span className="font-bold text-ink">{kind === "none" ? "Done" : first}</span>
        {/* On phones the face and first name are enough; the rest is in the drawer. */}
        {role ? <span className="text-ink-68 max-md:hidden"> · {role}</span> : null}
        {doing && kind !== "none" ? <span className="text-ink-68 max-md:hidden"> · {doing}</span> : null}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- actions */

const BTN = {
  primary: "bg-ink text-window font-bold hover:bg-ink/90",
  quiet: "bg-ink/[0.06] text-ink font-bold hover:bg-ink/[0.1]",
  outline: "bg-white text-ink font-bold ring-1 ring-hairline hover:bg-tint",
} as const;

/** A pill button. One primary per view (the action the screen exists for); quiet for the rest. */
export function Btn({
  children,
  variant = "primary",
  className,
  ...rest
}: { readonly children: ReactNode; readonly variant?: keyof typeof BTN } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={cn("inline-flex h-[34px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] transition-colors disabled:pointer-events-none disabled:opacity-40", BTN[variant], className)}
    >
      {children}
    </button>
  );
}

/** Glass: white over blur with a bright rim. Only for small floating controls (toolbar capsules, segmented, close). */
export const GLASS = "bg-white/45 backdrop-blur-[26px] backdrop-saturate-[1.85] shadow-glass";

/** The glass segmented control: filters with counts. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  readonly options: { value: T; label: string; count?: number }[];
  readonly value: T;
  readonly onChange: (v: T) => void;
}) {
  return (
    <div className={cn("inline-flex h-[38px] max-w-full items-center gap-0.5 overflow-x-auto rounded-full p-[4px] [scrollbar-width:none]", GLASS)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "h-[30px] shrink-0 whitespace-nowrap rounded-full px-3.5 text-[14px] transition-colors duration-300",
            o.value === value ? "bg-ink font-bold text-tint" : "text-ink-78 hover:text-ink",
          )}
        >
          {o.label}
          {o.count != null ? <span className="ml-1.5 tabular-nums">{o.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ table */

export type Column<T> = {
  key: string;
  header: string;
  /** The cell that names the row: bold, full ink, 16 px. One per table. */
  main?: boolean;
  align?: "left" | "right";
  width?: string;
  /** Keep this column on phones. When any column is essential, the others hide under 768 px (their data belongs in the drawer). */
  essential?: boolean;
  cell: (row: T) => ReactNode;
};

/** The table: light header, 60 px rows split by a hairline, no box, no zebra. Rows open a Drawer. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKey,
  empty = "Nothing here yet.",
}: {
  readonly columns: Column<T>[];
  readonly rows: T[];
  readonly rowKey: (row: T) => string;
  readonly onRowClick?: (row: T) => void;
  readonly selectedKey?: string;
  readonly empty?: ReactNode;
}) {
  if (!rows.length) return <p className="py-6 text-center text-[15px] text-ink-68">{empty}</p>;
  const narrow = columns.some((c) => c.essential);
  const hide = (c: Column<T>) => narrow && !c.essential && "max-md:hidden";
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left [&_tbody_tr+tr_td]:border-hairline [&_tbody_tr+tr_td]:border-t">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn("whitespace-nowrap pr-6 pb-2 font-medium text-[13px] text-ink-68 first:pl-3 last:pr-3 max-md:pr-3", c.align === "right" && "text-right", hide(c))}
                style={c.width ? { width: c.width } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const k = rowKey(r);
            return (
              <tr
                key={k}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={cn(onRowClick && "cursor-pointer transition-colors hover:bg-white", selectedKey === k && "bg-white")}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "h-[60px] whitespace-nowrap pr-6 text-[15px] tabular-nums first:rounded-l-[12px] first:pl-3 last:rounded-r-[12px] last:pr-3 max-md:pr-3",
                      c.main ? "font-bold text-[16px] text-ink tracking-[-0.02em]" : "text-ink-68",
                      c.align === "right" && "text-right",
                      hide(c),
                    )}
                  >
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------------------------------- drawer */

/**
 * Details slide in from the right edge of the sheet. Use instead of a list-and-detail split.
 * The parent must be `relative` (the sheet is).
 */
export function Drawer({ open, onClose, children }: { readonly open: boolean; readonly onClose: () => void; readonly children: ReactNode }) {
  return (
    <>
      <div onClick={onClose} className={cn("absolute inset-0 z-20 bg-ink/[0.06] transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")} />
      <aside
        className={cn(
          "absolute top-0 right-0 bottom-0 z-30 w-[min(620px,92%)] overflow-y-auto rounded-l-[22px] bg-sheet shadow-drawer transition-transform duration-500 ease-drawer",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        <button type="button" onClick={onClose} aria-label="Close" className={cn("absolute top-5 right-5 z-10 flex size-[36px] items-center justify-center rounded-full text-[18px] text-ink-78", GLASS)}>
          ×
        </button>
        <div className="px-8 pt-8 pb-10">{children}</div>
      </aside>
    </>
  );
}

/** Key/value list for a drawer. */
export function Facts({ items }: { readonly items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 text-[13px]">
      {items.map(([k, v], i) => (
        <div key={i} className="contents">
          <dt className="text-ink-68">{k}</dt>
          <dd className="min-w-0 text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* --------------------------------------------------------- sources, files */

/** Where a number came from: a document, a record, a URL. Put one beside any figure a person acts on. */
export function SourceTag({ children, title }: { readonly children: ReactNode; readonly title?: string }) {
  return (
    <span title={title} className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md bg-tint px-1.5 py-0.5 font-medium text-[11px] text-ink-78">
      {children}
    </span>
  );
}

/** A document you can download. */
export function DocLink({ href, kind, label, className }: { readonly href: string; readonly kind: string; readonly label?: string | null; readonly className?: string }) {
  return (
    <a href={href} download className={cn("inline-flex h-[34px] max-w-full items-center gap-2 rounded-[10px] bg-white px-3 text-[13px] shadow-rim transition-colors hover:bg-tint", className)}>
      <svg viewBox="0 0 20 20" className="size-[15px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 2.5h6.5L15 6v11.5H5z M11.5 2.5V6H15 M10 9v5.5 M7.5 12l2.5 2.5 2.5-2.5" />
      </svg>
      <b className="shrink-0">{kind}</b>
      {label ? <span className="truncate text-ink-68">{label}</span> : null}
    </a>
  );
}

/* --------------------------------------------------------------- formats */

/** Money, quantities and dates the way people say them. Set the locale and currency once per project. */
export const money = (v: number | null | undefined, digits = 0, currency = "EUR", locale = "en-GB") =>
  v == null ? "–" : v.toLocaleString(locale, { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits });

export const qty = (v: number | null | undefined, locale = "en-GB") => (v == null ? "–" : v.toLocaleString(locale, { maximumFractionDigits: 2 }));

/** "12 Nov", not "2026-11-12" or "W46". */
export const day = (iso: string | null | undefined, locale = "en-GB") =>
  iso ? new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" }) : "–";
