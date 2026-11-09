export type TemplateMeta = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  href: string;
  previewImage: string;
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
    previewImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=70",
    componentPath: "src/components/ui/adjustable-glass-dashboard.tsx",
  },
];

export function getTemplate(slug: string) {
  return templates.find((item) => item.slug === slug);
}
