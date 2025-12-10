// src/components/layout/Dock.tsx
//
// Bottom bar OS :
// - à gauche : texte custom (tu peux changer la string)
// - au centre : icônes des apps présentes sur le bureau
// - à droite : date du jour en anglais (Monday, 19 April 2025)

import React from 'react';
import { useOs } from '../../context/OsContext';
import { osColor } from '../../theme/tokens';
import { APP_CONFIG } from '../../config/apps';
import { sound } from '../../sound/sounds';

export const Dock: React.FC = () => {
  const { openApp, desktopIcons } = useOs();

  // On récupère les apps présentes sur le bureau
  const desktopAppIcons = desktopIcons.filter(
    (icon) => icon.type === 'app' && icon.appId,
  );

  // Date du jour formatée : "Monday, 19 April 2025"
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <footer
      className={`
        fixed bottom-0 left-0 right-0 h-10
        ${osColor.surface}
        border-t border-os-border
        flex items-center justify-between
        px-4 text-xs
        z-dock
      `}
    >
      {/* Gauche : texte custom (tu peux modifier librement) */}
      <div className="flex items-center gap-1 text-os-text">
        <span className="font-semibold">VM :</span>
        <span>Nom du perso</span>
        <span className="mx-2">|</span>
      </div>

      {/* Centre : icônes des apps présentes sur le bureau */}
      <div className="flex items-center gap-2">
        {desktopAppIcons.map((icon) => {
          if (!icon.appId) return null;
          const app = APP_CONFIG[icon.appId];

          return (
            <button
              key={icon.id}
              type="button"
              onClick={() => {
              sound.windowOpen.play();
              openApp(icon.appId!);
              }}
              data-cursor="pointer"
              className="
                w-8 h-8
                flex items-center justify-center
                bg-os-bg-alt
                border border-os-border
                hover:bg-os-hover active:bg-os-pressed
                transition-colors
              "
            >
              <span className="material-symbols-outlined text-os-text text-xl w-24">
                {app.icon}
              </span>
            </button>
          );
        })}
      </div>

      {/* Droite : date du jour */}
      <div className="flex items-center gap-2 text-os-text-muted">
        <span className="mx-2 hidden sm:inline">|</span>
        <span>{formattedDate}</span>
      </div>
    </footer>
  );
};
