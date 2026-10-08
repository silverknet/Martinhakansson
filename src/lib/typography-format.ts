// Shared by the Fonts panel (Copy JSON) and the dev server (Save), so both
// produce exactly the layout of typography.json. Kept free of imports so
// vite.config.ts can use it.

export interface FontSetting {
  font: string;
  weight: number;
  italic: boolean;
}

/** One role per line. */
export function formatTypography(config: Record<string, FontSetting>): string {
  const lines = Object.entries(config).map(
    ([role, { font, weight, italic }]) =>
      `  ${JSON.stringify(role)}: { "font": ${JSON.stringify(font)}, "weight": ${weight}, "italic": ${italic} }`,
  );
  return `{\n${lines.join(',\n')}\n}\n`;
}
