export type TemplateMeta = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  href: string;
  /** Optional photo preview; prefer previewGradient for abstract templates. */
  previewImage?: string;
  previewGradient?: string;
  componentPath: string;
};

/** Catalog of UI templates available in this app. */
export const templates: TemplateMeta[] = [
  {
    slug: "glassmorphism",
    title: "Glassmorphism",
    summary:
      "Adjustable frosted-glass personal finance workspace with cash flow, activity, savings goals, and live material controls.",
    tags: ["dashboard", "glass", "finance", "gsap"],
    href: "/templates/glassmorphism",
    previewGradient:
      "linear-gradient(155deg, oklch(0.97 0.01 240) 0%, oklch(0.95 0.015 200) 42%, oklch(0.94 0.02 95) 100%)",
    componentPath: "src/components/ui/adjustable-glass-dashboard.tsx",
  },
];

export function getTemplate(slug: string) {
  return templates.find((item) => item.slug === slug);
}
