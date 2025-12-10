// src/hooks/useResize.ts
//
// Petit hook générique pour gérer un drag de resize sur un bord.

import { useCallback } from "react";

interface UseResizeParams {
  onResize: (dx: number, dy: number) => void;
}

export function useResize({ onResize }: UseResizeParams) {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;

      function onMove(moveEvent: MouseEvent) {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        onResize(dx, dy);
      }

      function onUp() {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [onResize]
  );

  return { handleMouseDown };
}
