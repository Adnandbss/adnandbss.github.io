import { Button } from "@/components/ui/button"
import { resolveProjectAssetHref } from "@/data/project-detail"
import { site } from "@/data/site"

/** Contact row. A link appears only when that field is filled in `site.ts`. */
export function ContactLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {site.email ? (
        <Button variant="outline" className="rounded-none" render={<a href={`mailto:${site.email}`} />}>
          Email
        </Button>
      ) : null}
      {site.github ? (
        <Button
          variant="outline"
          className="rounded-none"
          render={<a href={site.github} target="_blank" rel="noopener noreferrer" />}
        >
          GitHub
        </Button>
      ) : null}
      {site.linkedin ? (
        <Button
          variant="outline"
          className="rounded-none"
          render={<a href={site.linkedin} target="_blank" rel="noopener noreferrer" />}
        >
          LinkedIn
        </Button>
      ) : null}
      {site.resume ? (
        <Button
          variant="outline"
          className="rounded-none"
          render={<a href={resolveProjectAssetHref(site.resume)} target="_blank" rel="noopener noreferrer" />}
        >
          Resume (PDF)
        </Button>
      ) : null}
    </div>
  )
}
