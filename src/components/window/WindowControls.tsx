import React from 'react';
import { WindowState } from '../../types/os';
import { useOs } from '../../context/OsContext';
import { sound } from '../../sound/sounds';

interface Props {
  window: WindowState;
}

export const WindowControls: React.FC<Props> = ({ window }) => {
  const { closeWindow, toggleMinimize, toggleMaximize } = useOs();

  return (
    <div className="flex items-center gap-1 text-os-text-muted">
      <button
        type="button"
        className="hover:bg-os-hover rounded-md px-1 py-0.5 text-[10px]"
        onClick={() => toggleMinimize(window.id)}
      >
        _
      </button>
      <button
        type="button"
        className="hover:bg-os-hover rounded-md px-1 py-0.5 text-[10px]"
        onClick={() => toggleMaximize(window.id)}
      >
        ☐
      </button>
    <button
      type="button"
      className="hover:bg-os-hover rounded-md px-1 py-0.5 text-[10px]"
      onClick={() => {
        sound.windowClose.play();       // 🔊 joue le son
        closeWindow(window.id);         // ❌ ferme la fenêtre
      }}
    >
        ✕
      </button>
    </div>
  );
};
