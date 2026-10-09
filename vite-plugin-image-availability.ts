import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

const VIRTUAL_ID = "virtual:image-availability"

const RESOLVED = "\0" + VIRTUAL_ID

function collectNestedFiles(root: string, urlPrefix: string): string[] {
  const out: string[] = []
  try {
    if (!fs.existsSync(root)) return out
    for (const slug of fs.readdirSync(root)) {
      const slugDir = path.join(root, slug)
      if (!fs.statSync(slugDir).isDirectory()) continue
      for (const file of fs.readdirSync(slugDir)) {
        if (file.startsWith(".") || file === ".gitkeep") continue
        const fp = path.join(slugDir, file)
        if (!fs.statSync(fp).isFile()) continue
        out.push(`${urlPrefix}/${slug}/${file}`.replace(/\\/g, "/"))
      }
    }
  } catch {
    /* ignore */
  }
  return out
}

export function imageAvailabilityPlugin(): Plugin {
  return {
    name: "image-availability",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return null
      const cwd = process.cwd()
      const projects = collectNestedFiles(path.join(cwd, "public/images/projects"), "images/projects")
      const experience = collectNestedFiles(path.join(cwd, "public/images/experience"), "images/experience")
      const all = [...projects, ...experience]
      return `export const availableImageHrefs = new Set(${JSON.stringify(all)})`
    },
  }
}
