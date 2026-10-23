// Loads src/data/projects.json and validates it at build time, so a card
// can never claim a status it can't back up with a link.
import raw from "../data/projects.json";

export type Status = "live" | "video" | "source";

export interface Project {
  title: string;
  // Matches src/content/projects/<slug>.md when the project has its own page.
  slug: string;
  tagline: string;
  summary: string;
  tags: string[];
  status: Status;
  role?: string;
  inProgress?: boolean;
  hidden?: boolean;
  links: {
    source: string;
    live?: string;
    video?: string;
    extra?: { label: string; url: string }[];
  };
}

export const STATUS_LABEL: Record<Status, string> = {
  live: "Live demo",
  video: "Demo video",
  source: "Source code",
};

// The link a status label promises.
const REQUIRED_LINK: Record<Status, keyof Project["links"]> = {
  live: "live",
  video: "video",
  source: "source",
};

function validate(p: Project, i: number): Project {
  const where = `projects.json[${i}] (${p.title ?? "untitled"})`;
  const fail = (msg: string) => {
    throw new Error(`${where}: ${msg}`);
  };
  for (const key of ["title", "tagline", "summary"] as const) {
    if (!p[key]?.trim()) fail(`missing "${key}"`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug ?? "")) fail(`"slug" must be kebab-case`);
  if (!Array.isArray(p.tags) || p.tags.length === 0) fail(`needs at least one tag`);
  if (!(p.status in STATUS_LABEL)) fail(`status must be one of ${Object.keys(STATUS_LABEL).join(", ")}`);
  if (!p.links?.source) fail(`every card needs links.source`);
  const needed = REQUIRED_LINK[p.status];
  if (!p.links[needed]) fail(`status "${p.status}" requires links.${needed}`);
  const urls = [p.links.source, p.links.live, p.links.video, ...(p.links.extra ?? []).map((e) => e.url)];
  for (const u of urls) if (u && !/^https:\/\//.test(u)) fail(`link must be https: ${u}`);
  return p;
}

const all = (raw as Project[]).map(validate);
const dupe = all.find((p, i) => all.findIndex((q) => q.slug === p.slug) !== i);
if (dupe) throw new Error(`projects.json: duplicate slug "${dupe.slug}"`);

// Hidden cards are still validated, so they're ready the moment you flip them on.
export const projects: Project[] = all.filter((p) => !p.hidden);
