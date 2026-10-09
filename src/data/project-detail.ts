/** New poster page: add `projects/<slug>/index.html`, then append the slug to `project-poster-build.ts`. */

export type ProjectGalleryItem = {
  id: string
  caption: string
  /**
   * Image under `public/images/projects/<this-project-slug>/` (no leading slash), e.g.
   * `images/projects/<slug>/1.png`. One folder per project; use `1.png`, `2.png`, … to match figure order.
   * Omit to show the dashed placeholder until you add the file.
   */
  imageHref?: string
}

export type ProjectDetail = {
  slug: string
  title: string
  subtitle: string
  year: string
  venue: string
  tags: string[]
  /** Site-relative path (e.g. papers/foo.pdf) or https URL — files live under `public/` when relative */
  paperHref?: string
  posterHref?: string
  repoHref?: string
  abstract: string
  problem: string
  approach: string
  outcome: string
  gallery: ProjectGalleryItem[]
}

/** Resolve a `public/` asset URL (PDFs, images). Relative paths use Vite `base` (e.g. /). */
export function resolveProjectAssetHref(href: string): string {
  if (/^https?:\/\//i.test(href.trim())) return href.trim()
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/")
  const path = href.replace(/^\//, "")
  return `${base}${path}`
}

/** One object per project. Keep `project-poster-build.ts` in the same order. */
export const projectDetails: ProjectDetail[] = []

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projectDetails.find((p) => p.slug === slug)
}
