/**
 * Convert a satellite name to a URL-safe slug.
 * ISS (ZARYA) -> iss-zarya
 * STARLINK-1007 -> starlink-1007
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()[\]{}]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
