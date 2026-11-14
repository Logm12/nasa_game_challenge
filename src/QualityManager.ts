export type GraphicsQuality = 'low' | 'balanced' | 'high';

export interface QualityConfig {
  maxDpr: number;
  shadows: boolean;
  shadowMapSize: number;
  anisotropy: number;
  particleCountFactor: number;
}

export const QUALITY_PRESETS: Record<GraphicsQuality, QualityConfig> = {
  low: {
    maxDpr: 1.0,
    shadows: false,
    shadowMapSize: 512,
    anisotropy: 1,
    particleCountFactor: 0.25
  },
  balanced: {
    maxDpr: 1.25,
    shadows: true,
    shadowMapSize: 1024,
    anisotropy: 4,
    particleCountFactor: 1.0
  },
  high: {
    maxDpr: 1.75,
    shadows: true,
    shadowMapSize: 2048,
    anisotropy: 16,
    particleCountFactor: 1.0
  }
};

const STORAGE_KEY = 'nasa_graphics_quality';
const listeners: Array<(quality: GraphicsQuality, config: QualityConfig) => void> = [];
let inMemoryQuality: GraphicsQuality = 'balanced';

export function getStoredQuality(): GraphicsQuality {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(STORAGE_KEY) as GraphicsQuality | null;
      if (val === 'low' || val === 'balanced' || val === 'high') {
        return val;
      }
    }
  } catch (e) {
    // ignore
  }
  return inMemoryQuality;
}

export function setStoredQuality(quality: GraphicsQuality): void {
  if (quality !== 'low' && quality !== 'balanced' && quality !== 'high') return;
  inMemoryQuality = quality;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, quality);
    }
  } catch (e) {
    // ignore
  }
  const config = QUALITY_PRESETS[quality];
  listeners.forEach(fn => {
    try {
      fn(quality, config);
    } catch (err) {
      console.warn('Quality change listener error:', err);
    }
  });
}

export function onQualityChange(fn: (quality: GraphicsQuality, config: QualityConfig) => void): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function getQualityConfig(quality?: GraphicsQuality): QualityConfig {
  const q = quality || getStoredQuality();
  return QUALITY_PRESETS[q] || QUALITY_PRESETS.balanced;
}

export function computeEffectiveDpr(quality?: GraphicsQuality): number {
  const cfg = getQualityConfig(quality);
  const nativeDpr = typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1;
  return Math.max(0.75, Math.min(nativeDpr, cfg.maxDpr));
}
