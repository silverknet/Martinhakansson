# CLAUDE.md

## Commits

- Never reference Claude, Claude Code, Anthropic, or AI in commit messages: no `Co-Authored-By` trailers for Claude and no "Generated with Claude Code" lines. The same applies to pull request descriptions.

## Project

CV website for martinhakansson.com: Svelte 5, Vite, and TypeScript, built as a static site. Netlify deploys every push to `main`. See README.md for details.

- All CV text lives in `src/lib/cv.ts`. The active font preset is set in `src/lib/typography.json`.
- `npm run check` type-checks. `npm run build` bundles the site, prerenders it, and generates the PDF with Puppeteer.
