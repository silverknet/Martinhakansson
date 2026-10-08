import { readFile, writeFile } from 'node:fs/promises';
import type { IncomingMessage } from 'node:http';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, type Plugin } from 'vite';
import { cv } from './src/lib/cv.ts';
import { formatTypography, type FontSetting } from './src/lib/typography-format.ts';

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

/** Lets the dev-only Fonts panel save its settings to src/lib/typography.json. */
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
          const current = JSON.parse(await readFile(configPath, 'utf8'));
          const next = JSON.parse(await readBody(req));
          await writeFile(configPath, formatTypography(validateTypography(next, Object.keys(current))));
          res.end('Saved');
        } catch (error) {
          res.statusCode = 400;
          res.end(error instanceof Error ? error.message : String(error));
        }
      });
    },
  };
}

function validateTypography(value: unknown, roles: string[]): Record<string, FontSetting> {
  if (typeof value !== 'object' || value === null) throw new Error('Expected an object');
  const config = value as Record<string, Partial<FontSetting>>;
  for (const role of roles) {
    const setting = config[role];
    if (
      typeof setting?.font !== 'string' ||
      typeof setting.weight !== 'number' ||
      setting.weight < 100 ||
      setting.weight > 900 ||
      typeof setting.italic !== 'boolean'
    ) {
      throw new Error(`Invalid setting for "${role}"`);
    }
  }
  return Object.fromEntries(roles.map((role) => [role, config[role] as FontSetting]));
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
