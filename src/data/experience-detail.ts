export type ExperienceGalleryItem = {
  id: string
  caption: string
  /**
   * Image under `public/`, e.g. `images/experience/<slug>/1.png`.
   * Omit for placeholder.
   */
  imageHref?: string
}

export type ExperienceMetric = {
  value: string
  label: string
}

export type ExperienceDetail = {
  slug: string
  title: string
  org: string
  location: string
  duration: string
  /** One line on the home card — outcome, not duties. */
  blurb: string
  /** The constraint that made the job hard. */
  constraint: string
  metrics: ExperienceMetric[]
  owned: string[]
  description: string
  tags: string[]
  /** Image on the home card, under `public/`. Defaults to the first gallery image. */
  cover?: string
  gallery: ExperienceGalleryItem[]
}

/**
 * One object per role. For each new slug also:
 * 1. add it to `experience-build.ts`
 * 2. add `experience/<slug>/index.html` (copy the comment block in the README)
 */
export const experienceDetails: ExperienceDetail[] = [
  {
    slug: "eurogroup",
    title: "Product Manager",
    org: "Eurogroup Consulting",
    location: "Paris, France",
    duration: "December 2025 — September 2026",
    blurb:
      "Product lead on a €2M SNCF application now live in 3,000 stations, and on the rollout of a project-management tool for 10,000 users at the Ministry of the Armed Forces.",
    constraint:
      "Five million people use the railway every day. A requirement that stays in a workshop never reaches them — it has to become a story a ten-person team can build, test, and put in a station.",
    metrics: [
      { value: "5M", label: "daily users" },
      { value: "3,000", label: "train stations" },
      { value: "€2M", label: "SNCF RFP" },
      { value: "10k+", label: "users onboarded" },
    ],
    owned: [
      "End-to-end Agile delivery of the SNCF web and mobile application with a cross-functional team of 10 developers, from a €2M RFP to deployment across 3,000 French train stations",
      "100+ user interviews in three months, turned into user stories, wireframes, and the product roadmap, then ticket triage through testing",
      "Adoption and change management for a platform project-management SaaS at the Ministry of the Armed Forces, onboarding 10,000+ end users through data-backed iteration",
    ],
    description:
      "Two products, one job: make the specification something an operation can run. For SNCF, that was a new web and mobile application. I managed the €2M RFP and led a cross-functional team of ten developers through Agile delivery. It is now deployed across 3,000 French train stations, in front of more than five million daily users.\n\n" +
      "The roadmap came from the people who would use it. Over three months I ran more than a hundred user interviews, wrote the stories and the wireframes, and stayed on the tickets through testing so the build matched what the interviews had actually said.\n\n" +
      "The second mandate was adoption. The Ministry of the Armed Forces was moving onto a platform project-management SaaS. I directed the change plan and onboarded more than 10,000 end users, iterating on what the usage data showed rather than on the launch announcement.",
    tags: ["Product", "Agile", "SNCF", "Discovery"],
    gallery: [],
  },
  {
    slug: "wavestone",
    title: "Technical Product Manager",
    org: "Wavestone",
    location: "Paris, France",
    duration: "February 2025 — January 2026",
    blurb:
      "A Python interface that cleans SharePoint across 3,000+ TB for 6,000+ users, cutting manual cleanup time by 90%. Excel and Power BI dashboards for RTE on renewable grid connections. An IoT proof of concept sized for Azure Kubernetes.",
    constraint:
      "Three problems, one shape: data nobody could act on. Thousands of terabytes of SharePoint sorted by hand, renewable connections tracked region by region, and an IoT chain to stand up on containers because virtual machines were ruled out.",
    metrics: [
      { value: "3,000+ TB", label: "SharePoint cleaned" },
      { value: "6,000+", label: "users" },
      { value: "−90%", label: "manual cleanup time" },
    ],
    owned: [
      "A Python interface for SharePoint cleanup, run locally, over 3,000+ TB for 6,000+ users — modular, with JSON logging — that cut manual cleanup time by 90%",
      "Excel and Power BI dashboards for RTE's S3REnR programme, one per region, that give every grid investment a capacity in MW without a network study",
      "An IoT proof of concept on LoRaWAN — ChirpStack, ThingsBoard and PostgreSQL in Docker — sized for Azure Kubernetes at 3 vCPU and 5 GB of RAM",
    ],
    description:
      "The largest of the three was a cleanup. SharePoint had grown past 3,000 terabytes for more than 6,000 users, and sorting it was manual work. I built a Python interface, run locally, that does that sorting. The design is modular and every run writes JSON logs, so a failure is a record rather than a missing file. Manual cleanup time dropped by 90%.\n\n" +
      "For RTE, the French transmission operator, the S3REnR programme plans how renewables connect to the grid. I delivered one Excel and Power BI dashboard per region. The rule behind them gives every grid investment a capacity in megawatts from the region's reserved capacity, quasi-automatically and without a network study, so a regional pilot can answer a national request from the figure.\n\n" +
      "The third was an IoT proof of concept on LoRaWAN: ChirpStack as the network server, ThingsBoard for devices and dashboards, PostgreSQL underneath, all in Docker because virtual machines were ruled out. I sized it for Azure Kubernetes: 10 sensors at one message every 30 minutes, about 1.5 GB a year, 3 vCPU and 5 GB of RAM.",
    tags: ["Python", "SharePoint", "Power BI", "IoT", "AKS"],
    cover: "images/experience/wavestone/overview.svg",
    gallery: [],
  },
  {
    slug: "greenflex",
    title: "Data & Strategy Consultant Intern",
    org: "Greenflex",
    location: "Paris, France",
    duration: "September 2024 — February 2025",
    blurb:
      "Built solo as an intern: a Power BI and VBA dashboard for gas and electricity, first sold on a pharmaceutical mission, now sold as a service on every ISO 50001 engagement: 10 missions in 2025, 17 so far in 2026. Roadmaps projecting a 45% cut in GHG.",
    constraint:
      "A reduction target is a sentence until the meters say where the energy goes. The dashboard had to be good enough to sell on its own, then good enough to carry the next mission.",
    metrics: [
      { value: "10 → 17", label: "paid missions, 2025 → 2026" },
      { value: "−22%", label: "energy use" },
      { value: "−45%", label: "GHG projected" },
      { value: "ISO 50001", label: "energy tracking" },
    ],
    owned: [
      "A gas and electricity dashboard in Power BI and VBA, built solo during the internship: consumption tracking and a forecast. First sold on a pharmaceutical consulting mission, then sold as a service on every ISO 50001 engagement: 10 missions in 2025, 17 so far in 2026",
      "Decarbonization roadmaps for pharmaceutical and automotive clients, with a projected 45% reduction in greenhouse-gas emissions",
      "ISO 50001 energy tracking on top of that dashboard. The anomalies it flagged led to a 22% reduction in energy consumption",
    ],
    description:
      "The first deliverable was a product, not a slide. As an intern, working alone on it, I built a dashboard that tracks and forecasts gas and electricity consumption, in Power BI and VBA. The brief was to sell it on a consulting mission for a pharmaceutical client. It sold.\n\n" +
      "After that it stopped being a one-off. Every later mission on ISO 50001 used the same dashboard: site level, then the equipment underneath (boilers, HVAC), then the drivers of the load, then a forecast against the reference. The client was buying the tool along with the mission, and it has been sold that way on every ISO 50001 mission since: 10 missions in 2025, 17 so far in 2026.\n\n" +
      "The roadmaps sat on top of that trace. For pharmaceutical and automotive sites I projected a 45% reduction in greenhouse-gas emissions. The tracking, run to ISO 50001, is what made the number operational: the anomalies it surfaced led to a 22% drop in energy consumption.",
    tags: ["Power BI", "VBA", "ISO 50001", "Forecasting", "Energy"],
    cover: "images/experience/greenflex/overview.svg",
    gallery: [],
  },
]

export function getExperienceBySlug(slug: string): ExperienceDetail | undefined {
  return experienceDetails.find((e) => e.slug === slug)
}
