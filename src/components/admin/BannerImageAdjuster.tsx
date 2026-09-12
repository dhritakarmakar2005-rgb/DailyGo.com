import React from 'react';
import { PromoBanner } from '../../types';
import { PromoBannerCard } from '../common/PromoBannerCard';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Layout,
  Palette,
  Eye,
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
  Ban
} from 'lucide-react';

interface BannerImageAdjusterProps {
  banner: PromoBanner;
  onChange: (updated: Partial<PromoBanner>) => void;
}

const COLOR_OPTIONS = [
  {
    id: 'no-color-white',
    name: 'No Color (Clean White)',
    desc: 'Pure natural image, no orange/blue tint',
    bgClass: 'bg-white border border-slate-300',
    noColor: true,
  },
  {
    id: 'no-color-dark',
    name: 'No Color (Dark Slate)',
    desc: 'Pure natural image with charcoal background',
    bgClass: 'bg-slate-900 border border-slate-700',
    noColor: true,
  },
  {
    id: 'no-color-transparent',
    name: 'No Color (Poster Only)',
    desc: 'Transparent frame, 100% image',
    bgClass: 'bg-gradient-to-r from-slate-200 to-slate-100 border border-slate-300',
    noColor: true,
  },
  {
    id: 'from-emerald-600 to-teal-800',
    name: 'Emerald Fresh',
    desc: 'Classic DailyGo green',
    bgClass: 'bg-gradient-to-r from-emerald-600 to-teal-800',
    noColor: false,
  },
  {
    id: 'from-amber-500 to-orange-700',
    name: 'Amber Orange',
    desc: 'Food & spicy delights',
    bgClass: 'bg-gradient-to-r from-amber-500 to-orange-700',
    noColor: false,
  },
  {
    id: 'from-rose-600 to-red-800',
    name: 'Rose Red',
    desc: 'Hot festive offers',
    bgClass: 'bg-gradient-to-r from-rose-600 to-red-800',
    noColor: false,
  },
  {
    id: 'from-blue-600 to-indigo-800',
    name: 'Royal Blue',
    desc: 'Rural express special',
    bgClass: 'bg-gradient-to-r from-blue-600 to-indigo-800',
    noColor: false,
  },
  {
    id: 'from-purple-600 to-pink-700',
    name: 'Purple Pink',
    desc: 'Festive discounts',
    bgClass: 'bg-gradient-to-r from-purple-600 to-pink-700',
    noColor: false,
  },
];

const POSITION_PRESETS = [
  { label: '↖ Top L', x: 0, y: 0 },
  { label: '⬆ Top C', x: 50, y: 0 },
  { label: '↗ Top R', x: 100, y: 0 },
  { label: '⬅ Mid L', x: 0, y: 50 },
  { label: '🎯 Center', x: 50, y: 50 },
  { label: '➡ Mid R', x: 100, y: 50 },
  { label: '↙ Btm L', x: 0, y: 100 },
  { label: '⬇ Btm C', x: 50, y: 100 },
  { label: '↘ Btm R', x: 100, y: 100 },
];

export const BannerImageAdjuster: React.FC<BannerImageAdjusterProps> = ({
  banner,
  onChange,
}) => {
  const currentZoom = banner.imageZoom ?? 100;
  const currentPosX = banner.imagePositionX ?? 50;
  const currentPosY = banner.imagePositionY ?? 50;
  const currentFit = banner.imageFit ?? 'cover';
  const currentOpacity = banner.imageOpacity ?? 100;
  const currentLayout = banner.bannerLayout ?? 'full';
  const currentOverlay = banner.imageOverlay ?? (banner.noColor ? 'none' : 'subtle');

  const handleResetAdjustments = () => {
    onChange({
      imageZoom: 100,
      imagePositionX: 50,
      imagePositionY: 50,
      imageFit: 'cover',
      imageOpacity: 100,
      imageOverlay: banner.noColor ? 'none' : 'subtle',
      bannerLayout: 'full',
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. REAL-TIME LIVE PREVIEW */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="font-extrabold text-slate-900 flex items-center space-x-1.5">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Live Banner Preview</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetAdjustments}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Adjustments</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200">
          <PromoBannerCard banner={banner} previewMode={true} />
        </div>
      </div>

      {/* 2. COLOR & THEME PALETTE (WITH PROMINENT NO-COLOR OPTION) */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-extrabold text-slate-900 flex items-center space-x-1.5">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>Banner Color Theme</span>
          </label>
          <span className="text-[10px] font-semibold text-slate-500">
            Select &quot;No Color&quot; to remove orange/blue gradients
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COLOR_OPTIONS.map(opt => {
            const isSelected =
              (opt.noColor && banner.noColor && banner.bgColor === opt.id) ||
              (!opt.noColor && !banner.noColor && banner.bgColor === opt.id);

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  onChange({
                    bgColor: opt.id,
                    noColor: opt.noColor,
                    imageOverlay: opt.noColor ? 'none' : currentOverlay,
                  })
                }
                className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-5 h-5 rounded-lg ${opt.bgClass} flex items-center justify-center shrink-0`}>
                    {opt.noColor && <Ban className="w-3 h-3 text-slate-500" />}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div>
                  <p className="font-extrabold text-[11px] text-slate-900 leading-tight">
                    {opt.name}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. IMAGE POSITION & ADJUSTMENT CONTROLS */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="font-extrabold text-slate-900 flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Image Position, Scaling & Framing</span>
          </label>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Zoom: {currentZoom}% • X: {currentPosX}% • Y: {currentPosY}%
          </span>
        </div>

        {/* Layout Style Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
            <Layout className="w-3.5 h-3.5 text-slate-500" />
            <span>Banner Presentation Layout</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChange({ bannerLayout: 'full' })}
              className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                currentLayout === 'full'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="block text-[11px]">Full Background</span>
              <span className="text-[9px] opacity-80 block font-normal">Spans entire card</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ bannerLayout: 'split' })}
              className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                currentLayout === 'split'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="block text-[11px]">Split Side Image</span>
              <span className="text-[9px] opacity-80 block font-normal">Text left, photo right</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ bannerLayout: 'poster' })}
              className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                currentLayout === 'poster'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="block text-[11px]">Pure Poster / Flyer</span>
              <span className="text-[9px] opacity-80 block font-normal">Edge-to-edge graphic</span>
            </button>
          </div>
        </div>

        {/* Fit Mode */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Image Fit Mode</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['cover', 'contain', 'fill'] as const).map(fit => (
              <button
                key={fit}
                type="button"
                onClick={() => onChange({ imageFit: fit })}
                className={`py-1.5 px-2 rounded-xl border font-bold capitalize transition-all cursor-pointer ${
                  currentFit === fit
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {fit === 'cover' ? 'Cover (Fill & Crop)' : fit === 'contain' ? 'Contain (Full Image)' : 'Fill (Stretch)'}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom / Scale Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span className="flex items-center space-x-1">
              <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Image Zoom / Scale</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => onChange({ imageZoom: Math.max(50, currentZoom - 10) })}
                className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100"
              >
                -
              </button>
              <span className="w-10 text-center font-extrabold">{currentZoom}%</span>
              <button
                type="button"
                onClick={() => onChange({ imageZoom: Math.min(200, currentZoom + 10) })}
                className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={currentZoom}
            onChange={e => onChange({ imageZoom: Number(e.target.value) })}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Focal Position X & Y Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center space-x-1">
                <Move className="w-3 h-3 text-slate-500" />
                <span>Horizontal Alignment (X)</span>
              </span>
              <span>{currentPosX}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentPosX}
              onChange={e => onChange({ imagePositionX: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
              <span>Left (0%)</span>
              <span>Center (50%)</span>
              <span>Right (100%)</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center space-x-1">
                <Move className="w-3 h-3 text-slate-500" />
                <span>Vertical Alignment (Y)</span>
              </span>
              <span>{currentPosY}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentPosY}
              onChange={e => onChange({ imagePositionY: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
              <span>Top (0%)</span>
              <span>Center (50%)</span>
              <span>Bottom (100%)</span>
            </div>
          </div>
        </div>

        {/* Quick Position Direction Presets */}
        <div>
          <span className="block text-[10px] font-bold text-slate-500 mb-1">
            Quick Alignment Snapshots:
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1">
            {POSITION_PRESETS.map(p => {
              const isSelected = currentPosX === p.x && currentPosY === p.y;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() =>
                    onChange({
                      imagePositionX: p.x,
                      imagePositionY: p.y,
                    })
                  }
                  className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center truncate ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Opacity & Overlay Tint */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Image Opacity / Vibrancy</span>
              <span>{currentOpacity}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              step="5"
              value={currentOpacity}
              onChange={e => onChange({ imageOpacity: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[9px] text-slate-400 block">
              Set to 100% for full crisp natural brightness
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Text Contrast Overlay
            </label>
            <select
              value={currentOverlay}
              onChange={e => onChange({ imageOverlay: e.target.value as any })}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-hidden"
            >
              <option value="none">None (100% Natural / No Scrim)</option>
              <option value="subtle">Subtle Vignette (Legible text)</option>
              <option value="gradient">Horizontal Gradient Scrim</option>
              <option value="dark">Dark Dimmer</option>
            </select>
          </div>
        </div>

        {/* Pre-designed Poster Mode: Hide overlay text */}
        <div className="pt-2 border-t border-slate-200">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(banner.hideTextOnBanner)}
              onChange={e => onChange({ hideTextOnBanner: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
            />
            <span className="font-bold text-slate-800 text-[11px]">
              Hide Title & Subtitle on banner (Best for pre-designed flyer graphics that already have text)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
