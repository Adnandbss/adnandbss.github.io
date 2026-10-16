import { GreenflexFigures } from "@/components/greenflex-figures"
import { WavestoneFigures } from "@/components/wavestone-figures"

/**
 * Optional charts for one experience page.
 * Return a figure component for a slug once that role has one; otherwise nothing.
 */
export function ExperienceFigures({ slug }: { slug: string }) {
  if (slug === "greenflex") return <GreenflexFigures />
  if (slug === "wavestone") return <WavestoneFigures />
  return null
}
