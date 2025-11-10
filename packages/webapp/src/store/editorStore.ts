import { create } from 'zustand';

export interface FilterPreset {
  name: string;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    blur: number;
    sepia: number;
    grayscale: number;
  };
}

export const filterPresets: FilterPreset[] = [
  {
    name: 'None',
    filters: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, sepia: 0, grayscale: 0 },
  },
  {
    name: 'Vivid',
    filters: { brightness: 110, contrast: 120, saturation: 130, hue: 0, blur: 0, sepia: 0, grayscale: 0 },
  },
  {
    name: 'Warm',
    filters: { brightness: 105, contrast: 105, saturation: 110, hue: 10, blur: 0, sepia: 15, grayscale: 0 },
  },
  {
    name: 'Cool',
    filters: { brightness: 105, contrast: 105, saturation: 110, hue: -10, blur: 0, sepia: 0, grayscale: 0 },
  },
  {
    name: 'B&W',
    filters: { brightness: 100, contrast: 110, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100 },
  },
  {
    name: 'Sepia',
    filters: { brightness: 100, contrast: 100, saturation: 80, hue: 0, blur: 0, sepia: 60, grayscale: 0 },
  },
  {
    name: 'Vintage',
    filters: { brightness: 95, contrast: 90, saturation: 80, hue: 5, blur: 0, sepia: 30, grayscale: 20 },
  },
  {
    name: 'Dramatic',
    filters: { brightness: 90, contrast: 140, saturation: 120, hue: 0, blur: 0, sepia: 0, grayscale: 0 },
  },
  {
    name: 'Soft',
    filters: { brightness: 110, contrast: 90, saturation: 95, hue: 0, blur: 0.5, sepia: 5, grayscale: 0 },
  },
];

interface EditorState {
  // Image editing
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  filters: FilterPreset['filters'];
  selectedPreset: string;

  // Video editing
  videoTrim: {
    start: number;
    end: number;
  } | null;

  // Actions
  setRotation: (rotation: number) => void;
  setFlipHorizontal: (flip: boolean) => void;
  setFlipVertical: (flip: boolean) => void;
  setCrop: (crop: EditorState['crop']) => void;
  setFilters: (filters: FilterPreset['filters']) => void;
  applyPreset: (presetName: string) => void;
  setVideoTrim: (trim: EditorState['videoTrim']) => void;
  reset: () => void;
}

const defaultFilters = filterPresets[0].filters;

export const useEditorStore = create<EditorState>((set) => ({
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
  crop: null,
  filters: defaultFilters,
  selectedPreset: 'None',
  videoTrim: null,

  setRotation: (rotation) => set({ rotation }),
  setFlipHorizontal: (flip) => set({ flipHorizontal: flip }),
  setFlipVertical: (flip) => set({ flipVertical: flip }),
  setCrop: (crop) => set({ crop }),
  setFilters: (filters) => set({ filters, selectedPreset: 'Custom' }),
  applyPreset: (presetName) => {
    const preset = filterPresets.find((p) => p.name === presetName);
    if (preset) {
      set({ filters: preset.filters, selectedPreset: presetName });
    }
  },
  setVideoTrim: (videoTrim) => set({ videoTrim }),
  reset: () =>
    set({
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      crop: null,
      filters: defaultFilters,
      selectedPreset: 'None',
      videoTrim: null,
    }),
}));

export function getFilterString(filters: FilterPreset['filters']): string {
  return `
    brightness(${filters.brightness}%)
    contrast(${filters.contrast}%)
    saturate(${filters.saturation}%)
    hue-rotate(${filters.hue}deg)
    blur(${filters.blur}px)
    sepia(${filters.sepia}%)
    grayscale(${filters.grayscale}%)
  `.trim();
}
