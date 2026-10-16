import { ExperienceShots, type ExperienceShot } from "@/components/experience-shots"

const shots: ExperienceShot[] = [
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
  return <ExperienceShots title="Dashboard" shots={shots} />
}
