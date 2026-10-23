// Project pages: one Markdown file per project at src/content/projects/<slug>.md.
// The schema runs on every build (drafts included), so bad frontmatter or a
// missing image fails `npm run build`. Cross-file rules (filename = slug,
// image folders, section order, matching card) live in scripts/check-projects.mjs.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const https = z.url({ protocol: /^https$/, error: "must be an https:// URL" });

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.strictObject({
      title: z.string().trim().min(1),
      slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
      tagline: z.string().trim().min(1),
      tags: z.array(z.string().trim().min(1)).min(1),
      role: z.string().trim().min(1),
      team: z
        .array(z.strictObject({ name: z.string().trim().min(1), role: z.string().optional(), url: https.optional() }))
        .optional(),
      dates: z
        .strictObject({ start: z.coerce.date(), end: z.coerce.date().optional() })
        .refine((d) => !d.end || d.end >= d.start, "dates.end is before dates.start"),
      status: z.enum(["in-progress", "complete", "archived"]),
      links: z.strictObject({
        source: https.optional(),
        live: https.optional(),
        video: https.optional(),
        extra: z.array(z.strictObject({ label: z.string().trim().min(1), url: https })).optional(),
      }),
      // Optional, so a page can go live before it has a real image.
      cover: z.strictObject({ src: image(), alt: z.string().trim().min(1) }).optional(),
      gallery: z
        .array(z.strictObject({ src: image(), alt: z.string().trim().min(1), caption: z.string().optional() }))
        .default([]),
      // An embeddable player URL (e.g. https://www.youtube-nocookie.com/embed/<id>), not a watch page.
      video: z.strictObject({ embed: https, title: z.string().trim().min(1) }).optional(),
      next: z.array(z.string().trim().min(1)).min(1),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
