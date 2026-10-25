# Portfolio

Personal portfolio site for Jacob Roberts. Static [Astro](https://astro.build) site, deployed to Cloudflare Pages on every push to `main`. No server. Client-side JavaScript is limited to the homepage's project drawer and Mermaid, which loads only on project pages that contain a diagram.

**Roadmap:** see [`TODO.md`](TODO.md) for the card-by-card checklist.

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output in dist/
npm run verify       # check project pages, build, then check every internal and external link
```

## Editing projects

All project cards come from **`src/data/projects.json`**. To add or upgrade a project, edit that file; no HTML changes needed.

The homepage shows projects as folders in a filing drawer (`src/components/FilingDrawer.astro`), newest first by each page's `dates.start`. Drafts count for the date only: a folder shows a cover and a **Project page →** link only when its page is published. Without JavaScript the page falls back to the plain card grid (`ProjectCard.astro`).

```jsonc
{
  "title": "What 2 Watch",
  "slug": "what-2-watch",                  // unique, kebab-case; links the card to its project page
  "tagline": "Semantic movie & TV recommender",
  "role": "Contributor · team project",   // optional
  "inProgress": true,                      // optional, shows an "In progress" badge
  "hidden": true,                          // optional, validated but not shown (stage cards early)
  "summary": "2–3 sentences.",
  "tags": ["Go", "React"],
  "status": "live",                        // "live" | "video" | "source"
  "links": {
    "source": "https://github.com/...",    // required on every card
    "live": "https://...",                 // required when status is "live"
    "video": "https://...",                // required when status is "video"
    "extra": [{ "label": "Docs", "url": "https://..." }]
  }
}
```

The status label has to be backed by a link. The build fails if a card says **Live demo** without `links.live`, says **Demo video** without `links.video`, or has no `links.source`. Run `npm run verify` before pushing to catch dead links too.

## Project pages

A card gets its own page at `/projects/<slug>/` when `src/content/projects/<slug>.md` exists and isn't a draft. The card's title and a **Project page →** link then point to it. Cards without a page keep linking only to their source.

Copy `src/content/projects/healthdb.md` as a starting point. Put images in `src/assets/projects/<slug>/`, where Astro optimizes them.

```yaml
title: HealthDB
slug: healthdb                 # must match the filename and a card's "slug" in projects.json
tagline: One line
tags: [Rust, Tokio]
role: What you did             # required; on team projects say which parts were yours
team:                          # optional
  - { name: Alex, role: Firmware, url: https://github.com/alex }
dates: { start: 2025-09, end: 2026-05 }   # leave out end for "present"
status: in-progress            # in-progress | complete | archived
links: { source: https://..., live: https://..., video: https://..., extra: [{ label: Docs, url: https://... }] }
cover: { src: ../../assets/projects/healthdb/cover.png, alt: ... }   # optional
gallery:                       # optional; shown under Results
  - { src: ../../assets/projects/healthdb/shot.png, alt: ..., caption: ... }
video: { embed: https://www.youtube-nocookie.com/embed/<id>, title: ... }   # optional; an embed URL
next: [What you'd do next, ...]   # rendered as "What's next"
draft: true                    # drafts show in `npm run dev` but aren't built for production
```

The Markdown body must have exactly these `##` sections, in order: **Overview**, **Architecture**, **What I built**, **Hard problems & decisions**, **Results**. The page adds the gallery, video, What's next and Links after them. A ` ```mermaid ` code block renders as a diagram.

`npm run verify` checks pages in two places. `check:projects` checks the slug, the matching card, the image paths and that each image exists, and the section order. The build checks every frontmatter field against `src/content.config.ts`. Both checks include drafts. A page whose card is `"hidden"` has to stay a draft.

## Resume

The linked resume is `public/Jacob-Roberts-Resume.pdf`. To update it, replace that file and keep the name. The other resume versions in this folder are gitignored and never published.

## Deploy to Cloudflare Pages

One-time setup:

1. Push this folder to the `newwavejacob-web/Portfolio` repo:
   ```bash
   git add -A && git status        # confirm no private resumes are staged
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/newwavejacob-web/Portfolio.git
   git push -u origin main
   ```
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, then pick `newwavejacob-web/Portfolio`.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22`
4. **Save and Deploy.** The site goes live at `https://<project>.pages.dev`.
5. Optional custom domain: **Custom domains → Set up a domain** in the Pages project.

After that, every push to `main` deploys to production, and pushes to other branches get preview URLs.
