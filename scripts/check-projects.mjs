// Checks project pages (src/content/projects/*.md) before the build:
//   - the filename matches the `slug` and a card in src/data/projects.json
//   - a published page's card isn't hidden (it would be reachable but unlinked)
//   - every image (frontmatter cover/gallery and Markdown body) exists and lives
//     in src/assets/projects/<slug>/
//   - the body has the template's sections, in order, with Results last
// Field types and required frontmatter are validated by the schema in
// src/content.config.ts during `npm run build`. Drafts are checked too.
import { readFile, readdir, stat } from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { parse } from "yaml";

const ROOT = new URL("../", import.meta.url).pathname;
const CONTENT = join(ROOT, "src/content/projects");
const ASSETS = join(ROOT, "src/assets/projects");
const SECTIONS = ["Overview", "Architecture", "What I built", "Hard problems & decisions", "Results"];

const cards = JSON.parse(await readFile(join(ROOT, "src/data/projects.json"), "utf8"));
const cardBySlug = new Map(cards.map((c) => [c.slug, c]));

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

// Strip fenced code so headings and images inside code blocks are ignored.
const withoutCode = (md) => md.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, "");

let errors = 0;
const files = (await readdir(CONTENT).catch(() => [])).filter((f) => f.endsWith(".md")).sort();

for (const file of files) {
  const path = join(CONTENT, file);
  const where = relative(ROOT, path);
  const fail = (msg) => {
    errors++;
    console.log(`FAIL  ${where}: ${msg}`);
  };

  const src = await readFile(path, "utf8");
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    fail("missing frontmatter");
    continue;
  }
  let data;
  try {
    data = parse(m[1]) ?? {};
  } catch (err) {
    fail(`invalid YAML: ${err.message}`);
    continue;
  }
  const body = withoutCode(m[2]);
  const slug = basename(file, ".md");

  if (data.slug !== slug) fail(`slug "${data.slug}" must match the filename "${slug}"`);
  const card = cardBySlug.get(slug);
  if (!card) fail(`no card in src/data/projects.json has "slug": "${slug}"`);
  else if (card.hidden && data.draft !== true) fail(`its card is hidden, so the page must stay "draft: true"`);

  const images = [
    data.cover?.src && ["cover.src", data.cover.src],
    ...(Array.isArray(data.gallery) ? data.gallery : []).map((g, i) => g?.src && [`gallery[${i}].src`, g.src]),
    ...[...body.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?/g)].map((x) => ["body image", x[1]]),
  ].filter(Boolean);
  const folder = join(ASSETS, slug) + sep;
  for (const [field, ref] of images) {
    if (/^[a-z]+:/i.test(ref)) {
      fail(`${field}: "${ref}" must be a local file in src/assets/projects/${slug}/`);
      continue;
    }
    const abs = resolve(dirname(path), ref);
    if (!abs.startsWith(folder)) fail(`${field}: "${ref}" must be in src/assets/projects/${slug}/`);
    else if (!(await exists(abs))) fail(`${field}: "${ref}" does not exist`);
  }

  const headings = [...body.matchAll(/^##[ \t]+(.+?)[ \t#]*$/gm)].map((x) => x[1].trim());
  if (headings.join("|") !== SECTIONS.join("|")) {
    fail(`sections must be exactly: ${SECTIONS.map((s) => `"## ${s}"`).join(", ")} (found ${headings.map((h) => `"${h}"`).join(", ") || "none"})`);
  }

  console.log(`${data.draft ? "draft" : "ok   "} ${where}`);
}

console.log(`\n${files.length} project pages checked, ${errors} problems.`);
process.exit(errors ? 1 : 0);
