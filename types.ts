export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export type ColumnMode = 'lightness' | 'saturation';

export interface GridConfig {
  baseHue: number;
  baseSat: number;
  baseLight: number;
  hueStep: number;
  satStep: number;
  lightStep: number;
  rows: number;
  cols: number;
  columnMode: ColumnMode;
}

export interface ThemeSuggestion {
  name: string;
  description: string;
  config: GridConfig;
}

export interface SavedTheme {
  id: string;
  name: string;
  description: string;
  config: GridConfig;
  createdAt: number;
}

export const DEFAULT_CONFIG: GridConfig = {
  baseHue: 200,
  baseSat: 70,
  baseLight: 50,
  hueStep: 15,
  satStep: 10,
  lightStep: 8,
  rows: 8,
  cols: 8,
  columnMode: 'lightness',
};