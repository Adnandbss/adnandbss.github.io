import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import ProjectPosterPage from "@/pages/project-poster"

const slug = document.documentElement.getAttribute("data-project-slug")?.trim()
if (!slug) {
  throw new Error("Missing data-project-slug on <html> for this poster page.")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProjectPosterPage slug={slug} />
  </StrictMode>,
)
