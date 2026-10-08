# martinhakansson.com

CV website for Martin Håkansson. The page is the CV, and a downloadable A4 PDF is built from the same page.

Built with Svelte 5, Vite and TypeScript. It is a static site with no backend.

## Commands

```sh
npm install        # also downloads a headless Chrome for PDF generation (via Puppeteer)
npm run dev        # dev server at http://localhost:5173
npm run build      # static site + PDF in dist/
npm run preview    # serve dist/ locally to check the production build
npm run check      # type-check Svelte, TypeScript and build scripts
```

## Editing the CV

All content is in **[src/lib/cv.ts](src/lib/cv.ts)**: profile, experience, publications, education, skills, contact details, SEO text and the PDF file name. Edit it and both the page and the PDF update.

- Dates are `'YYYY'` or `'YYYY-MM'`; use `end: 'present'` for an ongoing role.
- An experience entry can take `highlights` (bullets), `technologies`, and a `url`.
- `todo` on an entry shows a dashed reminder **only on the dev server**. It never appears on the live site or in the PDF.
- The portrait is `public/portrait.jpg` (resized from `cvimage.png`). Set `portrait: undefined` in `cv.ts` to hide it.

## Fonts

Each part of the CV (name, headline, section headings, profile text, entry titles, roles, publication title, small labels, body text) has its own font, weight and italic setting in **[src/lib/typography.json](src/lib/typography.json)**.

To experiment, run `npm run dev` and click **Aa Fonts** in the bottom-right corner. Changes preview live.

- **Save** writes them to `typography.json`, which the live site and the PDF use.
- **Copy JSON** copies the current settings without saving, for example to paste into a chat.
- **Reset** returns to the saved settings.

The panel exists only on the dev server. It is not part of the built site or the PDF.

Available fonts are listed in [src/lib/fonts.ts](src/lib/fonts.ts). All are self-hosted, and visitors only download the ones in use. To add one, install its `@fontsource-variable/…` package and add it there.

## How the PDF works

`npm run build` runs [scripts/build.js](scripts/build.js), which:

1. builds the client bundle with Vite,
2. prerenders the page into `dist/index.html`, so the CV is readable without JavaScript and indexable by search engines,
3. opens that page in headless Chrome and prints it to `dist/Martin-Hakansson-CV.pdf`.

The PDF uses the site's own print stylesheet (`@media print` and `@page { size: A4 }`), so it matches what visitors get with the **Print** button. Links in the PDF stay clickable.

The **Download PDF** button links straight to that file. On `npm run dev`, the same URL is generated on demand, so the button works in development too.

### Deploying

Upload `dist/` to any static host. The build step needs to run Puppeteer's headless Chrome. Standard Linux CI images (e.g. GitHub Actions) generally can, and `--no-sandbox` is applied automatically when `CI` is set. If a host's build image can't run Chrome, build in CI or locally and deploy the `dist/` folder instead.

If PDF generation fails, the build fails, so a broken download link is never deployed.

## Structure

```
index.html                     HTML shell (placeholders filled in by the prerender step)
public/                        favicon.svg (placeholder monogram), portrait.jpg
scripts/build.js               production build: bundle → prerender → PDF
scripts/pdf.js                 headless-Chrome PDF rendering (used by build and dev server)
vite.config.ts                 Svelte plugin + dev-server PDF and font-save routes
src/main.ts                    client entry (hydrates prerendered HTML, or mounts in dev)
src/entry-server.ts            server entry used only for prerendering
src/app.css                    design tokens, base styles, print/page setup
src/App.svelte                 page layout (two columns on desktop/print, one on mobile)
src/lib/cv.ts                  ← all CV content
src/lib/typography.json        ← font per element (edit by hand or via the Fonts panel)
src/lib/typography.ts          turns typography.json into CSS variables
src/lib/fonts.ts               available fonts
src/lib/dev/FontPanel.svelte   dev-only font editor
src/lib/components/            CVHeader, DownloadButton, Section, Entry, Experience,
                               Publications, Education, Skills, DateRange, Meta (SEO)
```
