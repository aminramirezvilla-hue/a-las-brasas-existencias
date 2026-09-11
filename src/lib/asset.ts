/** Public file URL that works on Grok (`/`) and GitHub Pages (`/repo/`). */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}
