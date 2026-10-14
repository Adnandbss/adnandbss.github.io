import { Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** Prize or ranking of a project — wraps on narrow screens instead of overflowing. */
export function AwardBadge({ award, className }: { award: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto gap-1.5 whitespace-normal rounded-none border-[#C9A227]/60 bg-[#FBF3D9] px-2 py-1 text-left text-xs font-semibold text-[#5C4A0E]",
        className,
      )}
    >
      <Trophy aria-hidden />
      {award}
    </Badge>
  )
}
