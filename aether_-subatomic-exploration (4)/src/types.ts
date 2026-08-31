export type QuantumStateId = 0 | 1 | 2 | 3 | 4 | 5;

export interface QuantumPreset {
  id: QuantumStateId;
  name: string;
  subtitle: string;
  description: string;
  symbol: string;
  formula: string;
  scaleMetric: string;
  energyLevel: string;
  spinQuantum: string;
}

export type ColorThemeId = 'cyber' | 'solar' | 'biolum' | 'supernova';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  colorA: string;
  colorB: string;
  colorC: string;
  glowColor: string;
}
