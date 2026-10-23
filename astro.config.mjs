import { defineConfig } from "astro/config";

// Static output; Cloudflare Pages serves dist/ as-is.
export default defineConfig({
  output: "static",
  markdown: {
    // Leave ```mermaid blocks unhighlighted so project pages can render them as diagrams.
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
  },
});
