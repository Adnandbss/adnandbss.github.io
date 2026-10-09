import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

type AnimateOn = "hover" | "view" | "click"

type Props = {
  text: string
  speed?: number
  maxIterations?: number
  characters?: string
  className?: string
  parentClassName?: string
  encryptedClassName?: string
  animateOn?: AnimateOn
  clickMode?: "once" | "toggle"
  revealDirection?: "start" | "end"
  sequential?: boolean
  useOriginalCharsOnly?: boolean
}

function pickRandom(pool: string): string {
  return pool[Math.floor(Math.random() * pool.length)] ?? "?"
}

function countNonSpace(s: string): number {
  return [...s].filter((c) => c !== " ").length
}

function lockedIndices(
  src: string[],
  revealedNonSpace: number,
  fromStart: boolean,
): Set<number> {
  const set = new Set<number>()
  for (let i = 0; i < src.length; i++) {
    if (src[i] === " ") set.add(i)
  }
  let n = 0
  if (fromStart) {
    for (let i = 0; i < src.length && n < revealedNonSpace; i++) {
      if (src[i] === " ") continue
      set.add(i)
      n++
    }
  } else {
    for (let i = src.length - 1; i >= 0 && n < revealedNonSpace; i--) {
      if (src[i] === " ") continue
      set.add(i)
      n++
    }
  }
  return set
}

function buildDisplay(src: string[], pool: string, locked: Set<number>): string[] {
  return src.map((c, i) => {
    if (c === " ") return " "
    if (locked.has(i)) return c
    return pickRandom(pool)
  })
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 15,
  characters = DEFAULT_CHARS,
  className,
  parentClassName,
  encryptedClassName,
  animateOn = "hover",
  clickMode = "toggle",
  revealDirection = "start",
  sequential = false,
  useOriginalCharsOnly = false,
}: Props) {
  const src = useMemo(() => [...text], [text])
  const pool = useOriginalCharsOnly
    ? Array.from(new Set(src.filter((c) => c !== " "))).join("") || characters
    : characters
  const nonSpaceTotal = countNonSpace(text)

  const [display, setDisplay] = useState<string[]>(() => buildDisplay([...text], pool, new Set()))
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const tickRef = useRef(0)
  const revealedRef = useRef(0)
  const viewStarted = useRef(false)
  const clickOnceUsed = useRef(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  const fromStart = revealDirection === "start"

  const reset = useCallback(() => {
    revealedRef.current = 0
    setDone(false)
    tickRef.current = 0
    setDisplay(buildDisplay(src, pool, lockedIndices(src, 0, fromStart)))
  }, [src, pool, fromStart])

  const complete = useCallback(() => {
    setDisplay([...src])
    setDone(true)
    setRunning(false)
    revealedRef.current = nonSpaceTotal
  }, [src, nonSpaceTotal])

  useEffect(() => {
    if (animateOn !== "view") return
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !viewStarted.current) {
          viewStarted.current = true
          reset()
          setRunning(true)
        }
      },
      { threshold: 0.12, rootMargin: "48px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [animateOn, reset])

  useEffect(() => {
    if (!running || done) return

    const id = window.setInterval(() => {
      tickRef.current += 1

      if (sequential) {
        if (tickRef.current % 2 === 0) {
          revealedRef.current = Math.min(revealedRef.current + 1, nonSpaceTotal)
        }
        const lock = lockedIndices(src, revealedRef.current, fromStart)
        setDisplay(buildDisplay(src, pool, lock))
        if (revealedRef.current >= nonSpaceTotal) complete()
        return
      }

      if (tickRef.current >= maxIterations) {
        complete()
        return
      }

      setDisplay(src.map((c) => (c === " " ? " " : pickRandom(pool))))
    }, speed)

    return () => window.clearInterval(id)
  }, [running, done, sequential, src, pool, maxIterations, speed, nonSpaceTotal, fromStart, complete])

  const run = useCallback(() => {
    if (animateOn === "click" && clickMode === "once" && clickOnceUsed.current) return
    if (animateOn === "click" && clickMode === "once") clickOnceUsed.current = true
    reset()
    setRunning(true)
  }, [animateOn, clickMode, reset])

  const handleMouseEnter = () => {
    if (animateOn !== "hover") return
    reset()
    setRunning(true)
  }

  const handleClick = () => {
    if (animateOn !== "click") return
    if (clickMode === "once" && done) return
    run()
  }

  return (
    <span
      ref={containerRef}
      className={parentClassName}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (animateOn === "click" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          handleClick()
        }
      }}
      role={animateOn === "click" ? "button" : undefined}
      tabIndex={animateOn === "click" ? 0 : undefined}
    >
      {display.map((ch, i) => {
        const orig = src[i]
        const isSpace = orig === " "
        const isLocked = isSpace || ch === orig
        const encrypted = !done && !isLocked
        return (
          <span key={i} className={encrypted ? encryptedClassName : className}>
            {ch}
          </span>
        )
      })}
    </span>
  )
}
