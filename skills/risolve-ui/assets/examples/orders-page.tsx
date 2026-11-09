"use client";

/**
 * Worked example: the inbox pattern (Risolve's Orders page) for a different business, a coffee
 * roaster that sells to cafés. Copy the structure, not the data.
 *
 * What to notice:
 * - One title, no subtitle. The filters carry the counts, so nothing needs explaining, and there is
 *   no KPI strip repeating those counts (Risolve keeps KPIs for Home).
 * - The table sits on the sheet: no box, 60 px rows, the order ref bold, values right-aligned.
 * - Each column shows something that differs per row: who has it, what it is worth, its state.
 *   There is no "Notes" column repeating "All checks passed" down the page.
 * - Status colour separates the few that need a person (yellow) from the rest (quiet, or the
 *   signal fill for done). Most rows are quiet because most things are fine.
 * - Details open in a drawer from the right instead of a list-and-detail split.
 * - Questions go to the ask bar at the bottom, with suggested questions written from the data.
 * - The data looks real: 24 orders, named cafés, named people, varied amounts and dates.
 */
import { useMemo, useState } from "react";
import { DataTable, Drawer, Facts, Owner, PageHeader, Pill, type PillTone, Segmented, SourceTag, day, money, qty } from "@/components/kit";
import { AppWindow, AskBar, Page, Toolbar } from "@/components/kit/shell";

type Status = "needs" | "moving" | "done";
type Order = {
  ref: string;
  cafe: string;
  city: string;
  product: string;
  kg: number;
  value: number;
  due: string;
  status: Status;
  label: string;
  owner: { kind: "person" | "system" | "none"; name: string; role?: string; doing?: string };
};

const P = {
  marta: { kind: "person" as const, name: "Marta Lindqvist", role: "Accounts" },
  jonas: { kind: "person" as const, name: "Jonas Weber", role: "Roastery" },
  aiko: { kind: "person" as const, name: "Aiko Tanaka", role: "Dispatch" },
};

// Seeded like a real week: most orders move on their own, a few wait for a person, some are done.
const ORDERS: Order[] = [
  { ref: "NR-2318", cafe: "Kaffebaren Söder", city: "Stockholm", product: "Ethiopia Guji", kg: 24, value: 612, due: "2026-11-10", status: "needs", label: "Price differs", owner: { ...P.marta, doing: "check the quote" } },
  { ref: "NR-2317", cafe: "Bröd & Salt", city: "Stockholm", product: "House espresso", kg: 60, value: 1140, due: "2026-11-10", status: "moving", label: "Roasting", owner: { ...P.jonas } },
  { ref: "NR-2316", cafe: "Café Pascal", city: "Uppsala", product: "Colombia Huila", kg: 12, value: 318, due: "2026-11-11", status: "moving", label: "Packed", owner: { ...P.aiko } },
  { ref: "NR-2315", cafe: "Drop Coffee", city: "Stockholm", product: "Decaf Sugarcane", kg: 8, value: 236, due: "2026-11-11", status: "needs", label: "Short 3 kg", owner: { ...P.jonas, doing: "split or wait" } },
  { ref: "NR-2314", cafe: "Mellqvist", city: "Stockholm", product: "House espresso", kg: 40, value: 760, due: "2026-11-12", status: "moving", label: "Confirmed", owner: { kind: "system", name: "Auto", doing: "matched quote Q-1179" } },
  { ref: "NR-2313", cafe: "Snickarbacken 7", city: "Stockholm", product: "Kenya Nyeri", kg: 18, value: 549, due: "2026-11-12", status: "moving", label: "Roasting", owner: { ...P.jonas } },
  { ref: "NR-2312", cafe: "Johan & Nyström", city: "Göteborg", product: "Brazil Cerrado", kg: 90, value: 1485, due: "2026-11-13", status: "moving", label: "Confirmed", owner: { kind: "system", name: "Auto", doing: "booked the Tuesday roast" } },
  { ref: "NR-2311", cafe: "Café Saturnus", city: "Stockholm", product: "House filter", kg: 30, value: 525, due: "2026-11-09", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2310", cafe: "Kafé Kotten", city: "Göteborg", product: "Ethiopia Guji", kg: 10, value: 255, due: "2026-11-09", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2309", cafe: "Ritorno", city: "Stockholm", product: "House espresso", kg: 50, value: 950, due: "2026-11-13", status: "moving", label: "Packed", owner: { ...P.aiko } },
  { ref: "NR-2308", cafe: "Pom & Flora", city: "Stockholm", product: "Guatemala Huehue", kg: 16, value: 432, due: "2026-11-14", status: "needs", label: "New address", owner: { ...P.aiko, doing: "confirm delivery point" } },
  { ref: "NR-2307", cafe: "Fabrique", city: "Malmö", product: "House filter", kg: 120, value: 2040, due: "2026-11-14", status: "moving", label: "Confirmed", owner: { kind: "system", name: "Auto", doing: "matched last month's price" } },
  { ref: "NR-2306", cafe: "Lilla Kafferosteriet", city: "Malmö", product: "Kenya Nyeri", kg: 6, value: 189, due: "2026-11-08", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2305", cafe: "Café Pascal", city: "Uppsala", product: "House espresso", kg: 20, value: 380, due: "2026-11-08", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2304", cafe: "Gast", city: "Stockholm", product: "Colombia Huila", kg: 14, value: 371, due: "2026-11-15", status: "moving", label: "Roasting", owner: { ...P.jonas } },
  { ref: "NR-2303", cafe: "Espresso House Odenplan", city: "Stockholm", product: "House espresso", kg: 200, value: 3600, due: "2026-11-15", status: "needs", label: "Over credit limit", owner: { ...P.marta, doing: "approve or hold" } },
  { ref: "NR-2302", cafe: "Vete-Katten", city: "Stockholm", product: "House filter", kg: 45, value: 787, due: "2026-11-16", status: "moving", label: "Confirmed", owner: { kind: "system", name: "Auto", doing: "booked the Thursday roast" } },
  { ref: "NR-2301", cafe: "Bar Agrikultur", city: "Stockholm", product: "Decaf Sugarcane", kg: 4, value: 118, due: "2026-11-07", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2300", cafe: "Cafe Konditori Ritorno", city: "Stockholm", product: "Brazil Cerrado", kg: 35, value: 577, due: "2026-11-16", status: "moving", label: "Packed", owner: { ...P.aiko } },
  { ref: "NR-2299", cafe: "Kaffebaren Söder", city: "Stockholm", product: "House espresso", kg: 30, value: 570, due: "2026-11-07", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2298", cafe: "Two Little Birds", city: "Göteborg", product: "Ethiopia Guji", kg: 9, value: 230, due: "2026-11-17", status: "moving", label: "Confirmed", owner: { kind: "system", name: "Auto", doing: "matched quote Q-1185" } },
  { ref: "NR-2297", cafe: "Da Matteo", city: "Göteborg", product: "Kenya Nyeri", kg: 22, value: 671, due: "2026-11-06", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2296", cafe: "Café Husaren", city: "Göteborg", product: "House filter", kg: 25, value: 437, due: "2026-11-06", status: "done", label: "Delivered", owner: { kind: "none", name: "" } },
  { ref: "NR-2295", cafe: "Mahalo", city: "Stockholm", product: "Guatemala Huehue", kg: 11, value: 297, due: "2026-11-18", status: "moving", label: "Roasting", owner: { ...P.jonas } },
];

const TONE: Record<Status, PillTone> = { needs: "needs", moving: "quiet", done: "done" };
type Filter = "all" | Status;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "needs", label: "Needs you" },
  { value: "moving", label: "Moving" },
  { value: "done", label: "Done" },
];

const Mark = () => (
  <span className="flex size-[30px] items-center justify-center rounded-[9px] bg-ink font-bold text-[15px] text-signal">N</span>
);
// One icon per section, same 1.8 px line weight (draw your own; never mix icon sets).
const icon = (d: string) =>
  function SectionIcon({ className }: { className?: string }) {
    return (
      <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={d} />
      </svg>
    );
  };
const HomeIcon = icon("M3.5 9 10 3.5 16.5 9v7.5h-13z M8 16.5v-4.5h4v4.5");
const OrdersIcon = icon("M3.5 6.5h13v9.5h-13z M3.5 6.5l2-3h9l2 3 M8 10h4");
const RoastIcon = icon("M10 3c3.5 2 3.5 5.5 0 7s-3.5 5 0 7 M6.5 4.5c-2.5 3-2.5 8 0 11 M13.5 4.5c2.5 3 2.5 8 0 11");
const DispatchIcon = icon("M2.5 5.5h9v8h-9z M11.5 8.5h3l2.5 2.5v2.5h-5.5 M5.5 16a1.5 1.5 0 1 0 0-.01 M14 16a1.5 1.5 0 1 0 0-.01");
const InvoiceIcon = icon("M5 2.5h10v15l-2.5-1.5-2.5 1.5-2.5-1.5L5 17.5z M8 7h4 M8 10.5h4");

export default function OrdersPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Order | null>(null);
  const rows = useMemo(() => {
    const scoped = filter === "all" ? ORDERS : ORDERS.filter((o) => o.status === filter);
    // Attention first, nothing hidden.
    return [...scoped].sort((a, b) => Number(b.status === "needs") - Number(a.status === "needs"));
  }, [filter]);

  return (
    <AppWindow
      brand="Norrbrand"
      mark={<Mark />}
      path="/orders"
      nav={[
        { href: "/", label: "Home", icon: HomeIcon },
        { href: "/orders", label: "Orders", icon: OrdersIcon, badge: ORDERS.filter((o) => o.status === "needs").length },
        { href: "/roasting", label: "Roasting", icon: RoastIcon },
        { href: "/dispatch", label: "Dispatch", icon: DispatchIcon },
        { href: "/invoices", label: "Invoices", icon: InvoiceIcon },
      ]}
      railTitle="Cafés"
      rail={["Kaffebaren Söder", "Drop Coffee", "Café Pascal", "Fabrique", "Da Matteo", "Pom & Flora"].map((n) => ({ href: `/orders?cafe=${encodeURIComponent(n)}`, label: n }))}
    >
      <Page
        ask={
          <AskBar
            placeholder="Ask about these orders…"
            questions={["Which orders are over the credit limit?", "What runs short this week?", "Who orders Ethiopia Guji most?", "Is NR-2315 worth splitting?"]}
            onAsk={() => {}}
          />
        }
      >
        <PageHeader title="Orders">
          <Segmented options={FILTERS.map((f) => ({ ...f, count: f.value === "all" ? ORDERS.length : ORDERS.filter((o) => o.status === f.value).length }))} value={filter} onChange={setFilter} />
          <Toolbar newHref="/orders/new" />
        </PageHeader>

        <DataTable
          rows={rows}
          rowKey={(r) => r.ref}
          onRowClick={setOpen}
          selectedKey={open?.ref}
          empty="No orders here."
          columns={[
            { key: "ref", header: "Order", main: true, essential: true, cell: (r) => r.ref },
            { key: "cafe", header: "Café", cell: (r) => <span className="text-ink">{r.cafe}</span> },
            { key: "what", header: "Coffee", cell: (r) => `${r.product} · ${qty(r.kg)} kg` },
            { key: "who", header: "On it", essential: true, cell: (r) => <Owner kind={r.owner.kind} name={r.owner.name} role={r.owner.role} doing={r.owner.doing} /> },
            { key: "due", header: "Due", cell: (r) => day(r.due) },
            { key: "value", header: "Value", align: "right", cell: (r) => <b className="font-bold text-[16px] text-ink">{money(r.value)}</b> },
            { key: "status", header: "Status", essential: true, cell: (r) => <Pill tone={TONE[r.status]}>{r.label}</Pill> },
          ]}
        />
      </Page>

      <Drawer open={!!open} onClose={() => setOpen(null)}>
        {open ? (
          <div className="space-y-6">
            <div>
              <h2 className="font-bold text-[26px] tracking-[-0.03em]">{open.ref}</h2>
              <p className="mt-1 text-[15px] text-ink-68">
                {open.cafe}, {open.city}
              </p>
            </div>
            <Pill tone={TONE[open.status]}>{open.label}</Pill>
            <Facts
              items={[
                ["Coffee", `${open.product}, ${qty(open.kg)} kg`],
                ["Value", <span key="v">{money(open.value)} <SourceTag title="Quote Q-1182">Quote</SourceTag></span>],
                ["Due", day(open.due)],
                ["On it", open.owner.kind === "none" ? "Done" : open.owner.name],
              ]}
            />
          </div>
        ) : null}
      </Drawer>
    </AppWindow>
  );
}
