import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { EXPERIENCE_BUILD_SLUGS } from "./src/data/experience-build"
import { PROJECT_POSTER_BUILD_SLUGS } from "./src/data/project-poster-build"
import { imageAvailabilityPlugin } from "./vite-plugin-image-availability"
import { paperAvailabilityPlugin } from "./vite-plugin-paper-availability"

function projectPosterInputs(): Record<string, string> {
  return Object.fromEntries(
    PROJECT_POSTER_BUILD_SLUGS.map((slug) => [
      `project_${slug.replace(/-/g, "_")}`,
      path.resolve(__dirname, "projects", slug, "index.html"),
    ]),
  )
}

function experienceInputs(): Record<string, string> {
  return Object.fromEntries(
    EXPERIENCE_BUILD_SLUGS.map((slug) => [
      `experience_${slug.replace(/-/g, "_")}`,
      path.resolve(__dirname, "experience", slug, "index.html"),
    ]),
  )
}

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), paperAvailabilityPlugin(), imageAvailabilityPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        ...projectPosterInputs(),
        ...experienceInputs(),
      },
    },
  },
})
