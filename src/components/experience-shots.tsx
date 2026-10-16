import { resolveProjectAssetHref } from "@/data/project-detail"

export type ExperienceShot = {
  /** Image under `public/`, e.g. `images/experience/<slug>/1.png`. */
  src: string
  caption: string
  width: number
  height: number
}

/** Full-width figures for one experience page, each with its caption. */
export function ExperienceShots({ title, shots }: { title: string; shots: ExperienceShot[] }) {
  return (
    <div className="mb-10">
      <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/45">
        <span className="text-foreground/25">{">"}</span> {title}
      </h3>
      {shots.map((shot) => (
        <figure key={shot.src} className="mb-8">
          <img
            src={resolveProjectAssetHref(shot.src)}
            alt={shot.caption}
            width={shot.width}
            height={shot.height}
            className="block h-auto w-full border border-border bg-background"
            draggable={false}
          />
          <figcaption className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{shot.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
