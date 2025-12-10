// src/components/desktop/DesktopIcon.tsx
//
// Icône de bureau :
// - double-clic => ouvre l'app
// - drag => déplace l'icône sur le bureau

import React from 'react';
import { DesktopIcon as DesktopIconType } from '../../types/os';
import { useOs } from '../../context/OsContext';
import { APP_CONFIG } from '../../config/apps';
import { osColor } from '../../theme/tokens';
import { useDrag } from '../../hooks/useDrag';
import { sound } from '../../sound/sounds';

interface Props {
  icon: DesktopIconType;
}

export const DesktopIcon: React.FC<Props> = ({ icon }) => {
  const { openApp, moveDesktopIcon } = useOs();

  if (icon.type === 'app' && !icon.appId) {
    return null;
  }

  // Drag : on calcule la nouvelle position à partir de la position actuelle + delta
  const { handleMouseDown } = useDrag({
    onDrag: (dx, dy) => {
      // icon.x / icon.y sont la position de départ au moment du mousedown
      moveDesktopIcon(icon.id, icon.x + dx, icon.y + dy);
    },
  });

  const handleDoubleClick = () => {
    if (icon.type === 'app' && icon.appId) {
      sound.windowOpen.play();
      openApp(icon.appId);
    }
  };

  const appConfig =
    icon.type === 'app' && icon.appId ? APP_CONFIG[icon.appId] : null;

  return (
    <div
      style={{ top: icon.y, left: icon.x }}
      className={`
        absolute
        w-20 lg:w-24
        flex flex-col items-center gap-1
        ${osColor.text}
        cursor-default
      `}
      data-cursor="pointer"
      // Drag sur tout le bloc icône + label
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="
          w-12 h-12 lg:w-14 lg:h-14
          flex items-center justify-center
          bg-os-surface-elevated/80
          hover:bg-os-hover
          active:bg-os-pressed
          transition-colors transition-all
        "
      >
        {appConfig ? (
          <span className="material-symbols-outlined text-os-text text-xl lg:text-2xl">
            {appConfig.icon}
          </span>
        ) : (
          <span className="text-xs lg:text-sm">?</span>
        )}
      </div>
      <span className="text-[11px] lg:text-sm text-center text-os-text truncate max-w-[72px] lg:max-w-[88px]">
        {icon.label}
      </span>
    </div>
  );
};
