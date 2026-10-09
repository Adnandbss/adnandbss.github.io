import { lazy, Suspense, type ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Nav } from "@/components/nav"
import { experienceDetails } from "@/data/experience-detail"
import { projectDetails } from "@/data/project-detail"
import { site } from "@/data/site"
import { ContactLinks } from "@/components/contact-links"
import { ProjectDownloadLinks } from "@/components/project-download-links"
import DecryptedText from "@/components/decrypted-text"
import { ResumeChip } from "@/components/resume-chip"

import { ErrorBoundary } from "@/components/error-boundary"

const PixelBlast = lazy(() => import("@/components/pixel-blast"))

function App() {

  return (
    <div className="relative min-h-screen">
      {/* PixelBlast background */}
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

      {/* Dimming overlay to keep foreground text readable */} 
      <div className="pointer-events-none fixed inset-0 z-[5] bg-background/25" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 pb-32">

        {/* Header */}
        <header className="mb-20">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <div>
              <h1 className="whitespace-nowrap text-3xl font-bold tracking-tight text-foreground">
                <DecryptedText
                  text={site.name}
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={42}
                  maxIterations={14}
                  parentClassName="inline"
                  className="text-foreground"
                  encryptedClassName="text-foreground/40"
                />
              </h1>
              {site.tagline ? (
                <p className="mt-2 text-sm text-muted-foreground">{site.tagline}</p>
              ) : null}
            </div>
            <ResumeChip className="mt-1.5" />
          </div>
          {site.schools || site.specializations ? (
            <dl className="mt-4 grid grid-cols-[5.5rem_1fr] items-baseline gap-x-3 gap-y-1.5 text-sm">
              {site.schools ? (
                <>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/40">
                    Schools
                  </dt>
                  <dd className="text-pretty text-muted-foreground">{site.schools}</dd>
                </>
              ) : null}
              {site.specializations ? (
                <>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/40">
                    Focus
                  </dt>
                  <dd className="text-pretty text-muted-foreground">{site.specializations}</dd>
                </>
              ) : null}
            </dl>
          ) : null}
        </header>

        {/* About */}
        <section id="about" className="mb-16">
          <SectionTitle>About</SectionTitle>
          {site.about ? (
            <div className="max-w-prose space-y-4">
              {site.about.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
          {site.quote.text ? (
            <figure className="mt-6 max-w-prose border-l-2 border-foreground/25 pl-4">
              <blockquote className="text-sm italic leading-relaxed text-foreground/80">
                &ldquo;{site.quote.text}&rdquo;
              </blockquote>
              {site.quote.source ? (
                <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {site.quote.source}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </section>

        <Separator className="mb-16" />

        {/* Experience */}
        <section id="experience" className="mb-16">
          <SectionTitle>Experience</SectionTitle>
          <div className="grid gap-4">
            {experienceDetails.map((exp) => (
              <a
                key={exp.slug}
                href={`${import.meta.env.BASE_URL}experience/${exp.slug}/`}
                className="block min-w-0 no-underline text-inherit"
              >
                <Card className="cursor-pointer">
                  <CardHeader>
                    <CardTitle>{exp.title}</CardTitle>
                    <CardDescription>
                      @ {exp.org}
                      <span className="mx-1.5 text-border">·</span>
                      <span className="font-mono text-[11px]">{exp.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0 space-y-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">{exp.blurb}</p>
                    {exp.metrics.length > 0 ? (
                    <p className="font-mono text-[11px] text-foreground/70">
                      {exp.metrics.map((m) => `${m.value} ${m.label}`).join("  ·  ")}
                    </p>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-none text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Projects */}
        <section id="projects" className="mb-16">
          <SectionTitle>Projects</SectionTitle>
          <div className="grid gap-4">
            {projectDetails.map((project) => {
              const posterPageHref = `${import.meta.env.BASE_URL}projects/${project.slug}/`
              return (
                <Card key={project.slug}>
                  <CardHeader>
                    <CardTitle>
                      <a href={posterPageHref} className="text-inherit no-underline hover:underline">
                        {project.title}
                      </a>
                    </CardTitle>
                    <CardDescription>{project.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
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
                    />
                    <p>
                      <a
                        href={posterPageHref}
                        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        View poster page →
                      </a>
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <Separator className="mb-16" />

        {/* Contact */}
        <section id="contact" className="mb-16">
          <SectionTitle>Contact</SectionTitle>
          <ContactLinks />
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-xs text-muted-foreground">
          <p>&copy; 2026 {site.name}</p>
        </footer>

      </div>

      <Nav />
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
      <span className="text-foreground/25">{">"}</span> {children}
    </h2>
  )
}

export default App
