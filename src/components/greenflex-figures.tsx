import { resolveProjectAssetHref } from "@/data/project-detail"

const shots = [
  {
    src: "images/experience/greenflex/overview.svg",
    caption: "Built as an intern, then sold as a paid deliverable on every ISO 50001 mission since",
    width: 1200,
    height: 620,
  },
  {
    src: "images/experience/greenflex/1.png",
    caption: "Site level — gas, real consumption against the modelled reference, and the savings month by month",
    width: 999,
    height: 568,
  },
  {
    src: "images/experience/greenflex/2.png",
    caption: "Significant energy uses — boilers and HVAC week by week, inside the model's error band",
    width: 1393,
    height: 777,
  },
  {
    src: "images/experience/greenflex/3.png",
    caption: "Influencing factors — cooling degree-days against HVAC gas, correlation 93.8%",
    width: 951,
    height: 523,
  },
  {
    src: "images/experience/greenflex/4.png",
    caption: "Seasonal model — auxiliary boiler, one model for summer and one for winter, against the realised load",
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
