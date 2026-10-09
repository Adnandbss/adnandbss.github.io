import { availableImageHrefs } from "virtual:image-availability"

/** True if `imageHref` matches a file that existed under `public/images/` when Vite last loaded this module. */
export function isGalleryImageFileAvailable(imageHref: string | undefined): boolean {
  return Boolean(imageHref && availableImageHrefs.has(imageHref))
}
