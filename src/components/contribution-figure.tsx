import { useState } from "react"

export type Contribution = {
  /** Short label shown on the axis. Keep under ~30 characters. */
  feature: string
  /** Signed contribution in score points. Positive raises risk. */
  value: number
  /** The trace itself — the fact a compliance officer reads. */
  evidence: string
}

type Props = {
  title: string
  subtitle?: string
  contributions: Contribution[]
  baseScore: number
  /** Threshold above which the score changes the outcome. */
  threshold: { value: number; label: string }
  note?: string
}

const W = 560
const ROW_H = 26
const PAD_T = 34
const PAD_B = 16
const LABEL_RIGHT = 190
const AXIS_X = 312
const HALF_W = 108
const VALUE_RIGHT = 545
const BAR_H = 12

/** Bar with a 4px rounded data-end and a square end at the zero axis. */
function barPath(value: number, y: number, scale: number): string {
  const len = Math.abs(value) * scale
  const r = Math.min(4, len)
  const top = y - BAR_H / 2
  const bot = y + BAR_H / 2
  if (value >= 0) {
    const x1 = AXIS_X + len
    return `M${AXIS_X},${top} H${x1 - r} Q${x1},${top} ${x1},${top + r} V${bot - r} Q${x1},${bot} ${x1 - r},${bot} H${AXIS_X} Z`
  }
  const x1 = AXIS_X - len
  return `M${AXIS_X},${top} H${x1 + r} Q${x1},${top} ${x1},${top + r} V${bot - r} Q${x1},${bot} ${x1 + r},${bot} H${AXIS_X} Z`
}

export function ContributionFigure({ title, subtitle, contributions, baseScore, threshold, note }: Props) {
  const [hover, setHover] = useState<number | null>(null)

  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.value)))
  const scale = HALF_W / maxAbs
  const total = contributions.reduce((sum, c) => sum + c.value, baseScore)
  const H = PAD_T + contributions.length * ROW_H + PAD_B

  return (
    <figure className="mb-10">
      <figcaption className="mb-1 text-sm font-bold text-foreground">{title}</figcaption>
      {subtitle ? <p className="mb-3 max-w-prose text-xs leading-relaxed text-muted-foreground">{subtitle}</p> : null}

      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <svg width="14" height="10" aria-hidden className="shrink-0">
            <rect x="0" y="1" width="14" height="8" className="fill-foreground" />
          </svg>
          Raises risk
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <svg width="14" height="10" aria-hidden className="shrink-0">
            <rect x="0" y="1" width="14" height="8" className="fill-foreground/40" />
          </svg>
          Lowers risk
        </span>
      </div>

      <div className="overflow-x-auto border border-border bg-background/90">
        <div className="relative min-w-[560px]" onPointerLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={title}>
            <text x={AXIS_X} y={14} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="10" letterSpacing="0.08em">
              contribution to score (points)
            </text>

            <line x1={AXIS_X} y1={PAD_T - 12} x2={AXIS_X} y2={H - PAD_B + 2} strokeWidth="1" className="stroke-border" />

            {contributions.map((c, i) => {
              const y = PAD_T + i * ROW_H + ROW_H / 2
              const positive = c.value >= 0
              return (
                <g key={c.feature} onPointerEnter={() => setHover(i)} className="cursor-default">
                  <rect x="0" y={y - ROW_H / 2} width={W} height={ROW_H} fill="transparent" />
                  {hover === i ? (
                    <rect x="0" y={y - ROW_H / 2} width={W} height={ROW_H} className="fill-foreground/[0.04]" />
                  ) : null}
                  <text x={LABEL_RIGHT} y={y + 3.5} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">
                    {c.feature}
                  </text>
                  <path d={barPath(c.value, y, scale)} className={positive ? "fill-foreground" : "fill-foreground/40"} />
                  <text
                    x={VALUE_RIGHT}
                    y={y + 3.5}
                    textAnchor="end"
                    className="fill-foreground font-mono"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {positive ? `+${c.value}` : c.value}
                  </text>
                </g>
              )
            })}
          </svg>

        </div>
      </div>

      <div className="mt-px min-h-[2.5rem] border border-t-0 border-border bg-background/90 px-3 py-2">
        <p className="font-mono text-[11px] leading-relaxed">
          <span className="text-muted-foreground">trace &rsaquo;</span>{" "}
          {hover === null ? (
            <span className="text-muted-foreground/70">hover a row to read the evidence behind its contribution</span>
          ) : (
            <span className="text-foreground">{contributions[hover].evidence}</span>
          )}
        </p>
      </div>

      <div className="mt-px flex flex-wrap items-center gap-x-6 gap-y-1 border border-t-0 border-border bg-background/90 px-3 py-2 font-mono text-[11px]">
        <span className="text-muted-foreground">
          base {baseScore} <span className="text-border">+</span> contributions{" "}
          {total - baseScore >= 0 ? `+${total - baseScore}` : total - baseScore}
        </span>
        <span className="font-bold text-foreground">= {total} / 100</span>
        <span className="text-muted-foreground">
          {total >= threshold.value ? "→" : "→ below"} {threshold.label} (at {threshold.value})
        </span>
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
          Data
        </summary>
        <div className="mt-2 overflow-x-auto border border-border">
          <table className="w-full border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-2 py-1 font-bold text-foreground">Feature</th>
                <th className="px-2 py-1 font-bold tabular-nums text-foreground">Points</th>
                <th className="px-2 py-1 font-bold text-foreground">Trace</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={`row-${c.feature}`} className="border-b border-border/60 last:border-0">
                  <td className="px-2 py-1 text-muted-foreground">{c.feature}</td>
                  <td className="px-2 py-1 tabular-nums text-foreground">{c.value >= 0 ? `+${c.value}` : c.value}</td>
                  <td className="px-2 py-1 text-muted-foreground">{c.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {note ? <p className="mt-2 max-w-prose text-[11px] leading-relaxed text-muted-foreground">{note}</p> : null}
    </figure>
  )
}
