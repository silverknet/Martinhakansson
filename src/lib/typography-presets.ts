/**
 * Font presets. Each one sets the font for every part of the CV.
 * The active preset is chosen in typography.json (or with the Fonts panel on `npm run dev`).
 *
 * Font names must match entries in fonts.ts. This file has no imports so
 * vite.config.ts can use it too.
 */

export interface FontSetting {
  font: string;
  weight: number;
  italic: boolean;
}

export const roleKeys = [
  'name',
  'headline',
  'sectionTitle',
  'profile',
  'entryTitle',
  'entrySubtitle',
  'publicationTitle',
  'labels',
  'body',
] as const;

export type Role = (typeof roleKeys)[number];
export type Typography = Record<Role, FontSetting>;

const f = (font: string, weight: number, italic = false): FontSetting => ({ font, weight, italic });

export const presets = {
  Editorial: {
    name: f('Newsreader', 400),
    headline: f('Instrument Sans', 500),
    sectionTitle: f('Newsreader', 400),
    profile: f('Newsreader', 400),
    entryTitle: f('Instrument Sans', 600),
    entrySubtitle: f('Newsreader', 400, true),
    publicationTitle: f('Newsreader', 450),
    labels: f('Instrument Sans', 600),
    body: f('Instrument Sans', 400),
  },
  Swiss: {
    name: f('Schibsted Grotesk', 600),
    headline: f('Schibsted Grotesk', 400),
    sectionTitle: f('Schibsted Grotesk', 600),
    profile: f('Schibsted Grotesk', 400),
    entryTitle: f('Schibsted Grotesk', 600),
    entrySubtitle: f('Schibsted Grotesk', 400),
    publicationTitle: f('Schibsted Grotesk', 500),
    labels: f('Schibsted Grotesk', 600),
    body: f('Schibsted Grotesk', 400),
  },
  Classic: {
    name: f('Source Serif 4', 500),
    headline: f('Source Serif 4', 400, true),
    sectionTitle: f('Source Serif 4', 600),
    profile: f('Source Serif 4', 400),
    entryTitle: f('Source Serif 4', 600),
    entrySubtitle: f('Source Serif 4', 400, true),
    publicationTitle: f('Source Serif 4', 500),
    labels: f('Source Serif 4', 600),
    body: f('Source Serif 4', 400),
  },
  Technical: {
    name: f('Geist', 600),
    headline: f('Geist Mono', 400),
    sectionTitle: f('Geist', 600),
    profile: f('Geist', 350),
    entryTitle: f('Geist', 600),
    entrySubtitle: f('Geist', 400),
    publicationTitle: f('Geist', 500),
    labels: f('Geist Mono', 500),
    body: f('Geist', 400),
  },
  Expressive: {
    name: f('Fraunces', 500),
    headline: f('Inter', 500),
    sectionTitle: f('Fraunces', 500),
    profile: f('Fraunces', 400),
    entryTitle: f('Inter', 600),
    entrySubtitle: f('Fraunces', 400, true),
    publicationTitle: f('Fraunces', 500),
    labels: f('Inter', 600),
    body: f('Inter', 400),
  },
} satisfies Record<string, Typography>;

export type PresetName = keyof typeof presets;

export const presetNames = Object.keys(presets) as PresetName[];

export const defaultPreset: PresetName = 'Editorial';

export function isPresetName(name: unknown): name is PresetName {
  return typeof name === 'string' && Object.hasOwn(presets, name);
}

/** The saved-config file format: `{ "preset": "Editorial" }`. */
export function formatConfig(preset: PresetName): string {
  return `${JSON.stringify({ preset }, null, 2)}\n`;
}
