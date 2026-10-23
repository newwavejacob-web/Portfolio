// Project pages from the `projects` content collection. Drafts render in
// `npm run dev` but are left out of production builds.
import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectPage = CollectionEntry<"projects">;

export const PAGE_STATUS_LABEL: Record<ProjectPage["data"]["status"], string> = {
  "in-progress": "In progress",
  complete: "Complete",
  archived: "Archived",
};

export async function publishedPages(): Promise<ProjectPage[]> {
  return getCollection("projects", ({ data }) => !(import.meta.env.PROD && data.draft));
}

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export function formatDates({ start, end }: ProjectPage["data"]["dates"]): string {
  return `${monthYear.format(start)} – ${end ? monthYear.format(end) : "present"}`;
}
