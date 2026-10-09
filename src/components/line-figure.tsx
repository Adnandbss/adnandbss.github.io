import { useMemo, useRef, useState, type PointerEvent } from "react"

export type FigureSeries = {
  id: string
  label: string
  /** y values, index-aligned with `xs`. */
  values: number[]
  dashed?: boolean
  tone?: "ink" | "muted"
}

export type FigureBand = {
  label: string
  lower: number[]
  upper: number[]
}

export type FigureGap = {
  /** Index into `xs` where the bracket is drawn. */
  index: number
  label: string
}

type Props = {
  title: string
  subtitle?: string
  xs: number[]
  xTicks: number[]
  yTicks: number[]
  xUnit: string
  yUnit: string
  series: FigureSeries[]
  band?: FigureBand
  /** Vertical rule + label, in x units. */
  marker?: { x: number; label: string }
  /** Wash over x >= this value, in x units. */
  shadeFrom?: { x: number; label: string }
  gap?: FigureGap
  /** Honesty line under the figure. */
  note?: string
}

const W = 560
const H = 280
const PAD_L = 46
const PAD_R = 78
const PAD_T = 16
const PAD_B = 40
const PLOT_W = W - PAD_L - PAD_R
const PLOT_H = H - PAD_T - PAD_B

const strokeFor = (tone: FigureSeries["tone"]) =>
  tone === "muted" ? "stroke-muted-foreground" : "stroke-foreground"
const fillFor = (tone: FigureSeries["tone"]) =>
  tone === "muted" ? "fill-muted-foreground" : "fill-foreground"

function fmt(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

export function LineFigure({
  title,
  subtitle,
  xs,
  xTicks,
  yTicks,
  xUnit,
  yUnit,
  series,
  band,
  marker,
  shadeFrom,
  gap,
  note,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  const xMin = xs[0]
  const xMax = xs[xs.length - 1]
  const yMin = yTicks[0]
  const yMax = yTicks[yTicks.length - 1]

  const sx = (x: number) => PAD_L + ((x - xMin) / (xMax - xMin)) * PLOT_W
  const sy = (y: number) => PAD_T + PLOT_H - ((y - yMin) / (yMax - yMin)) * PLOT_H

  const paths = useMemo(
    () =>
      series.map((s) => ({
        id: s.id,
        d: s.values.map((y, i) => `${i === 0 ? "M" : "L"}${sx(xs[i]).toFixed(2)},${sy(y).toFixed(2)}`).join(" "),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, xs, xMin, xMax, yMin, yMax],
  )

  const bandPath = useMemo(() => {
    if (!band) return null
    const up = band.upper.map((y, i) => `${i === 0 ? "M" : "L"}${sx(xs[i]).toFixed(2)},${sy(y).toFixed(2)}`).join(" ")
    const down = [...band.lower]
      .map((y, i) => ({ y, i }))
      .reverse()
      .map(({ y, i }) => `L${sx(xs[i]).toFixed(2)},${sy(y).toFixed(2)}`)
      .join(" ")
    return `${up} ${down} Z`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [band, xs, xMin, xMax, yMin, yMax])

  function onMove(event: PointerEvent<HTMLDivElement>) {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    const svgX = ((event.clientX - rect.left) / rect.width) * W
    const frac = (svgX - PAD_L) / PLOT_W
    if (frac < -0.05 || frac > 1.05) {
      setHover(null)
      return
    }
    const target = xMin + Math.min(1, Math.max(0, frac)) * (xMax - xMin)
    let best = 0
    for (let i = 1; i < xs.length; i += 1) {
      if (Math.abs(xs[i] - target) < Math.abs(xs[best] - target)) best = i
    }
    setHover(best)
  }

  const hoverX = hover === null ? 0 : sx(xs[hover])
  const hoverPct = (hoverX / W) * 100

  return (
    <figure className="mb-10">
      <figcaption className="mb-1 text-sm font-bold text-foreground">{title}</figcaption>
      {subtitle ? <p className="mb-3 max-w-prose text-xs leading-relaxed text-muted-foreground">{subtitle}</p> : null}

      {series.length > 1 ? (
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {series.map((s) => (
            <span key={s.id} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <svg width="18" height="6" aria-hidden className="shrink-0">
                <line
                  x1="0"
                  y1="3"
                  x2="18"
                  y2="3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={s.dashed ? "5 3" : undefined}
                  className={strokeFor(s.tone)}
                />
              </svg>
              {s.label}
            </span>
          ))}
          {band ? (
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <svg width="18" height="8" aria-hidden className="shrink-0">
                <rect x="0" y="0" width="18" height="8" className="fill-foreground/15" />
              </svg>
              {band.label}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="overflow-x-auto border border-border bg-background/90">
        <div
          ref={wrapRef}
          className="relative min-w-[560px] touch-pan-y"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={title}>
            {shadeFrom ? (
              <>
                <rect
                  x={sx(shadeFrom.x)}
                  y={PAD_T}
                  width={PAD_L + PLOT_W - sx(shadeFrom.x)}
                  height={PLOT_H}
                  className="fill-foreground/[0.045]"
                />
                <text
                  x={sx(shadeFrom.x) + 8}
                  y={PAD_T + 14}
                  className="fill-muted-foreground font-mono"
                  fontSize="10"
                  letterSpacing="0.08em"
                >
                  {shadeFrom.label}
                </text>
              </>
            ) : null}

            {yTicks.map((t) => (
              <g key={`y${t}`}>
                <line x1={PAD_L} y1={sy(t)} x2={PAD_L + PLOT_W} y2={sy(t)} strokeWidth="1" className="stroke-border" />
                <text x={PAD_L - 8} y={sy(t) + 3.5} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">
                  {fmt(t)}
                </text>
              </g>
            ))}

            {xTicks.map((t) => (
              <text
                key={`x${t}`}
                x={sx(t)}
                y={PAD_T + PLOT_H + 16}
                textAnchor="middle"
                className="fill-muted-foreground font-mono"
                fontSize="10"
              >
                {fmt(t)}
              </text>
            ))}

            <text x={PAD_L} y={12} className="fill-muted-foreground font-mono" fontSize="10" letterSpacing="0.08em">
              {yUnit}
            </text>
            <text
              x={PAD_L + PLOT_W / 2}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground font-mono"
              fontSize="10"
              letterSpacing="0.08em"
            >
              {xUnit}
            </text>

            {bandPath ? <path d={bandPath} className="fill-foreground/15" /> : null}

            {marker ? (
              <>
                <line
                  x1={sx(marker.x)}
                  y1={PAD_T}
                  x2={sx(marker.x)}
                  y2={PAD_T + PLOT_H}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  className="stroke-foreground/40"
                />
                <text
                  x={sx(marker.x) - 6}
                  y={PAD_T + PLOT_H - 6}
                  textAnchor="end"
                  className="fill-muted-foreground font-mono"
                  fontSize="10"
                >
                  {marker.label}
                </text>
              </>
            ) : null}

            {paths.map((p, i) => (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={series[i].dashed ? "6 4" : undefined}
                className={strokeFor(series[i].tone)}
              />
            ))}

            {gap ? (
              (() => {
                const gx = sx(xs[gap.index])
                const y1 = sy(series[0].values[gap.index])
                const y2 = sy(series[1].values[gap.index])
                return (
                  <g>
                    <line x1={gx} y1={y1} x2={gx} y2={y2} strokeWidth="1" className="stroke-foreground/60" />
                    <line x1={gx - 4} y1={y1} x2={gx + 4} y2={y1} strokeWidth="1" className="stroke-foreground/60" />
                    <line x1={gx - 4} y1={y2} x2={gx + 4} y2={y2} strokeWidth="1" className="stroke-foreground/60" />
                    <text
                      x={gx + 8}
                      y={(y1 + y2) / 2 + 3.5}
                      className="fill-foreground font-mono"
                      fontSize="10"
                      fontWeight="700"
                    >
                      {gap.label}
                    </text>
                  </g>
                )
              })()
            ) : null}

            {series.map((s) => {
              const last = s.values.length - 1
              return (
                <g key={`end-${s.id}`}>
                  <circle cx={sx(xs[last])} cy={sy(s.values[last])} r="4" strokeWidth="2" className={`${fillFor(s.tone)} stroke-background`} />
                  <text
                    x={sx(xs[last]) + 10}
                    y={sy(s.values[last]) + 3.5}
                    className={`${s.tone === "muted" ? "fill-muted-foreground" : "fill-foreground"} font-mono`}
                    fontSize="10"
                  >
                    {fmt(s.values[last])}
                  </text>
                </g>
              )
            })}

            {hover !== null ? (
              <g>
                <line
                  x1={hoverX}
                  y1={PAD_T}
                  x2={hoverX}
                  y2={PAD_T + PLOT_H}
                  strokeWidth="1"
                  className="stroke-foreground/35"
                />
                {series.map((s) => (
                  <circle
                    key={`h-${s.id}`}
                    cx={hoverX}
                    cy={sy(s.values[hover])}
                    r="4"
                    strokeWidth="2"
                    className={`${fillFor(s.tone)} stroke-background`}
                  />
                ))}
              </g>
            ) : null}
          </svg>

          {hover !== null ? (
            <div
              className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 border border-border bg-background px-2 py-1.5 shadow-sm"
              style={{ left: `${Math.min(88, Math.max(12, hoverPct))}%` }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {fmt(xs[hover])} {xUnit}
              </p>
              {series.map((s) => (
                <p key={`t-${s.id}`} className="mt-0.5 whitespace-nowrap font-mono text-[11px] text-foreground">
                  {s.label}: <span className="font-bold">{fmt(s.values[hover])}</span>
                </p>
              ))}
              {band ? (
                <p className="mt-0.5 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                  {band.label}: {fmt(band.lower[hover])} – {fmt(band.upper[hover])}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
          Data
        </summary>
        <div className="mt-2 overflow-x-auto border border-border">
          <table className="w-full border-collapse text-left font-mono text-[11px] tabular-nums">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-2 py-1 font-bold text-foreground">{xUnit}</th>
                {series.map((s) => (
                  <th key={`th-${s.id}`} className="px-2 py-1 font-bold text-foreground">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {xs.map((x, i) => (
                <tr key={x} className="border-b border-border/60 last:border-0">
                  <td className="px-2 py-1 text-muted-foreground">{fmt(x)}</td>
                  {series.map((s) => (
                    <td key={`td-${s.id}-${x}`} className="px-2 py-1 text-foreground">
                      {fmt(s.values[i])}
                    </td>
                  ))}
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
