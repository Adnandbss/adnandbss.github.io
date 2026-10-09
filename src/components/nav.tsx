import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const links = [
  { id: "about", label: "Abt", full: "About" },
  { id: "experience", label: "Exp", full: "Experience" },
  { id: "projects", label: "Proj", full: "Projects" },
  { id: "contact", label: "Say hi", full: "Contact" },
]

function go(href: string) {
  window.location.href = href
}

export function Nav() {
  const baseUrl = import.meta.env.BASE_URL
  const hrefFor = (id: string) => {
    if (id === "about") return `${baseUrl}#about`
    if (id === "experience") return `${baseUrl}#experience`
    if (id === "projects") return `${baseUrl}#projects`
    if (id === "contact") return `${baseUrl}#contact`
    return baseUrl
  }

  return (
    <TooltipProvider delay={200}>
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-1.5 shadow-sm backdrop-blur-md">
          {links.map((link) => (
            <Tooltip key={link.id}>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-3 text-xs"
                  onClick={() => go(hrefFor(link.id))}
                >
                  {link.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-none text-xs">
                {link.full}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </nav>
    </TooltipProvider>
  )
}
