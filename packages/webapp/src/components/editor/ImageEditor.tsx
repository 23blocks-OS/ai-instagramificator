'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { MediaFile } from '@/store/mediaStore';
import { useEditorStore, filterPresets, getFilterString } from '@/store/editorStore';
import {
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop as CropIcon,
  Sliders,
  Sparkles,
  X,
  Check,
  Undo,
  Download,
} from 'lucide-react';

interface ImageEditorProps {
  media: MediaFile;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

export function ImageEditor({ media, onSave, onCancel }: ImageEditorProps) {
  const router = useRouter();
  const {
    rotation,
    flipHorizontal,
    flipVertical,
    crop: cropState,
    filters,
    selectedPreset,
    setRotation,
    setFlipHorizontal,
    setFlipVertical,
    setCrop: setCropState,
    setFilters,
    applyPreset,
    reset,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<'crop' | 'rotate' | 'filters' | 'adjust'>('filters');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const handleFlipH = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const handleFlipV = () => {
    setFlipVertical(!flipVertical);
  };

  const handleSave = async () => {
    if (!imgRef.current) return;

    const canvas = canvasRef.current || document.createElement('canvas');
    const image = imgRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    // Apply crop if exists
    if (completedCrop) {
      width = completedCrop.width;
      height = completedCrop.height;
    }

    // Adjust for rotation
    if (rotation === 90 || rotation === 270) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipHorizontal) ctx.scale(-1, 1);
    if (flipVertical) ctx.scale(1, -1);

    // Apply filters
    ctx.filter = getFilterString(filters);

    // Draw image
    if (completedCrop) {
      ctx.drawImage(
        image,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        -width / 2,
        -height / 2,
        width,
        height
      );
    } else {
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
    }

    ctx.restore();

    // Convert to blob and save
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onSave(url);
      }
    }, 'image/jpeg', 0.95);
  };

  const handleDownload = () => {
    handleSave();
  };

  const imageStyle = {
    transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
    filter: getFilterString(filters),
    transition: 'transform 0.3s ease',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-white font-semibold">Edit Image</h2>
            <p className="text-sm text-gray-400">{media.metadata.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Undo className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Check className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          {/* Tabs */}
          <div className="p-4 border-b border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <TabButton
                icon={<Sparkles className="w-4 h-4" />}
                label="Filters"
                active={activeTab === 'filters'}
                onClick={() => setActiveTab('filters')}
              />
              <TabButton
                icon={<Sliders className="w-4 h-4" />}
                label="Adjust"
                active={activeTab === 'adjust'}
                onClick={() => setActiveTab('adjust')}
              />
              <TabButton
                icon={<CropIcon className="w-4 h-4" />}
                label="Crop"
                active={activeTab === 'crop'}
                onClick={() => setActiveTab('crop')}
              />
              <TabButton
                icon={<RotateCw className="w-4 h-4" />}
                label="Rotate"
                active={activeTab === 'rotate'}
                onClick={() => setActiveTab('rotate')}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'filters' && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold mb-3">Filter Presets</h3>
                {filterPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.name)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedPreset === preset.name
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-white font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'adjust' && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold mb-3">Adjustments</h3>
                <Slider
                  label="Brightness"
                  value={filters.brightness}
                  onChange={(v) => setFilters({ ...filters, brightness: v })}
                  min={50}
                  max={150}
                />
                <Slider
                  label="Contrast"
                  value={filters.contrast}
                  onChange={(v) => setFilters({ ...filters, contrast: v })}
                  min={50}
                  max={150}
                />
                <Slider
                  label="Saturation"
                  value={filters.saturation}
                  onChange={(v) => setFilters({ ...filters, saturation: v })}
                  min={0}
                  max={200}
                />
                <Slider
                  label="Hue"
                  value={filters.hue}
                  onChange={(v) => setFilters({ ...filters, hue: v })}
                  min={-180}
                  max={180}
                />
                <Slider
                  label="Blur"
                  value={filters.blur}
                  onChange={(v) => setFilters({ ...filters, blur: v })}
                  min={0}
                  max={10}
                  step={0.1}
                />
                <Slider
                  label="Sepia"
                  value={filters.sepia}
                  onChange={(v) => setFilters({ ...filters, sepia: v })}
                  min={0}
                  max={100}
                />
                <Slider
                  label="Grayscale"
                  value={filters.grayscale}
                  onChange={(v) => setFilters({ ...filters, grayscale: v })}
                  min={0}
                  max={100}
                />
              </div>
            )}

            {activeTab === 'crop' && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold mb-3">Crop Image</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Drag on the image to select the area you want to keep
                </p>
                <button
                  onClick={() => {
                    setCrop(undefined);
                    setCompletedCrop(undefined);
                  }}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear Crop
                </button>
              </div>
            )}

            {activeTab === 'rotate' && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold mb-3">Transform</h3>
                <button
                  onClick={handleRotate}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <RotateCw className="w-5 h-5" />
                  <span>Rotate 90°</span>
                </button>
                <button
                  onClick={handleFlipH}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <FlipHorizontal className="w-5 h-5" />
                  <span>Flip Horizontal</span>
                </button>
                <button
                  onClick={handleFlipV}
                  className="w-full flex items-center gap-3 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  <FlipVertical className="w-5 h-5" />
                  <span>Flip Vertical</span>
                </button>
                <div className="mt-6 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400">Current rotation: {rotation}°</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="max-w-full max-h-full">
            {activeTab === 'crop' ? (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={media.url}
                  alt={media.metadata.name}
                  style={imageStyle}
                  className="max-w-full max-h-[calc(100vh-200px)]"
                />
              </ReactCrop>
            ) : (
              <img
                ref={imgRef}
                src={media.url}
                alt={media.metadata.name}
                style={imageStyle}
                className="max-w-full max-h-[calc(100vh-200px)]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-400">{label}</label>
        <span className="text-sm text-white font-medium">{value.toFixed(step < 1 ? 1 : 0)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
      />
    </div>
  );
}
