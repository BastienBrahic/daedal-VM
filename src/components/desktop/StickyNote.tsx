// src/components/desktop/StickyNote.tsx
//
// Sticky note :
// - deux variantes : light / dark
// - gradient vertical
// - inner shadow + drop shadow
// - overlay de noise (multiply, 50%)
// - drag pour le déplacer sur le wallpaper
// - pas de bords arrondis

import React from 'react';
import { StickyNote as StickyNoteType } from '../../types/os';
import { useOs } from '../../context/OsContext';
import { useDrag } from '../../hooks/useDrag';

interface Props {
  note: StickyNoteType;
}

export const StickyNote: React.FC<Props> = ({ note }) => {
  const { moveStickyNote } = useOs();

  const { handleMouseDown } = useDrag({
    onDrag: (dx, dy) => {
      moveStickyNote(note.id, note.x + dx, note.y + dy);
    },
  });

  const isDark = note.variant === 'dark';

  const gradient = isDark
    ? 'linear-gradient(to bottom, #2C2A2A, #1F1C1C)'
    : 'linear-gradient(to bottom, #FFFFFF, #EDECEC)';

  const textColor = isDark ? '#F5F5F5' : '#393C41';
  const subtleTextColor = isDark ? 'rgba(245,245,245,0.7)' : '#6E7075';

  return (
    <div
      style={{
        top: note.y,
        left: note.x,
      }}
      className="absolute cursor-default select-none"
      data-cursor="grab"
      onMouseDown={handleMouseDown}
    >
      <div
  className="relative px-4 py-3"
  style={{
    width: "250px",
    height: "150px",
    backgroundImage: gradient,
    color: textColor,
    boxShadow:
      '0 -10px 64px rgba(0, 0, 0, 0.21) inset, 0 4px 8px rgba(0, 0, 0, 0.15)',
  }}
>

        {/* Overlay noise (à mettre dans /public/noise.png) */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-50"
          style={{
            backgroundImage: 'url(/noise.png)',
            backgroundSize: 'cover',
          }}
        />

        {/* Contenu réel par-dessus le noise */}
        <div className="relative">
          <div
            className="text-base font-medium mb-1 tracking-wide"
            style={{ color: subtleTextColor }}
          >
            {note.title}
          </div>
          <pre className="whitespace-pre-wrap text-[11px] leading-snug font-light">
            {note.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
