export const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export const uniqueSlug = (base: string) =>
  `${slugify(base) || "item"}-${Math.random().toString(36).slice(2, 7)}`;
