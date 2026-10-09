import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

const VIRTUAL_ID = "virtual:paper-availability"
const RESOLVED = "\0" + VIRTUAL_ID

export function paperAvailabilityPlugin(): Plugin {
  return {
    name: "paper-availability",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return null
      const dir = path.resolve(process.cwd(), "public/papers")
      const names: string[] = []
      try {
        if (!fs.existsSync(dir)) {
          return `export const availablePaperFilenames = new Set([])`
        }
        for (const name of fs.readdirSync(dir)) {
          if (name === ".gitkeep" || name.startsWith(".")) continue
          const full = path.join(dir, name)
          if (fs.statSync(full).isFile()) names.push(name)
        }
      } catch {
        /* ignore */
      }
      return `export const availablePaperFilenames = new Set(${JSON.stringify(names)})`
    },
  }
}
