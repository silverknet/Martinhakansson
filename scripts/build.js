// @ts-check
/**
 * Production build (`npm run build`):
 *   1. Bundle the client app with Vite into dist/.
 *   2. Prerender the page into dist/index.html, so the CV is readable
 *      without JavaScript and visible to search engines and link previews.
 *   3. Print that page to an A4 PDF in dist/, which the "Download PDF" button links to.
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build, preview } from 'vite';
import { renderPdf } from './pdf.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = `${root}dist`;
const ssrDist = `${root}.ssr`;

// 1. Client bundle
await build({ root });

// 2. Prerender
await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.ts', outDir: ssrDist, emptyOutDir: true },
});

/** @type {{ render: () => { head: string, body: string }, pdfFileName: string }} */
const server = await import(pathToFileURL(`${ssrDist}/entry-server.js`).href);
const { head, body } = server.render();

const indexPath = `${dist}/index.html`;
const template = await readFile(indexPath, 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('index.html is missing the <!--app-head--> or <!--app-html--> placeholder');
}
await writeFile(
  indexPath,
  template.replace('<!--app-head-->', head).replace('<!--app-html-->', body),
);
await rm(ssrDist, { recursive: true, force: true });
console.log('✓ prerendered dist/index.html');

// 3. PDF
const previewServer = await preview({ root, logLevel: 'warn', preview: { port: 4174, open: false } });
try {
  const url = previewServer.resolvedUrls?.local[0];
  if (!url) throw new Error('Vite preview server did not report a local URL');
  await writeFile(`${dist}/${server.pdfFileName}`, await renderPdf(url));
  console.log(`✓ generated dist/${server.pdfFileName}`);
} finally {
  await previewServer.close();
}
