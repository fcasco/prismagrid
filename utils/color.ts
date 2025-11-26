import { HSL, GridConfig, ColumnMode } from '../types';

export function hslToHex({ h, s, l }: HSL): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateGridColors(
  baseHue: number,
  baseSat: number,
  baseLight: number,
  hueStep: number,
  satStep: number,
  lightStep: number,
  rows: number,
  cols: number,
  columnMode: 'lightness' | 'saturation'
): HSL[][] {
  const grid: HSL[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowColors: HSL[] = [];
    // Calculate hue for this row
    let currentHue = (baseHue + (r * hueStep)) % 360;
    if (currentHue < 0) currentHue += 360;

    for (let c = 0; c < cols; c++) {
      let currentSat = baseSat;
      let currentLight = baseLight;

      if (columnMode === 'lightness') {
        // Vary lightness across columns
        currentLight = Math.max(0, Math.min(100, baseLight + (c * lightStep)));
      } else {
        // Vary saturation across columns
        currentSat = Math.max(0, Math.min(100, baseSat + (c * satStep)));
      }

      rowColors.push({
        h: Math.round(currentHue),
        s: Math.round(currentSat),
        l: Math.round(currentLight),
      });
    }
    grid.push(rowColors);
  }
  return grid;
}

export function generateRandomConfig(): GridConfig {
  const modes: ColumnMode[] = ['lightness', 'saturation'];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  
  // Randomize direction and magnitude of steps
  const hueStepDir = Math.random() > 0.5 ? 1 : -1;
  const valStepDir = Math.random() > 0.5 ? 1 : -1;

  return {
    baseHue: Math.floor(Math.random() * 360),
    baseSat: Math.floor(Math.random() * 40) + 40, // 40-80% safe range
    baseLight: Math.floor(Math.random() * 40) + 30, // 30-70% safe range
    hueStep: (Math.floor(Math.random() * 20) + 10) * hueStepDir,
    satStep: (Math.floor(Math.random() * 10) + 5) * valStepDir,
    lightStep: (Math.floor(Math.random() * 10) + 5) * valStepDir,
    rows: 8,
    cols: 8,
    columnMode: mode,
  };
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject('Clipboard not supported');
}

export function getContrastColor(hex: string): string {
    // Simple logic to decide if text should be black or white based on background lightness
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
}