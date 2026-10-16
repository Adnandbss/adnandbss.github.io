import { ExperienceShots, type ExperienceShot } from "@/components/experience-shots"

const shots: ExperienceShot[] = [
  {
    src: "images/experience/wavestone/overview.svg",
    caption: "Three projects: the SharePoint cleanup, RTE's grid capacity in MW (Pays de la Loire, zone 3), and the IoT proof of concept sized for AKS",
    width: 1200,
    height: 620,
  },
  {
    src: "images/experience/wavestone/projection.png",
    caption: "RTE projection — allocated capacity to 2034, driven by editable assumptions per sector: time to commissioning, MW added per year, withdrawal rate",
    width: 1737,
    height: 752,
  },
  {
    src: "images/experience/wavestone/iot-architecture.svg",
    caption: "IoT proof of concept, local Docker environment — the ChirpStack stack sends data over HTTP to ThingsBoard CE, with every service and its port",
    width: 1200,
    height: 620,
  },
]

export function WavestoneFigures() {
  return <ExperienceShots title="Deliverables" shots={shots} />
}
