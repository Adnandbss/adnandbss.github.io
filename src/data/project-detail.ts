/** New poster page: add `projects/<slug>/index.html`, then append the slug to `project-poster-build.ts`. */

export type ProjectGalleryItem = {
  id: string
  caption: string
  /**
   * Image under `public/images/projects/<this-project-slug>/` (no leading slash), e.g.
   * `images/projects/<slug>/1.png`. One folder per project; use `1.png`, `2.png`, … to match figure order.
   * Omit to show the dashed placeholder until you add the file.
   */
  imageHref?: string
}

export type ProjectDetail = {
  slug: string
  title: string
  subtitle: string
  year: string
  venue: string
  /** Prize or ranking, shown as a badge on the card and the poster. Omit when there is none. */
  award?: string
  tags: string[]
  /** Site-relative path (e.g. papers/foo.pdf) or https URL — files live under `public/` when relative */
  paperHref?: string
  posterHref?: string
  repoHref?: string
  /** Optional page, shown as one text link under the poster credit. */
  dashboardHref?: string
  abstract: string
  problem: string
  approach: string
  outcome: string
  /** Image on the home card, under `public/`. Defaults to the first gallery image. */
  cover?: string
  gallery: ProjectGalleryItem[]
}

/** Resolve a `public/` asset URL (PDFs, images). Relative paths use Vite `base` (e.g. /). */
export function resolveProjectAssetHref(href: string): string {
  if (/^https?:\/\//i.test(href.trim())) return href.trim()
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/")
  const path = href.replace(/^\//, "")
  return `${base}${path}`
}

/** One object per project. Keep `project-poster-build.ts` in the same order. */
export const projectDetails: ProjectDetail[] = [
  {
    slug: "geste",
    title: "Geste",
    subtitle:
      "A craftsperson's phone video becomes a dataset a robotics lab can buy.",
    year: "2026",
    venue: "B@BHacks 2.0 · Blockchain at Berkeley, Berkeley Haas · 11 October 2026",
    award: "Winner · 1st place, Most Creative track · B@BHacks 2.0",
    tags: ["TypeScript", "React", "Gemini", "ElevenLabs", "x402", "AUSD", "Base"],
    abstract:
      "Built in about six hours at B@BHacks 2.0 by a team of four: Romain Seiller, Willem Larras, Adnan Ahali, Julius Graf. A pastry chef or a butcher films their workbench and explains out loud what they are doing. Geste turns that video into gesture clips with provenance and consent attached, prices them live per trade, and lets a lab's AI agent buy them. I worked on the pitch and the product, the video pipeline, and the live pricing, and with Romain on deployment, the frontend, the demo video, and the submission.",
    problem:
      "A robotics lab wants recordings of skilled hands at work, cut gesture by gesture and labelled. The people who have those skills have a phone, not a data pipeline. And a clip bought off the internet says nothing about who recorded it or whether they agreed to sell it.",
    approach:
      "The pipeline segments the video into timestamped gestures, aligns each one with the transcript, and cuts one clip per gesture. Every clip is hashed into a manifest that the craftsperson signs with EIP-712, so provenance and consent are verifiable. Each trade has a live price driven by supply, demand, and a web signal. The lab's AI agent pays in AUSD over HTTP 402 — gasless, x402 on Base — under a budget it cannot exceed.",
    outcome:
      "Winner, 1st place, Most Creative track at B@BHacks 2.0 (Blockchain at Berkeley, Berkeley Haas, 11 October 2026). My first hackathon. 70% of every sale goes to the craftsperson. The code and the demo stay private while we keep building.",
    gallery: [
      { id: "ge0", caption: "The live app — artisan films on a phone, the lab buys on a crypto market", imageHref: "images/projects/geste/app.png" },
      { id: "ge1", caption: "From the workbench to the lab — film, segment, align, clip, sign", imageHref: "images/projects/geste/1.svg" },
      { id: "ge2", caption: "Lab side — live price per trade, HTTP 402, AUSD over x402 on Base", imageHref: "images/projects/geste/2.svg" },
    ],
  },
  {
    slug: "heat-pump-fdd",
    title: "Heat Pump FDD",
    subtitle: "A service queue that dispatches only on faults validated on measured units",
    year: "2026",
    venue: "Personal product project",
    tags: ["FastAPI", "React", "scikit-learn", "Evaluation"],
    repoHref: "https://github.com/Adnandbss/heat-pump-fdd",
    abstract:
      "After-sales at a heat-pump manufacturer already sees connected units, and installer tools already raise fault codes. The morning decision is narrower: which units deserve a visit today, and what should the installer be told. I built the classifier, logged every result against its protocol, and put a gate in front of the queue so a diagnosis becomes a dispatch only when that fault has transferred to measured units.",
    problem:
      "The faults that quietly destroy efficiency — a slow refrigerant leak, a fouled exchanger — degrade the cycle before any controller code fires. The team then learns about them from a complaint, and the truck rolls without a parts list. A probability for each fault class does not answer which visit to send. That user problem is still a hypothesis: the service-engineer interviews have not been run.",
    approach:
      "A vapor-compression simulator (CoolProp, R410A) and a classifier on Li & Braun thermodynamic residuals, checked against 7375 NIST chamber tests. Every figure is logged with its protocol in outputs/results.csv, and the Evidence page shows the number next to that protocol. The product is the gate: dispatch only if X5/sim2real F1 is at least 0.40 and confidence is at least 0.60. An eager agent may propose a visit whenever the diagnosis is confident. The rule refuses that proposal when the class does not transfer, and the row shows both. A language model may rephrase the sentence for the installer. It cannot change the action.",
    outcome:
      "The 99.6% headline was a label leak. The honest result is 89.3%, and only on held-out simulated runs: trained on the simulator and tested on 2,846 real NIST chamber tests, the same model scores 45.4%, against 28.1% for always guessing the most common class. A score therefore does not earn a visit. On real units, refrigerant charge is the only fault reliable enough to send a technician, so the queue dispatches on charge and holds every other fault for an engineer. Predicting when a healthy pump will fail stays out of the product. No public dataset runs from healthy to a dated failure.",
    gallery: [
      {
        id: "hp0",
        caption: "89.3% on the simulator, 45.4% on real units — per fault, only refrigerant charge clears the 0.40 gate",
        imageHref: "images/projects/heat-pump-fdd/gate.svg",
      },
      {
        id: "hp1",
        caption: "The service queue — a visit goes out only for a fault that transferred on measured units",
        imageHref: "images/projects/heat-pump-fdd/dashboard.png",
      },
      {
        id: "hp2",
        caption: "Raw features — 0.95 in a random split, 0.33 when the test machine is new",
        imageHref: "images/projects/heat-pump-fdd/1.png",
      },
      {
        id: "hp3",
        caption: "On a new machine, charge faults stay visible. Condenser blockage and the liquid line do not",
        imageHref: "images/projects/heat-pump-fdd/2.png",
      },
    ],
  },
  {
    slug: "solar-gas-turbine",
    title: "Solar turbine fuel setting",
    subtitle: "A console that estimates the fuel flow, and refuses to open the valve outside the tests",
    year: "2026",
    venue: "Course project · UC Berkeley ME249",
    tags: ["Fuel control", "Turbines", "Evaluation"],
    paperHref: "papers/solar-gas-turbine.pdf",
    dashboardHref: "/solar-gas-turbine/index.html",
    abstract:
      "A control-room operator, not yet interviewed, would change the fuel flow when inlet air, solar heat, or the propane fraction moves, so the turbine inlet stays at 1473 K. I trained a small network on 60 operating tests and put a gate on the console. The screen shows the change from a reference setting. Send is active only inside the tests and away from one bad corner. Outside the tests, and at that corner, the button stays off and the log records a refusal.",
    problem:
      "More solar heat means less fuel for the same turbine temperature, and a warmer inlet changes both the compressor work and the fuel the burner still has to add. A wrong air–fuel ratio at the burner either leaves the turbine short of 1473 K or burns fuel the solar heat had already replaced. At the hot corner the model is about 15 points low, which would tell the operator to inject more fuel than the test required.",
    approach:
      "The reference setting is 303 K, propane fraction 0.25, and 1500 kW. Each move shows the new air–fuel ratio, the new efficiency, and the relative change in fuel for the same air. Send records that decision on the page. It does not move a valve in a plant. The model is the one in the course report.",
    outcome:
      "On the tests, the typical efficiency error is about 0.002. That is an order of magnitude, not a promise at every point, and several of those tests repeat training conditions with rounded numbers. At 318 K, propane 0.5, and 2500 kW, the air–fuel ratio is about 116 against a measurement of 131, so Send stays off. Propane 0.75 is outside the 60 tests, and Send stays off there too. One random start never trained, with an error near 0.16. Those weights are not on the console.",
    gallery: [
      {
        id: "st0",
        caption: "Send works only where the 60 tests reach, and stays off at the hot corner: 131.3 measured, 116.1 predicted",
        imageHref: "images/projects/solar-gas-turbine/gate.svg",
      },
      {
        id: "st1",
        caption: "At the reference setting, Send is on. Fuel for the same air matches 303 K, propane 0.25, 1500 kW",
        imageHref: "images/projects/solar-gas-turbine/1.png",
      },
      {
        id: "st2",
        caption: "At 318 K, propane 0.5 and 2500 kW, Send stays off: 116.1 against a measurement of 131.3",
        imageHref: "images/projects/solar-gas-turbine/2.png",
      },
      {
        id: "st3",
        caption: "The marked point is the one that blocks the valve. Several other rows repeat training conditions, only rounded",
        imageHref: "images/projects/solar-gas-turbine/3.png",
      },
    ],
  },
  {
    slug: "shrouded-wind-turbine",
    title: "Shrouded wind turbine",
    subtitle: "A diffuser-augmented micro rotor, printed and measured in a wind tunnel",
    year: "2024",
    venue: "Group project · LIFSE wind tunnel",
    tags: ["CATIA", "Star-CCM+", "Wind tunnel", "3D printing"],
    abstract:
      "With Mehdi Chtourou, Clara Giordano, Yannis Yessis, and Zhengxuan Zhang, I designed and tested a small shrouded wind turbine. The tunnel fixed the outer diameter, the generator, and the blade file. We chose the blade count, the pitch, the nose, and a NACA diffuser, printed the rotor, and measured it.",
    problem:
      "A bare rotor leaves kinetic energy in the wake. A diffuser can pull more flow through the disk, but only inside a diameter the wind tunnel already imposes. The brief also fixed the generator, handed us a single blade, and asked for a tip-speed ratio of 1. The machine had to be designed inside those constraints, then checked against a real flow rather than the order-of-magnitude estimate alone.",
    approach:
      "The free stream carries only about 6.6 W, so the rotor is seven blades at 13.7° of incidence, with a nose and a NACA diffuser modeled in CATIA from the supplied blade. The generator was calibrated on a bench: torque rises linearly with current, about 0.05 N·m per ampere, which is how the tunnel measurements become a torque. A Star-CCM+ run at a 10 m/s inlet shows the acceleration through the disk and the wake behind the mast. The printed prototype then went into the LIFSE tunnel with the wind held at 10 m/s while the load resistance was swept.",
    outcome:
      "At 10 m/s the power coefficient peaks near 0.55, at a tip-speed ratio of about 2, not at the value of 1 written in the brief. The shape of the curve matches the expected one: it rises, crests, and falls. Peak torque there is 0.016 N·m. At 13 m/s the coefficient does not improve, while the peak torque rises to 0.025 N·m. The shroud and the blade count were worth building; the target tip-speed ratio in the brief was not the operating point the rotor actually wants.",
    gallery: [
      {
        id: "sw0",
        caption: "Built for a tip-speed ratio of 1, it peaks near 2 — measured power coefficient at 10 and 13 m/s",
        imageHref: "images/projects/shrouded-wind-turbine/overview.svg",
      },
      {
        id: "wt1",
        caption: "Seven-blade rotor, nose, and NACA diffuser, modeled in CATIA",
        imageHref: "images/projects/shrouded-wind-turbine/1.png",
      },
      {
        id: "wt2",
        caption: "Manufacturing drawing — front, side, isometric, and a section through the hub",
        imageHref: "images/projects/shrouded-wind-turbine/2.png",
      },
      {
        id: "wt3",
        caption: "3D-printed prototype on the balance in the LIFSE wind tunnel",
        imageHref: "images/projects/shrouded-wind-turbine/3.png",
      },
      {
        id: "wt4",
        caption: "Simulated speed through the rotor for a 10 m/s inlet",
        imageHref: "images/projects/shrouded-wind-turbine/4.png",
      },
      {
        id: "wt5",
        caption: "Velocity around the shroud — the wake sits behind the mast",
        imageHref: "images/projects/shrouded-wind-turbine/5.png",
      },
      {
        id: "wt6",
        caption: "Bench calibration — torque versus current at 7.5 V",
        imageHref: "images/projects/shrouded-wind-turbine/6.png",
      },
      {
        id: "wt7",
        caption: "Measured power coefficient versus tip-speed ratio at 10 m/s",
        imageHref: "images/projects/shrouded-wind-turbine/7.png",
      },
      {
        id: "wt8",
        caption: "Measured torque versus rotation speed at 10 m/s",
        imageHref: "images/projects/shrouded-wind-turbine/8.png",
      },
    ],
  },
  {
    slug: "battery-cooling",
    title: "Battery cooling",
    subtitle: "What actually cools a liquid-cooled LiFePO4 pack: flow, gap, or the fluid",
    year: "2025",
    venue: "Group project · conjugate heat transfer",
    tags: ["STAR-CCM+", "CFD", "Batteries", "Heat transfer"],
    abstract:
      "With Sébastien Callegari, I simulated conjugate heat transfer in a liquid-cooled LiFePO4 pack. The baseline coolant is SF10. We then changed one thing at a time: the mass flow, the gap between the cells, the gap around the pack, and the fluid itself.",
    problem:
      "The cells make heat. The liquid has to take it away before the core runs hot, and a colder channel wall is not the same thing as a colder cell. The pump, the spacing, and the fluid properties all move that gap, and they do not move it in the same direction.",
    approach:
      "A Star-CCM+ model of the pack and the coolant, with temperature probes in the solid, at the interface, and in the outlet. The flow comparison is 0.8 kg/s against 1.2 kg/s. The geometry comparison opens the gap between cells from 2 mm to 4 mm, then the gap around the pack from 5 mm to 10 mm. The fluid comparison replaces SF10 with water–glycol, then with Novec 7200.",
    outcome:
      "Raising the flow from 0.8 to 1.2 kg/s drops the reported peak from 71°C to 58°C, and the residuals settle. A pump that can hold 1.2 kg/s is not the practical case: the report puts the realistic ceiling near 0.8 kg/s, where the solid probe is still climbing and the interface sits near 25°C. Opening the gap between cells from 2 mm to 4 mm gives the fluid a wider path and is the better of the two spacings we ran; a 3 mm case would still be worth checking. Opening the outer gap to 10 mm cools the pack, and the center and the edge can differ by about 8°C. The fluid decides more than the flow. Water–glycol, with a conductivity of 0.37 W/(m·K), levels the solid probe off near 42°C. Novec 7200, at 0.065 W/(m·K), is still climbing past 70°C. For an ordinary vehicle, water–glycol. Novec only if the fluid has to survive a much wider temperature range.",
    gallery: [
      {
        id: "bc0",
        caption: "One change at a time — flow, gaps, fluid. The fluid moves the cell temperature most",
        imageHref: "images/projects/battery-cooling/overview.svg",
      },
      {
        id: "bc1",
        caption: "The pack — heat sits in the cell core, and the channels stay near the inlet temperature",
        imageHref: "images/projects/battery-cooling/1.jpg",
      },
      {
        id: "bc2",
        caption: "0.8 kg/s — the solid probe keeps climbing while the interface stays near 25°C",
        imageHref: "images/projects/battery-cooling/2.jpg",
      },
      {
        id: "bc3",
        caption: "Coolant path through the pack — the channels carry the flow, the cells do not",
        imageHref: "images/projects/battery-cooling/3.png",
      },
      {
        id: "bc4",
        caption: "Section through the cells. The cores run hot; the channels between them stay cold",
        imageHref: "images/projects/battery-cooling/4.png",
      },
      {
        id: "bc5",
        caption: "Internal gap opened from 2 mm to 4 mm. The fluid has a wider path between the cells",
        imageHref: "images/projects/battery-cooling/5.jpg",
      },
      {
        id: "bc6",
        caption: "Outer gap opened to 10 mm. The solid and the interface both rise, and they separate",
        imageHref: "images/projects/battery-cooling/6.jpg",
      },
      {
        id: "bc7",
        caption: "Water–glycol. The solid probe levels off near 42°C",
        imageHref: "images/projects/battery-cooling/7.jpg",
      },
      {
        id: "bc8",
        caption: "Novec 7200. The solid is still climbing past 70°C, and the interface rises with it",
        imageHref: "images/projects/battery-cooling/8.jpg",
      },
    ],
  },
  {
    slug: "light-aircraft-brake",
    title: "Light-aircraft brake",
    subtitle: "A floating caliper sized to stop 685 kg from 53 m/s",
    year: "2023",
    venue: "Design dossier",
    tags: ["CATIA", "Brakes", "Dimensioning", "Aircraft"],
    abstract:
      "I sized a floating-caliper brake for a light aircraft. The tire and the rim were imposed, and the disc could not exceed 125 mm. The brake had to stop 685 kg from 53 m/s at 4 m/s² while both engines were still pushing.",
    problem:
      "A fixed caliper puts a piston on each face of the disc. That is more mass, and a pad change means pulling the caliper off. A light aircraft wants the opposite: one piston, a body that slides, and pads that come off without grounding the airplane. The disc also has to absorb the heat of the stop without passing 450°C, inside a diameter the rim already limits.",
    approach:
      "The stop lasts 13.25 s and covers 351 m. Kinetic energy is 962 kJ. The two engines, still pushing at 200 N each, add about 140 kJ, so the brakes absorb about 1.10 MJ. Two stainless discs, 125 mm outside and 64 mm inside, come out near 40 mm thick so that heat stays under 450°C. The force at the tires is 3140 N, which is 204 N·m per wheel. At 2.5 MPa and a friction of 0.3 the pads need about 110° of the disc, and the piston is 56 mm. Six M5 bolts hold the wheel; the separation check only required four. The inboard bearings are H7/g6, so they can still slide. The outboard bearings are H7/p6, so they do not.",
    outcome:
      "A floating caliper is the brake this aircraft can carry. One piston loads one pad, and the slide puts the same force on the other face, so the disc is not bent by a one-sided clamp. The thickness of the disc is set by the heat of a single stop, not by stiffness. The bolt count clears the separation load with margin, and the two bearing fits separate the joint that must move from the joint that must not.",
    gallery: [
      {
        id: "lb0",
        caption: "The heat of one stop sets the disc — 1.10 MJ, 5.74 kg of steel, 40 mm per disc",
        imageHref: "images/projects/light-aircraft-brake/overview.svg",
      },
      {
        id: "bk1",
        caption: "CAD of the wheel, hub, disc, and floating caliper",
        imageHref: "images/projects/light-aircraft-brake/1.png",
      },
      {
        id: "bk2",
        caption: "Section through the axle — piston, pads, and disc on one side of the wheel",
        imageHref: "images/projects/light-aircraft-brake/2.png",
      },
      {
        id: "bk3",
        caption: "Front view. Six bolts on the disc, inside the imposed rim",
        imageHref: "images/projects/light-aircraft-brake/3.png",
      },
      {
        id: "bk4",
        caption: "Side view. The caliper sits beside the wheel and slides along the axle",
        imageHref: "images/projects/light-aircraft-brake/4.png",
      },
      {
        id: "bk5",
        caption: "Section through the piston and the pad",
        imageHref: "images/projects/light-aircraft-brake/5.png",
      },
      {
        id: "bk6",
        caption: "Bearing fits — H7/g6 where the shaft must slide, H7/p6 where it must not",
        imageHref: "images/projects/light-aircraft-brake/6.png",
      },
    ],
  },
]

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projectDetails.find((p) => p.slug === slug)
}
