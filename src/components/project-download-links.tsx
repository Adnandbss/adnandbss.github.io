import { Button } from "@/components/ui/button"
import { resolveProjectAssetHref } from "@/data/project-detail"
import { cn } from "@/lib/utils"
import { availablePaperFilenames } from "virtual:paper-availability"

/** Show a download link only if that file exists in `public/papers/` at build time. */
function hrefPointsToAvailableAsset(href: string): boolean {
  const t = href.trim()
  if (/^https?:\/\//i.test(t)) return false
  const base = t.split("/").pop() ?? ""
  return base.length > 0 && availablePaperFilenames.has(base)
}

function assetAnchorProps(href: string) {
  const resolved = resolveProjectAssetHref(href)
  const external = /^https?:\/\//i.test(href.trim())
  if (external) {
    return { href: resolved, target: "_blank" as const, rel: "noopener noreferrer" as const }
  }
  return { href: resolved, download: true as const }
}

type Props = {
  paperHref?: string
  posterHref?: string
  repoHref?: string
  className?: string
  buttonSize?: "default" | "sm" | "xs"
}

export function ProjectDownloadLinks({
  paperHref,
  posterHref,
  repoHref,
  className,
  buttonSize = "sm",
}: Props) {
  const paper = paperHref && hrefPointsToAvailableAsset(paperHref) ? paperHref : undefined
  const poster = posterHref && hrefPointsToAvailableAsset(posterHref) ? posterHref : undefined
  const repo = repoHref?.trim() ? repoHref.trim() : undefined
  if (!paper && !poster && !repo) return null
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {paper ? (
        <Button
          variant="outline"
          size={buttonSize}
          className="rounded-none"
          render={<a {...assetAnchorProps(paper)} />}
        >
          Paper (PDF)
        </Button>
      ) : null}
      {poster ? (
        <Button
          variant="outline"
          size={buttonSize}
          className="rounded-none"
          render={<a {...assetAnchorProps(poster)} />}
        >
          Slides (PDF)
        </Button>
      ) : null}
      {repo ? (
        <Button
          variant="outline"
          size={buttonSize}
          className="rounded-none"
          render={<a href={repo} target="_blank" rel="noopener noreferrer" />}
        >
          GitHub
        </Button>
      ) : null}
    </div>
  )
}
