// src/hooks/useDrag.ts
//
// Hook générique pour gérer le drag à la souris.
// Il ne stocke pas la position lui-même : il calcule un delta (dx, dy)
// depuis le point de départ, et laisse le composant décider quoi en faire.

import React, { useCallback, useRef } from 'react';

interface UseDragOptions {
  // Appelé à chaque mouvement pendant le drag
  onDrag: (dx: number, dy: number) => void;
  // Optionnel : appelé quand le drag se termine
  onDragEnd?: () => void;
}

export const useDrag = (options: UseDragOptions) => {
  const { onDrag, onDragEnd } = options;

  const isDraggingRef = useRef(false);
  const startRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // On ne gère que le bouton gauche
      if (e.button !== 0) return;

      e.preventDefault();

      isDraggingRef.current = true;
      startRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const dx = event.clientX - startRef.current.x;
        const dy = event.clientY - startRef.current.y;

        // On délègue le calcul de nouvelle position au composant
        onDrag(dx, dy);
      };

      const handleMouseUp = () => {
        if (!isDraggingRef.current) return;

        isDraggingRef.current = false;
        if (onDragEnd) {
          onDragEnd();
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onDrag, onDragEnd],
  );

  return { handleMouseDown };
};
