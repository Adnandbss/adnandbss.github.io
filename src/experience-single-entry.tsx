import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import ExperienceSinglePage from "@/pages/experience-single"

const slug = document.documentElement.getAttribute("data-experience-slug")?.trim()
if (!slug) {
  throw new Error("Missing data-experience-slug on <html> for this experience page.")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExperienceSinglePage slug={slug} />
  </StrictMode>,
)
