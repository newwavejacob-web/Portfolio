// Checks every link in the built site (dist/): internal links must resolve to
// a file in dist/, external links must answer with a 2xx/3xx status.
// Run after `npm run build`. Exits non-zero if anything is broken.
import { readFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const TIMEOUT_MS = 15000;
// Hosts that reject automated requests (LinkedIn answers 999). These are
// reported as SKIP and need a manual click-through before deploying.
const BOT_BLOCKED = ["linkedin.com"];

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (extname(p) === ".html") out.push(p);
  }
  return out;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function checkInternal(href) {
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  if (path === "" || path === "/") return exists(join(DIST, "index.html"));
  const target = join(DIST, path);
  return (await exists(target)) || exists(join(target, "index.html"));
}

async function checkExternal(url) {
  // Some hosts reject HEAD, so fall back to GET.
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "user-agent": "portfolio-link-check" },
      });
      if (res.ok) return { ok: true, status: res.status };
      if (method === "GET") return { ok: false, status: res.status };
    } catch (err) {
      if (method === "GET") return { ok: false, status: err.name };
    }
  }
}

const links = new Map(); // href -> set of pages
for (const file of await htmlFiles(DIST)) {
  const html = await readFile(file, "utf8");
  for (const [, href] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("data:")) continue;
    if (!links.has(href)) links.set(href, new Set());
    links.get(href).add(file.replace(DIST, ""));
  }
}

const results = await Promise.all(
  [...links.keys()].map(async (href) => {
    if (/^https?:\/\//.test(href)) {
      const host = new URL(href).hostname;
      if (BOT_BLOCKED.some((h) => host === h || host.endsWith(`.${h}`))) {
        return { href, ok: true, skipped: true, status: "manual" };
      }
      const r = await checkExternal(href);
      return { href, ...r };
    }
    return { href, ok: await checkInternal(href), status: "file" };
  }),
);

let broken = 0;
let skipped = 0;
for (const r of results.sort((a, b) => a.href.localeCompare(b.href))) {
  if (!r.ok) broken++;
  if (r.skipped) skipped++;
  console.log(`${r.skipped ? "SKIP" : r.ok ? "ok  " : "FAIL"}  ${String(r.status).padEnd(6)} ${r.href}`);
}
console.log(`\n${results.length} links checked, ${broken} broken, ${skipped} need a manual check.`);
process.exit(broken ? 1 : 0);
