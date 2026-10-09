import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  caption: string
  /** Resolved URL — if missing, the card is not rendered. */
  src: string
  className?: string
}

export function ExperienceImageCard({ caption, src, className }: Props) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-border/80 bg-card/90 backdrop-blur-[2px] transition-all duration-200",
        "hover:border-foreground/25 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex min-h-[11rem] items-center justify-center border-b border-border bg-[#F4F1EA] p-2 sm:min-h-[13rem]">
          <img
            src={src}
            alt={caption}
            className="max-h-[16rem] w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/60 bg-muted/20 px-3 py-2">
        <p className="w-full text-center font-mono text-[11px] leading-snug text-muted-foreground">{caption}</p>
      </CardFooter>
    </Card>
  )
}
