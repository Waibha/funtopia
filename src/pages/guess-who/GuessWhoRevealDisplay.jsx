import React, { useState, useEffect } from 'react';
import { resolveGuessWhoImageUrl, getImageCandidates } from '../../utilities/guessWhoImageResolver';

/**
 * ============================================================================
 * GUESS WHO? REVEAL DISPLAY COMPONENT
 * ============================================================================
 * 
 * Implements the 4 distinct progressive reveal types:
 * 1. CROP: Uses dataset crop coordinates (cropX, cropY, zoom).
 *    Stage 1 zooms tightly on the feature; Stage 4 pulls back to full view.
 * 2. PUZZLE_TILES: 3x3 cosmic grid for flags.
 *    Stage 1 reveals 2 tiles; Stage 2 reveals 4; Stage 3 reveals 7; Stage 4 reveals all 9.
 * 3. SILHOUETTE: Stark contrast silhouette for logos/symbols.
 *    Stage 1 = pure silhouette; Stage 4 = full color and lighting.
 * 4. BLUR: Progressive Gaussian blur for objects/miscellaneous.
 *    Stage 1 = heavy blur (24px); Stage 4 = crystal clear (0px).
 * 
 * SECURITY INVARIANT:
 * Strictly receives ONLY presentation parameters (imageUrl, revealType, revealMetadata, revealLevel).
 * Never accepts or renders question title, category, correct answers, or clues.
 */

// Deterministic tile reveal order for 3x3 grid (9 tiles total)
// Index order: [4 (center), 0 (top-left), 8 (bottom-right), 2 (top-right), 6 (bottom-left), 1, 7, 3, 5]
const TILE_REVEAL_ORDER = [4, 0, 8, 2, 6, 1, 7, 3, 5];

export default function GuessWhoRevealDisplay({
  imageUrl,
  revealType = 'crop',
  revealMetadata = null,
  revealLevel = 1,
  className = '',
}) {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Parse safe metadata with defensive fallbacks
  const metadata = revealMetadata && typeof revealMetadata === 'object' ? revealMetadata : {};
  const cropX = Number(metadata.cropX) || 50;
  const cropY = Number(metadata.cropY) || 50;
  const zoom = Number(metadata.zoom) || 2.2;

  // Build candidate fallback URLs
  const candidateUrls = getImageCandidates({ image_url: imageUrl });
  const activeUrl = candidateUrls[currentSrcIndex] || imageUrl;

  // Reset error state when imageUrl changes
  useEffect(() => {
    setCurrentSrcIndex(0);
    setHasError(false);
  }, [imageUrl]);

  const handleImageError = () => {
    if (currentSrcIndex < candidateUrls.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const level = Math.max(1, Math.min(4, Number(revealLevel) || 1));

  // 1. Calculate Crop Styles
  const getCropStyle = () => {
    if (level === 4) {
      return {
        transform: 'scale(1)',
        transformOrigin: '50% 50%',
        transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }

    let currentScale = 1;
    if (level === 1) {
      currentScale = zoom;
    } else if (level === 2) {
      currentScale = 1 + (zoom - 1) * 0.6;
    } else if (level === 3) {
      currentScale = 1 + (zoom - 1) * 0.25;
    }

    return {
      transform: `scale(${currentScale})`,
      transformOrigin: `${cropX}% ${cropY}%`,
      transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
    };
  };

  // 2. Calculate Silhouette Filter
  const getSilhouetteStyle = () => {
    switch (level) {
      case 1:
        // Pure stark black silhouette with cyan retro halo glow
        return 'brightness-0 contrast-200 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]';
      case 2:
        // Dark outline with faint interior depth
        return 'brightness-[0.25] contrast-[160%] grayscale-[60%]';
      case 3:
        // High visibility with mild desaturation
        return 'brightness-[0.75] contrast-[120%] grayscale-[25%]';
      case 4:
      default:
        // Full authentic colors
        return 'filter-none';
    }
  };

  // 3. Calculate Blur Filter
  const getBlurStyle = () => {
    switch (level) {
      case 1:
        return 'blur-[24px] contrast-[175%] brightness-90 saturate-150';
      case 2:
        return 'blur-[12px] contrast-[135%] brightness-95';
      case 3:
        return 'blur-[4px] contrast-[110%]';
      case 4:
      default:
        return 'filter-none';
    }
  };

  // 4. Calculate Tile Coverage for Puzzle Tiles (9 tiles)
  // Stage 1: 2 tiles open (7 covered)
  // Stage 2: 4 tiles open (5 covered)
  // Stage 3: 7 tiles open (2 covered)
  // Stage 4: 9 tiles open (0 covered)
  const getOpenTileCount = () => {
    switch (level) {
      case 1: return 2;
      case 2: return 4;
      case 3: return 7;
      case 4:
      default: return 9;
    }
  };

  const openCount = getOpenTileCount();
  const openTileSet = new Set(TILE_REVEAL_ORDER.slice(0, openCount));

  // Normalized reveal type
  const normalizedType = (revealType || 'crop').toLowerCase();

  return (
    <div
      className={`relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl overflow-hidden border-2 border-cyan-400/70 shadow-[0_0_50px_rgba(6,182,212,0.35)] bg-cosmic-950 flex items-center justify-center p-2 select-none ${className}`}
    >
      {/* Corner Brackets */}
      <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
      <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

      {/* Fallback Viewport for Image Network Errors */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-3xl animate-pulse">
            🛸
          </div>
          <p className="text-sm font-retro text-cyan-300">
            TRANSMISSION IN PROGRESS
          </p>
          <p className="text-xs font-mono text-slate-400 max-w-xs">
            Visual data feed buffered for presentation.
          </p>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-black/40">
          {/* Main Image Renderer */}
          <img
            src={activeUrl}
            alt="Deduction Subject"
            onError={handleImageError}
            style={normalizedType === 'crop' ? getCropStyle() : undefined}
            className={`w-full h-full object-contain pointer-events-none select-none transition-all duration-700 ${
              normalizedType === 'blur'
                ? getBlurStyle()
                : normalizedType === 'silhouette'
                ? getSilhouetteStyle()
                : ''
            }`}
          />

          {/* Puzzle Tiles Overlay Grid (Used for flags) */}
          {normalizedType === 'puzzle_tiles' && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-10 pointer-events-none">
              {Array.from({ length: 9 }).map((_, idx) => {
                const isOpen = openTileSet.has(idx);
                return (
                  <div
                    key={idx}
                    className={`border border-purple-500/30 transition-all duration-700 flex items-center justify-center ${
                      isOpen
                        ? 'opacity-0 scale-95 pointer-events-none'
                        : 'opacity-100 bg-[#0c0d24] shadow-inner backdrop-blur-md'
                    }`}
                  >
                    {!isOpen && (
                      <span className="text-[10px] font-mono text-purple-400/40 select-none">
                        #{idx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Holographic Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none opacity-40 mix-blend-overlay" />
        </div>
      )}
    </div>
  );
}
