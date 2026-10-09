import { resolveProjectAssetHref } from "@/data/project-detail"
import { site } from "@/data/site"
import { cn } from "@/lib/utils"

/** Outline chip linking to the resume PDF. Sits in the page header. */
export function ResumeChip({ className }: { className?: string }) {
  if (!site.resume) return null
  return (
    <a
      href={resolveProjectAssetHref(site.resume)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border border-border bg-background/70 px-2.5 py-1",
        "font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/60 no-underline",
        "transition-colors hover:border-foreground/40 hover:text-foreground",
        className,
      )}
    >
      Resume
      <span aria-hidden className="text-foreground/35">
        ↗
      </span>
    </a>
  )
}
