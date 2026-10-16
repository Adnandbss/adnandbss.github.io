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
    src: "images/experience/wavestone/iot-architecture.jpg",
    caption: "IoT proof of concept — ThingsBoard and ChirpStack, each on its own PostgreSQL, linked over MQTT, with Mosquitto, Redis and the gateway bridge, all in Docker",
    width: 863,
    height: 717,
  },
]

export function WavestoneFigures() {
  return <ExperienceShots title="Deliverables" shots={shots} />
}
