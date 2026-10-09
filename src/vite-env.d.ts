/// <reference types="vite/client" />

declare module "virtual:paper-availability" {
  /** Basenames of real files found in `public/papers/` (excludes `.gitkeep`). */
  export const availablePaperFilenames: ReadonlySet<string>
}

declare module "virtual:image-availability" {
  /** Paths like `images/projects/<slug>/1.png` for real files under `public/images/`. */
  export const availableImageHrefs: ReadonlySet<string>
}
