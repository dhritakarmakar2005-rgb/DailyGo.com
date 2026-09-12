import React from 'react';
import { PromoBanner } from '../../types';
import { ArrowRight, Edit3, Trash2, Tag, ExternalLink, Sparkles } from 'lucide-react';

interface PromoBannerCardProps {
  banner: PromoBanner;
  onClick?: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  previewMode?: boolean;
}

export const PromoBannerCard: React.FC<PromoBannerCardProps> = ({
  banner,
  onClick,
  isAdmin = false,
  onEdit,
  onDelete,
  previewMode = false,
}) => {
  // Determine if banner has "no color"
  const isNoColor =
    banner.noColor ||
    banner.bgColor === 'no-color-white' ||
    banner.bgColor === 'no-color-dark' ||
    banner.bgColor === 'no-color-transparent' ||
    banner.bgColor === 'none' ||
    banner.bgColor === 'transparent';

  const isDarkNoColor = banner.bgColor === 'no-color-dark';
  const isTransparent = banner.bgColor === 'no-color-transparent' || banner.bgColor === 'transparent';

  // Determine container styling
  let containerBgClass = '';
  let isLightMode = false;

  if (isNoColor) {
    if (isDarkNoColor) {
      containerBgClass = 'bg-slate-900 border border-slate-800 text-white';
    } else if (isTransparent) {
      containerBgClass = 'bg-slate-900/90 border border-slate-300/80 text-white';
    } else {
      // Clean white / light
      containerBgClass = 'bg-white border border-slate-200 text-slate-900 shadow-sm';
      isLightMode = true;
    }
  } else {
    // Standard colored gradient
    containerBgClass = `bg-gradient-to-br ${banner.bgColor || 'from-emerald-600 to-teal-800'} text-white shadow-md`;
  }

  // Position, zoom, fit calculations
  const fit = banner.imageFit || 'cover';
  const posX = banner.imagePositionX ?? 50;
  const posY = banner.imagePositionY ?? 50;
  const zoom = banner.imageZoom ?? 100;
  const opacity = (banner.imageOpacity ?? 100) / 100;
  const overlay = banner.imageOverlay || (isNoColor ? 'none' : 'subtle');
  const layout = banner.bannerLayout || 'full';
  const hideText = Boolean(banner.hideTextOnBanner);

  // Overlay styles
  let overlayGradientClass = '';
  if (overlay === 'dark') {
    overlayGradientClass = 'bg-black/60';
  } else if (overlay === 'subtle') {
    overlayGradientClass = isLightMode
      ? 'bg-gradient-to-t from-white/90 via-white/50 to-transparent'
      : 'bg-gradient-to-t from-black/70 via-black/30 to-transparent';
  } else if (overlay === 'gradient') {
    overlayGradientClass = isLightMode
      ? 'bg-gradient-to-r from-white/95 via-white/70 to-transparent'
      : 'bg-gradient-to-r from-black/80 via-black/40 to-transparent';
  }

  return (
    <div
      onClick={!isAdmin ? onClick : undefined}
      className={`relative rounded-3xl overflow-hidden transition-all select-none ${containerBgClass} ${
        !isAdmin && !previewMode ? 'cursor-pointer hover:scale-[1.01] hover:shadow-xl' : ''
      } ${previewMode ? 'min-h-[190px]' : 'min-h-[175px]'} flex flex-col justify-between group`}
      style={{
        boxShadow: isLightMode
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)'
          : undefined,
      }}
    >
      {/* 1. FULL BACKGROUND IMAGE LAYOUT */}
      {layout === 'full' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {banner.image ? (
            <img
              src={banner.image}
              alt={banner.title}
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              className={`w-full h-full transition-transform duration-300 ${
                isNoColor ? '' : 'mix-blend-overlay'
              }`}
              style={{
                objectFit: fit,
                objectPosition: `${posX}% ${posY}%`,
                transform: `scale(${zoom / 100})`,
                opacity: isNoColor ? opacity : Math.min(opacity, 0.45),
              }}
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
              No Image
            </div>
          )}

          {/* Optional Overlay Scrim */}
          {overlay !== 'none' && (
            <div className={`absolute inset-0 ${overlayGradientClass}`} />
          )}
        </div>
      )}

      {/* 2. POSTER (IMAGE-HERO) LAYOUT */}
      {layout === 'poster' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {banner.image && (
            <img
              src={banner.image}
              alt={banner.title}
              referrerPolicy="no-referrer"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              className="w-full h-full transition-transform duration-300"
              style={{
                objectFit: fit,
                objectPosition: `${posX}% ${posY}%`,
                transform: `scale(${zoom / 100})`,
                opacity: opacity,
              }}
            />
          )}

          {/* Scrim when text is visible on poster */}
          {!hideText && (
            <div
              className={`absolute inset-0 ${
                isLightMode
                  ? 'bg-gradient-to-t from-white/90 via-white/40 to-transparent'
                  : 'bg-gradient-to-t from-black/85 via-black/35 to-transparent'
              }`}
            />
          )}
        </div>
      )}

      {/* 3. SPLIT LAYOUT (IMAGE ON RIGHT) */}
      {layout === 'split' && (
        <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 overflow-hidden pointer-events-none">
          {banner.image && (
            <div className="relative w-full h-full p-2.5">
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                className="w-full h-full rounded-2xl transition-transform duration-300 shadow-xs"
                style={{
                  objectFit: fit,
                  objectPosition: `${posX}% ${posY}%`,
                  transform: `scale(${zoom / 100})`,
                  opacity: opacity,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* TOP BAR: BADGE & ADMIN ACTIONS */}
      <div className="relative z-10 p-5 sm:p-6 pb-2 flex items-start justify-between">
        {banner.badge ? (
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
              isLightMode
                ? 'bg-emerald-600 text-white'
                : isNoColor
                ? 'bg-white/90 text-slate-900'
                : 'bg-white/25 text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{banner.badge}</span>
          </span>
        ) : (
          <div />
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl">
            {onEdit && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                title="Adjust image & banner settings"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                title="Delete banner"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* CENTER / MAIN CONTENT (unless hidden for poster flyers) */}
      <div
        className={`relative z-10 px-5 sm:px-6 py-2 ${
          layout === 'split' ? 'max-w-[60%] sm:max-w-[55%]' : ''
        }`}
      >
        {!hideText ? (
          <>
            <h3
              className={`text-lg sm:text-xl font-black leading-tight ${
                isLightMode
                  ? 'text-slate-900'
                  : 'text-white drop-shadow-md'
              }`}
            >
              {banner.title}
            </h3>
            {banner.subtitle && (
              <p
                className={`text-xs mt-1.5 line-clamp-2 ${
                  isLightMode
                    ? 'text-slate-600 font-medium'
                    : 'text-white/90 drop-shadow-xs'
                }`}
              >
                {banner.subtitle}
              </p>
            )}
          </>
        ) : (
          <div className="py-6" />
        )}
      </div>

      {/* FOOTER: CODE / CTA ACTION */}
      <div
        className={`relative z-10 p-5 sm:px-6 pt-2 flex items-center justify-between mt-auto ${
          layout === 'split' ? 'max-w-[60%] sm:max-w-[55%]' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          {banner.code ? (
            <span
              className={`inline-flex items-center space-x-1 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs ${
                isLightMode
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-900'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>{banner.code}</span>
            </span>
          ) : (
            <span
              className={`text-xs font-bold ${
                isLightMode ? 'text-emerald-700 underline' : 'text-white/90 underline'
              }`}
            >
              Order Now
            </span>
          )}

          {isNoColor && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                isLightMode
                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              No Color
            </span>
          )}
        </div>

        {!isAdmin && (
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
              isLightMode
                ? 'bg-slate-100 text-slate-900 border border-slate-200'
                : 'bg-white/20 text-white'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};
