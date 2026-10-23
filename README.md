# Portfolio

Personal portfolio site for Jacob Roberts. Static [Astro](https://astro.build) site, deployed to Cloudflare Pages on every push to `main`. No server and no client-side JavaScript.

**Roadmap:** see [`TODO.md`](TODO.md) for the card-by-card checklist.

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output in dist/
npm run verify       # build + check every internal and external link
```

## Editing projects

All project cards come from **`src/data/projects.json`**. To add or upgrade a project, edit that file; no HTML changes needed.

```jsonc
{
  "title": "What 2 Watch",
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
