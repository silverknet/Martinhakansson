/**
 * Applies the active font preset (typography.json → typography-presets.ts)
 * as CSS custom properties, e.g. --name-font, --name-weight, --name-style.
 */
import { fonts, isFontName } from './fonts';
import {
  defaultPreset,
  isPresetName,
  presets,
  roleKeys,
  type FontSetting,
  type PresetName,
  type Role,
  type Typography,
} from './typography-presets';
import saved from './typography.json';

export const savedPreset: PresetName = isPresetName(saved.preset) ? saved.preset : defaultPreset;

export const typography: Typography = presets[savedPreset];

/** 'sectionTitle' → '--section-title' */
function varPrefix(role: Role): string {
  return `--${role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/** CSS custom properties for one role. */
export function roleVars(role: Role, setting: FontSetting): [string, string][] {
  const prefix = varPrefix(role);
  const font = isFontName(setting.font) ? setting.font : 'Instrument Sans';
  return [
    [`${prefix}-font`, fonts[font].stack],
    [`${prefix}-weight`, String(setting.weight)],
    [`${prefix}-style`, setting.italic ? 'italic' : 'normal'],
  ];
}

/** A whole preset as a `:root { … }` rule, rendered into <head>. */
export function typographyCss(config: Typography): string {
  const declarations = roleKeys
    .flatMap((role) => roleVars(role, config[role]))
    .map(([name, value]) => `${name}: ${value};`);
  return `:root { ${declarations.join(' ')} }`;
}
