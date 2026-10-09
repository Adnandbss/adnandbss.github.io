export type ExperienceGalleryItem = {
  id: string
  caption: string
  /**
   * Image under `public/`, e.g. `images/experience/<slug>/1.png`.
   * Omit for placeholder.
   */
  imageHref?: string
}

export type ExperienceMetric = {
  value: string
  label: string
}

export type ExperienceDetail = {
  slug: string
  title: string
  org: string
  location: string
  duration: string
  /** One line on the home card — outcome, not duties. */
  blurb: string
  /** The constraint that made the job hard. */
  constraint: string
  metrics: ExperienceMetric[]
  owned: string[]
  description: string
  tags: string[]
  gallery: ExperienceGalleryItem[]
}

/**
 * One object per role. For each new slug also:
 * 1. add it to `experience-build.ts`
 * 2. add `experience/<slug>/index.html` (copy the comment block in the README)
 */
export const experienceDetails: ExperienceDetail[] = []

export function getExperienceBySlug(slug: string): ExperienceDetail | undefined {
  return experienceDetails.find((e) => e.slug === slug)
}
