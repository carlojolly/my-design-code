import Link from "next/link";
import GlassWorkspaceDemo from "@/components/templates/glassmorphism-demo";
import { getTemplate } from "@/lib/templates";

export const metadata = {
  title: "Glassmorphism template",
  description:
    "Adjustable glassmorphism personal finance workspace with live material controls.",
};

export default function GlassmorphismTemplatePage() {
  const template = getTemplate("glassmorphism");

  return (
    <div className="min-h-svh bg-background">
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-8">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Template
            </p>
            <h1 className="truncate text-sm font-medium text-foreground">
              {template?.title ?? "Glassmorphism"}
            </h1>
          </div>
          <nav className="flex shrink-0 items-center gap-4 text-sm text-muted-foreground">
            <Link href="/templates" className="transition hover:text-foreground">
              All templates
            </Link>
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
          </nav>
        </div>
      </div>
      <GlassWorkspaceDemo />
    </div>
  );
}
