/**
 * Fonts available to the typography config (src/lib/typography.json).
 *
 * All are self-hosted. Browsers only download a font file when the page
 * actually uses it, so unused entries here cost nothing for visitors.
 *
 * To add a font: `npm install @fontsource-variable/<name>`, import its CSS
 * below, and add an entry to `fonts`.
 */
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/source-serif-4/opsz.css';
import '@fontsource-variable/source-serif-4/opsz-italic.css';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/eb-garamond';
import '@fontsource-variable/eb-garamond/wght-italic.css';
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/instrument-sans/wght-italic.css';
import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/inter/opsz-italic.css';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/schibsted-grotesk/wght-italic.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist/wght-italic.css';
import '@fontsource-variable/geist-mono';
import '@fontsource-variable/geist-mono/wght-italic.css';

export interface FontOption {
  group: 'Serif' | 'Sans' | 'Mono';
  stack: string;
}

const serif = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif";
const sans = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const mono = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export const fonts = {
  Newsreader: { group: 'Serif', stack: `'Newsreader Variable', ${serif}` },
  'Source Serif 4': { group: 'Serif', stack: `'Source Serif 4 Variable', ${serif}` },
  Fraunces: { group: 'Serif', stack: `'Fraunces Variable', ${serif}` },
  'EB Garamond': { group: 'Serif', stack: `'EB Garamond Variable', ${serif}` },
  'Instrument Sans': { group: 'Sans', stack: `'Instrument Sans Variable', ${sans}` },
  Inter: { group: 'Sans', stack: `'Inter Variable', ${sans}` },
  'Schibsted Grotesk': { group: 'Sans', stack: `'Schibsted Grotesk Variable', ${sans}` },
  Geist: { group: 'Sans', stack: `'Geist Variable', ${sans}` },
  'Geist Mono': { group: 'Mono', stack: `'Geist Mono Variable', ${mono}` },
} satisfies Record<string, FontOption>;

export type FontName = keyof typeof fonts;

export function isFontName(name: string): name is FontName {
  return Object.hasOwn(fonts, name);
}
