import { resolveProjectAssetHref } from "@/data/project-detail"

const shots = [
  {
    src: "images/experience/greenflex/1.png",
    caption: "Site level — gas, consumption against the reference",
    width: 942,
    height: 536,
  },
  {
    src: "images/experience/greenflex/2.png",
    caption: "Equipment level — boilers and HVAC, week by week",
    width: 1014,
    height: 566,
  },
  {
    src: "images/experience/greenflex/3.png",
    caption: "What drives the load — degree-days against consumption",
    width: 968,
    height: 534,
  },
  {
    src: "images/experience/greenflex/4.png",
    caption: "Forecast — auxiliary boiler, realised load and the model",
    width: 916,
    height: 300,
  },
]

export function GreenflexFigures() {
  return (
    <div className="mb-10">
      <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/45">
        <span className="text-foreground/25">{">"}</span> Dashboard
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
