// src/components/effects/VisualFilters.tsx
//
// Overlays visuels globaux :
// - noise animé (GIF)
// - effet TV avec lignes horizontales et léger glitch
// Important : pointer-events-none pour ne bloquer aucun clic.

import React from 'react';

// Tu peux régler facilement l'opacité des filtres ici
const NOISE_OPACITY = 0.02; // 0 = invisible, 1 = très fort
const TV_LINES_OPACITY = 1.00;

export const VisualFilters: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[999]">
      {/* Noise animé */}
      <div
        className="absolute inset-0"
        style={{
        backgroundImage: 'url(/filters/noise-overlay.gif)',
        // on ne stretch plus l'image sur tout l'écran
        backgroundSize: '256px 256px', // ou '128px 128px' si tu veux un grain encore plus fin
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
        opacity: NOISE_OPACITY,
        imageRendering: 'pixelated', // optionnel, pour garder un aspect net
    }}
      />
        {/* Grosse scanline épaisse descendante */}
        <div
        className="absolute inset-0"
        style={{
            pointerEvents: "none",
            background:
            "linear-gradient(to bottom, rgba(60, 53, 53, 0.01) 0%, #e8e8e84f 50%, rgba(9, 8, 8, 0) 100%)",
            height: "100px",
            animation: "tv-scan-thick-down 12s infinite",
            animationDelay: "2s",
            mixBlendMode: "soft-light",
        }}
        />

                <div
        className="absolute inset-0"
        style={{
            pointerEvents: "none",
            background:
            "linear-gradient(to bottom, rgba(60, 53, 53, 0.01) 0%, #d4d1d165 50%, rgba(9, 8, 8, 0) 100%)",
            height: "80px",
            animation: "tv-scan-thick-down 20s infinite",
            animationDelay: "1s",
            mixBlendMode: "soft-light",
        }}
        />
      {/* Effet TV / lignes horizontales */}
      <div
        className="absolute inset-0 tv-lines-overlay"
        style={{
          opacity: TV_LINES_OPACITY,
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)',
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  );
};
