# Adnan Ahali — portfolio

Personal site, same layout as a GitHub Pages portfolio: React, TypeScript, and Vite. `base` is `/`, so the repository name should be `adnandbss.github.io`.

Identity, experience, and projects are empty on purpose. Fill them in `src/data/`, then add a page shell for each new slug.

```bash
npm install
npm run dev
```

## Where content goes

| What | File |
| --- | --- |
| Name, schools, about, email, LinkedIn, résumé filename | `src/data/site.ts` |
| Roles | `src/data/experience-detail.ts` and `src/data/experience-build.ts` |
| Projects | `src/data/project-detail.ts` and `src/data/project-poster-build.ts` |
| Résumé PDF | `public/` (set `site.resume` to the filename) |
| Figures | `public/images/experience/<slug>/` and `public/images/projects/<slug>/` |
| Papers and posters | `public/papers/` |

## Adding a project

1. Append an object to `projectDetails` in `src/data/project-detail.ts`.
2. Append the same slug to `PROJECT_POSTER_BUILD_SLUGS` in `src/data/project-poster-build.ts`.
3. Create `projects/<slug>/index.html`:

```html
<!doctype html>
<html lang="en" data-project-slug="SLUG">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="TITLE — Adnan Ahali." />
    <title>TITLE — Adnan Ahali</title>
    <link rel="canonical" href="https://adnandbss.github.io/projects/SLUG/" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="../../src/project-poster-entry.tsx"></script>
  </body>
</html>
```

## Adding an experience

1. Append an object to `experienceDetails` in `src/data/experience-detail.ts`.
2. Append the same slug to `EXPERIENCE_BUILD_SLUGS` in `src/data/experience-build.ts`.
3. Create `experience/<slug>/index.html` the same way, with `data-experience-slug` and `src/experience-single-entry.tsx`.
