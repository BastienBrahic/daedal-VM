// src/components/window/AppWindow.tsx

import React, {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { WindowState } from '../../types/os';
import { useOs } from '../../context/OsContext';
import { osColor } from '../../theme/tokens';
import { WindowControls } from './WindowControls';
import { useDrag } from '../../hooks/useDrag';

interface Props {
  window: WindowState;
  children: React.ReactNode;
}

const MIN_WIDTH = 360;
const MIN_HEIGHT = 260;

export const AppWindow: React.FC<Props> = ({ window: win, children }) => {
  const { focusWindow, moveWindow, resizeWindow } = useOs();

  const handleSectionMouseDown = () => {
    focusWindow(win.id);
  };

  const { handleMouseDown: handleDragMouseDown } = useDrag({
    onDrag: (dx, dy) => {
      if (win.isMaximized) return;
      moveWindow(win.id, win.x + dx, win.y + dy);
    },
  });

  const startResize = (
    direction: 'right' | 'bottom' | 'corner',
    e: ReactMouseEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = win.width;
    const startHeight = win.height;

    function onMouseMove(ev: MouseEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === 'right' || direction === 'corner') {
        newWidth = Math.max(MIN_WIDTH, startWidth + dx);
      }
      if (direction === 'bottom' || direction === 'corner') {
        newHeight = Math.max(MIN_HEIGHT, startHeight + dy);
      }

      resizeWindow(win.id, newWidth, newHeight);
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const baseStyle: CSSProperties = win.isMaximized
    ? {
        top: 32,
        left: 0,
        right: 0,
        bottom: 40,
        width: 'auto',
        height: 'auto',
      }
    : {
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
      };

  const style: CSSProperties = {
    ...baseStyle,
    zIndex: win.zIndex,
  };

  if (win.isMinimized) {
    return null;
  }

  return (
    <section
      style={style}
      className={`
        fixed
        ${osColor.surface}
        border border-os-border
        rounded-[1px] shadow-window
        overflow-hidden
        flex flex-col
        ${win.isFocused ? 'outline outline-1 outline-[#393C41]' : ''}
      `}
      onMouseDown={handleSectionMouseDown}
    >
      {/* Barre de titre (zone de drag) */}
      <header
        className="
          h-8 flex items-center justify-between
          px-2 gap-2
          bg-os-surface-elevated
          border-b border-os-border
        "
        data-cursor="grab"
        onMouseDown={(e: ReactMouseEvent<HTMLElement>) => {
          e.stopPropagation();
          handleSectionMouseDown();
          handleDragMouseDown(e);
        }}
      >
        {/* ⬇️ Plus de pastilles, juste le nom de l'app */}
        <div className="flex items-center">
          <span className="text-xs font-medium truncate max-w-[180px]">
            {win.title}
          </span>
        </div>

        <WindowControls window={win} />
      </header>

      {/* Contenu de l'app */}
      <div className="flex-1 min-h-0 overflow-auto text-xs">
        {children}
      </div>

      {/* HANDLE DROITE */}
      <div
        className="absolute right-0 top-0 h-full w-1"
        data-cursor="move"
        onMouseDown={(e) => startResize('right', e)}
      />

      {/* HANDLE BAS */}
      <div
        className="absolute left-0 bottom-0 w-full h-1"
        data-cursor="move"
        onMouseDown={(e) => startResize('bottom', e)}
      />

      {/* HANDLE COIN BAS-DROITE */}
      <div
        className="absolute right-0 bottom-0 w-3 h-3"
        data-cursor="move"
        onMouseDown={(e) => startResize('corner', e)}
      />
    </section>
  );
};
