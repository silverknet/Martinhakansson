/**
 * Which font each part of the CV uses.
 *
 * Values live in typography.json. Edit that file by hand, or use the
 * "Fonts" panel on the dev server (`npm run dev`) and press Save.
 */
import { fonts, isFontName } from './fonts';
import type { FontSetting } from './typography-format';
import saved from './typography.json';

export type { FontSetting };

export const roles = {
  name: 'Name',
  headline: 'Headline',
  sectionTitle: 'Section headings',
  profile: 'Profile text',
  entryTitle: 'Entry titles',
  entrySubtitle: 'Roles & degrees',
  publicationTitle: 'Publication title',
  labels: 'Small labels',
  body: 'Body text',
} as const;

export type Role = keyof typeof roles;
export type Typography = Record<Role, FontSetting>;

export const roleKeys = Object.keys(roles) as Role[];

export const typography: Typography = saved;

/** 'sectionTitle' → '--section-title' */
function varPrefix(role: Role): string {
  return `--${role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/** CSS custom properties for one role, e.g. --name-font, --name-weight, --name-style. */
export function roleVars(role: Role, setting: FontSetting): [string, string][] {
  const prefix = varPrefix(role);
  const font = isFontName(setting.font) ? setting.font : 'Instrument Sans';
  return [
    [`${prefix}-font`, fonts[font].stack],
    [`${prefix}-weight`, String(setting.weight)],
    [`${prefix}-style`, setting.italic ? 'italic' : 'normal'],
  ];
}

/** The whole config as a `:root { … }` rule, rendered into <head>. */
export function typographyCss(config: Typography): string {
  const declarations = roleKeys
    .flatMap((role) => roleVars(role, config[role]))
    .map(([name, value]) => `${name}: ${value};`);
  return `:root { ${declarations.join(' ')} }`;
}
