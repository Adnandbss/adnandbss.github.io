import { lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Nav } from "@/components/nav"
import { ExperienceImageCard } from "@/components/experience-image-card"
import { ExperienceFigures } from "@/components/experience-figures"
import { ContactLinks } from "@/components/contact-links"
import { ResumeChip } from "@/components/resume-chip"
import { experienceDetails, getExperienceBySlug } from "@/data/experience-detail"
import { resolveProjectAssetHref } from "@/data/project-detail"
import { site } from "@/data/site"
import { isGalleryImageFileAvailable } from "@/lib/gallery-image-available"

import { ErrorBoundary } from "@/components/error-boundary"

const PixelBlast = lazy(() => import("@/components/pixel-blast"))

type Props = {
  slug: string
}

export default function ExperienceSinglePage({ slug }: Props) {
  const exp = getExperienceBySlug(slug)
  const baseUrl = import.meta.env.BASE_URL
  const homeUrl = `${baseUrl}`
  const others = experienceDetails.filter((e) => e.slug !== slug)

  if (!exp) {
    return (
      <div className="relative min-h-screen px-6 py-24">
        <p className="text-sm text-muted-foreground">Experience not found.</p>
        <Button className="mt-4 rounded-none" render={<a href={homeUrl} />}>
          Back home
        </Button>
      </div>
    )
  }

  const galleryItemsOnDisk = exp.gallery.filter(
    (item) => item.imageHref && isGalleryImageFileAvailable(item.imageHref),
  )

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.40]">
        <ErrorBoundary>
          <Suspense fallback={null}>
            <PixelBlast
              variant="square"
              pixelSize={4}
              color="#B7D5FF"
              patternScale={2}
              patternDensity={1}
              pixelSizeJitter={0}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.05}
              liquid={false}
              speed={0.5}
              edgeFade={0.22}
              transparent
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[5] bg-background/25" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 pb-32">
        <header className="mb-10 border-b border-border pb-8">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/45">
            <a href={homeUrl} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              ← Home
            </a>
            {others.map((other) => (
              <span key={other.slug}>
                <span className="mx-2 text-border">/</span>
                <a
                  href={`${baseUrl}experience/${other.slug}/`}
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {other.org}
                </a>
              </span>
            ))}
          </p>
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <h1 className="whitespace-nowrap text-3xl font-bold tracking-tight text-foreground">{site.name}</h1>
            <ResumeChip className="mt-1.5" />
          </div>
        </header>

        <article>
          <header className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {exp.title}
              <span className="text-muted-foreground"> @ {exp.org}</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              <span>{exp.location}</span>
              <span className="mx-2 text-border">|</span>
              <span className="font-mono text-xs tracking-wide">{exp.duration}</span>
            </p>
          </header>

          <div className="mb-6 flex flex-wrap gap-2">
            {exp.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-none text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {exp.metrics.length > 0 ? (
          <dl
            className={`mb-8 grid gap-px border border-border bg-border ${
              exp.metrics.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
            }`}
          >
            {exp.metrics.map((m) => (
              <div key={m.label} className="bg-background/90 px-3 py-4 text-center">
                <dt className="font-mono text-lg font-bold tracking-tight text-foreground md:text-xl">{m.value}</dt>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{m.label}</dd>
              </div>
            ))}
          </dl>
          ) : null}

          <p className="mb-8 max-w-prose border-l-2 border-foreground/25 pl-4 text-sm leading-relaxed text-foreground/80">
            {exp.constraint}
          </p>

          <div className="mb-10 max-w-prose space-y-4">
            {exp.description.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mb-10">
            <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/45">
              <span className="text-foreground/25">{">"}</span> What I made
            </h3>
            <ul className="max-w-prose space-y-2">
              {exp.owned.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 bg-foreground/50" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <ExperienceFigures slug={exp.slug} />

          {galleryItemsOnDisk.length > 0 ? (
            <div>
              <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/45">
                <span className="text-foreground/25">{">"}</span> System
              </h3>
              <div className={galleryItemsOnDisk.length === 1 ? "max-w-3xl" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
                {galleryItemsOnDisk.map((item) => (
                  <ExperienceImageCard
                    key={item.id}
                    caption={item.caption}
                    src={resolveProjectAssetHref(item.imageHref!)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <Separator className="my-16" />

        <section id="contact" className="mb-16">
          <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/45">
            <span className="text-foreground/25">{">"}</span> Contact
          </h3>
          <ContactLinks />
        </section>

        <footer className="border-t border-border pt-8 text-xs text-muted-foreground">
          <p>&copy; 2026 {site.name}</p>
        </footer>
      </div>

      <Nav />
    </div>
  )
}
