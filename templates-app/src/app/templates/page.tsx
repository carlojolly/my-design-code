import Link from "next/link";
import { TemplateCard } from "@/components/templates/template-card";
import { templates } from "@/lib/templates";

export const metadata = {
  title: "Templates",
  description: "Reusable UI templates for product and marketing surfaces.",
};

export default function TemplatesPage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.92_0.02_95)_0%,_transparent_55%),linear-gradient(180deg,oklch(0.97_0.01_95),oklch(0.94_0.02_140))]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <header className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-normal tracking-normal text-muted-foreground">
              Template section
            </p>
            <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              Templates
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start from production-ready UI patterns. Glassmorphism is the
              first entry — an adjustable frosted workspace you can restyle
              against host theme tokens.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Home
          </Link>
        </header>

        <section aria-label="Available templates" className="grid gap-6 md:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </section>
      </div>
    </main>
  );
}
