import { writeFile } from 'node:fs/promises';
import type { IncomingMessage } from 'node:http';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, type Plugin } from 'vite';
import { cv } from './src/lib/cv.ts';
import { formatConfig, isPresetName } from './src/lib/typography-presets.ts';

/**
 * Serves the CV PDF on the dev server, generated on request from the running page,
 * so the Download button works before a production build.
 * (`npm run build` writes the real file to dist/ instead; see scripts/build.js.)
 */
function devPdf(): Plugin {
  const pdfPath = `/${cv.site.pdfFileName}`;
  return {
    name: 'cv-dev-pdf',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== pdfPath) return next();
        try {
          const { renderPdf } = await import('./scripts/pdf.js');
          const url = server.resolvedUrls?.local[0];
          if (!url) throw new Error('Dev server URL is not available yet');
          const pdf = await renderPdf(url);
          res.setHeader('Content-Type', 'application/pdf');
          res.end(pdf);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

/** Lets the dev-only Fonts panel save the chosen preset to src/lib/typography.json. */
function devTypographyEditor(): Plugin {
  const configPath = fileURLToPath(new URL('./src/lib/typography.json', import.meta.url));
  return {
    name: 'cv-dev-typography',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__typography', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Use POST');
          return;
        }
        try {
          const { preset } = JSON.parse(await readBody(req));
          if (!isPresetName(preset)) throw new Error(`Unknown preset "${preset}"`);
          await writeFile(configPath, formatConfig(preset));
          res.end('Saved');
        } catch (error) {
          res.statusCode = 400;
          res.end(error instanceof Error ? error.message : String(error));
        }
      });
    },
  };
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk: string) => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export default defineConfig({
  plugins: [svelte(), devPdf(), devTypographyEditor()],
});
