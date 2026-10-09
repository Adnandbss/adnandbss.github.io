import { lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Nav } from "@/components/nav"
import { ExperienceImageCard } from "@/components/experience-image-card"
import { ProjectDownloadLinks } from "@/components/project-download-links"
import { getProjectBySlug, projectDetails, resolveProjectAssetHref } from "@/data/project-detail"
import { site } from "@/data/site"
import { isGalleryImageFileAvailable } from "@/lib/gallery-image-available"

import { ErrorBoundary } from "@/components/error-boundary"

const PixelBlast = lazy(() => import("@/components/pixel-blast"))

type Props = {
  slug: string
}

export default function ProjectPosterPage({ slug }: Props) {
  const project = getProjectBySlug(slug)
  const baseUrl = import.meta.env.BASE_URL
  const homeUrl = `${baseUrl}`
  const others = projectDetails.filter((p) => p.slug !== slug)

  const galleryItemsOnDisk = project
    ? project.gallery.filter(
        (item) => item.imageHref && isGalleryImageFileAvailable(item.imageHref),
      )
    : []

  if (!project) {
    return (
      <div className="relative min-h-screen px-6 py-24">
        <p className="text-sm text-muted-foreground">Project not found.</p>
        <Button className="mt-4 rounded-none" render={<a href={homeUrl} />}>
          Back home
        </Button>
      </div>
    )
  }

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

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 pb-36 md:px-6 md:py-20">
        {/* Nav links above poster */}
        <p className="mb-8 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/45">
          <a href={homeUrl} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            ← Home
          </a>
          {others.map((other) => (
            <span key={other.slug}>
              <span className="mx-2 text-border">/</span>
              <a
                href={`${baseUrl}projects/${other.slug}/`}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {other.title}
              </a>
            </span>
          ))}
        </p>

        {/* Poster frame */}
        <div className="border-4 border-foreground/15 bg-gradient-to-b from-card/90 to-background/95 p-1 shadow-[8px_8px_0_0_rgba(0,0,0,0.06)] md:p-2">
          <div className="border border-border bg-background/90 p-6 md:p-10 lg:p-12">
            {/* Top banner */}
            <div className="mb-8 flex flex-col gap-2 border-b-2 border-border pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
                  Poster session
                </p>
                <p className="mt-1 font-mono text-xs text-foreground/60">{project.venue}</p>
              </div>
              <div className="text-left font-mono text-sm text-muted-foreground md:text-right">
                <span className="text-foreground">{project.year}</span>
              </div>
            </div>

            {/* Title block */}
            <header className="mb-10 text-center">
              <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-pretty text-sm text-muted-foreground md:text-base">
                {project.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-none text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <ProjectDownloadLinks
                paperHref={project.paperHref}
                posterHref={project.posterHref}
                repoHref={project.repoHref}
                className="mt-8 justify-center"
                buttonSize="default"
              />
            </header>

            {/* Abstract — full width band */}
            <section className="mb-8 border border-border bg-secondary/30 p-5 md:p-6">
              <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/50">
                Abstract
              </h2>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">{project.abstract}</p>
            </section>

            {/* Two-column panels */}
            <div className="mb-8 grid gap-4 md:grid-cols-2 md:gap-6">
              <Card className="border-border bg-card/80">
                <CardHeader className="border-b border-border pb-3">
                  <CardTitle className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">
                    Problem
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{project.problem}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/80">
                <CardHeader className="border-b border-border pb-3">
                  <CardTitle className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">
                    Approach
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{project.approach}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-10 border-border bg-muted/20">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70">
                  Results & outlook
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{project.outcome}</p>
              </CardContent>
            </Card>

            {/* Figures — only slots with a real file under public/images/ at build time */}
            {galleryItemsOnDisk.length > 0 ? (
              <section>
                <h2 className="mb-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/45">
                  Figures
                </h2>
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                  {galleryItemsOnDisk.map((item) => (
                    <ExperienceImageCard
                      key={item.id}
                      caption={item.caption}
                      src={resolveProjectAssetHref(item.imageHref!)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {/* Footer strip on poster */}
            <div className="mt-12 border-t-2 border-border pt-6 text-center">
              <p className="font-mono text-xs text-muted-foreground">
                {site.posterCredit}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="rounded-none" render={<a href={homeUrl} />}>
            Back to portfolio
          </Button>
        </div>
      </div>

      <Nav />
    </div>
  )
}
