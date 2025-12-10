// src/components/layout/Desktop.tsx

import React from 'react';
import { useOs } from '../../context/OsContext';
import { DesktopIcon } from '../desktop/DesktopIcon';
import { StickyNote } from '../desktop/StickyNote';
import { useAuth } from '../../context/AuthContext';

export const Desktop: React.FC = () => {
  const { desktopIcons, stickyNotes } = useOs();
  const { logout } = useAuth(); // <-- CORRECT : hook appelé dans le composant

  return (
    <div
      className="
        w-full h-full
        relative
        overflow-hidden
        bg-cover bg-center
      "
      style={{
        backgroundImage: 'url(/wallpaper.png)',
      }}
    >
      {/* ==== DEBUG LOGOUT BUTTON ==== */}
      <button
        onClick={logout}
        className="
          absolute top-3 right-3 z-50
          px-2 py-1
          text-[11px]
          bg-os-surface-elevated
          border border-os-border
          rounded-sm
          hover:bg-os-hover
        "
        title="Retour à l'écran de login (debug)"
      >
        Logout
      </button>
      {/* ============================== */}

      {desktopIcons.map((icon) => (
        <DesktopIcon key={icon.id} icon={icon} />
      ))}

      {stickyNotes.map((note) => (
        <StickyNote key={note.id} note={note} />
      ))}
    </div>
  );
};
