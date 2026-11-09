import Link from "next/link";
import type { TemplateMeta } from "@/lib/templates";

export function TemplateCard({ template }: { template: TemplateMeta }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/40">
      <Link href={template.href} className="block outline-none">
        <div
          className="relative aspect-[16/10] overflow-hidden"
          style={
            template.previewGradient
              ? { background: template.previewGradient }
              : undefined
          }
        >
          {template.previewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={template.previewImage}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-[18%] rounded-2xl border border-white/50 bg-white/35 shadow-[0_20px_50px_-28px_rgba(20,30,40,0.35)] backdrop-blur-md transition duration-500 group-hover:scale-[1.02]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent" />
        </div>
        <div className="space-y-3 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            {template.title}
          </h2>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {template.summary}
          </p>
          <span className="inline-flex items-center gap-2 text-sm text-foreground">
            Open template
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
