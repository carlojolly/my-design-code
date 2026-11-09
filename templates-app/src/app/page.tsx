import Link from "next/link";
import { TemplateCard } from "@/components/templates/template-card";
import { templates } from "@/lib/templates";

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.9_0.04_145)_0%,transparent_42%),radial-gradient(circle_at_85%_0%,oklch(0.93_0.03_85)_0%,transparent_40%),linear-gradient(165deg,oklch(0.98_0.01_95),oklch(0.94_0.02_150))]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-14 sm:px-8 sm:py-20">
        <header className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Design Code
          </p>
          <h1 className="text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
            Design Code
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            A growing set of reusable UI templates. Browse the template section
            and open live demos you can restyle against your tokens.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/templates"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm text-primary-foreground transition hover:opacity-90"
            >
              Browse templates
            </Link>
            <Link
              href="/templates/glassmorphism"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background/60 px-5 text-sm text-foreground transition hover:bg-background"
            >
              Open glassmorphism
            </Link>
          </div>
        </header>

        <section aria-labelledby="templates-heading" className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="templates-heading"
                className="text-2xl font-medium tracking-tight text-foreground"
              >
                Templates
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                First up: glassmorphism — frosted panels, adjustable material,
                and a full personal workspace.
              </p>
            </div>
            <Link
              href="/templates"
              className="hidden text-sm text-muted-foreground transition hover:text-foreground sm:inline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {templates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
