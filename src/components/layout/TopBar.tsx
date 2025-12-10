// src/components/layout/TopBar.tsx
//
// Top bar :
// - gauche : logo + "Proxmox Virtual Environment"
// - droite : heure en temps réel + fausse batterie à 6 blocs

import React, { useEffect, useState } from 'react';
import { osColor } from '../../theme/tokens';

// ----- Config batterie -----
// Nombre de "steps" = 6 blocs * 2 (plein + moitié) = 12
// Toutes les BATTERY_TICK_MS, on perd 1 step.
// Tu peux ajuster facilement la vitesse ici.
//
// Pour respecter ton idée "toutes les 5min", mets :
// const BATTERY_TICK_MS = 5 * 60 * 1000;
const BATTERY_TICK_MS = 30_000; // 30 sec pour tester facilement

const TOTAL_BATTERY_STEPS = 12;

// ----- Logo composant -----

const VmLogo: React.FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 0C2.20435 0 1.44129 0.316071 0.87868 0.87868C0.316071 1.44129 0 2.20435 0 3V13.5C0 14.2956 0.316071 15.0587 0.87868 15.6213C1.44129 16.1839 2.20435 16.5 3 16.5H13.5C14.2956 16.5 15.0587 16.1839 15.6213 15.6213C16.1839 15.0587 16.5 14.2956 16.5 13.5V3C16.5 2.20435 16.1839 1.44129 15.6213 0.87868C15.0587 0.316071 14.2956 0 13.5 0H3ZM8.25 7.4325C8.21379 7.43259 8.17794 7.4254 8.14457 7.41136C8.1112 7.39732 8.08099 7.3767 8.05575 7.35075L4.48725 3.73875C4.45941 3.71071 4.43806 3.6769 4.42471 3.63971C4.41136 3.60252 4.40634 3.56285 4.41 3.5235C4.4205 3.3945 4.503 3.3345 4.59375 3.279C4.8353 3.13005 5.10067 3.02375 5.37825 2.96475C5.886 2.85825 6.5595 2.90475 7.16175 3.50625L8.25 4.6155L9.33825 3.50625C9.9405 2.904 10.6132 2.85825 11.1225 2.96475C11.3998 3.02383 11.6649 3.13013 11.9062 3.279C11.9963 3.3345 12.0788 3.3945 12.09 3.5235C12.0936 3.5629 12.0884 3.60261 12.0749 3.6398C12.0615 3.677 12.04 3.71078 12.012 3.73875L8.445 7.35C8.41969 7.37582 8.38946 7.39629 8.35609 7.41021C8.32272 7.42412 8.2869 7.43119 8.25075 7.431L8.25 7.4325ZM8.25 9.06825C8.21385 9.06806 8.17803 9.07513 8.14466 9.08904C8.11129 9.10296 8.08106 9.12343 8.05575 9.14925L4.48725 12.7612C4.45941 12.7893 4.43806 12.8231 4.42471 12.8603C4.41136 12.8975 4.40634 12.9372 4.41 12.9765C4.4205 13.1055 4.503 13.1655 4.59375 13.221C4.8353 13.37 5.10067 13.4763 5.37825 13.5353C5.886 13.6418 6.5595 13.5953 7.16175 12.9938L8.25 11.8845L9.33825 12.9945C9.9405 13.596 10.6132 13.6418 11.1225 13.5353C11.3998 13.4762 11.6649 13.3699 11.9062 13.221C11.9963 13.1655 12.0788 13.1055 12.09 12.9765C12.0936 12.9371 12.0884 12.8974 12.0749 12.8602C12.0615 12.823 12.04 12.7892 12.012 12.7612L8.445 9.15C8.41969 9.12418 8.38946 9.10371 8.35609 9.08979C8.32272 9.07588 8.2869 9.06881 8.25075 9.069L8.25 9.06825ZM14.0648 4.9215C13.8188 4.76794 13.5492 4.65618 13.2667 4.59075C12.753 4.473 12.0682 4.50225 11.4697 5.1015L8.5995 8.06175C8.54958 8.11229 8.52158 8.18046 8.52158 8.2515C8.52158 8.32254 8.54958 8.39071 8.5995 8.44125L11.4697 11.4015C12.0682 12.0007 12.753 12.03 13.2667 11.913C13.5492 11.8473 13.8189 11.7353 14.0648 11.5815C14.1547 11.5245 14.2357 11.4578 14.2485 11.3438C14.253 11.3058 14.2494 11.2673 14.2378 11.2308C14.2263 11.1944 14.2072 11.1608 14.1818 11.1322L11.6407 8.25225L14.1825 5.37C14.2335 5.31225 14.2575 5.235 14.2493 5.15925C14.2365 5.0445 14.1562 4.97775 14.0655 4.92075L14.0648 4.9215ZM2.43525 4.9215C2.68139 4.76786 2.9513 4.6561 3.234 4.59075C3.747 4.473 4.43175 4.50225 5.03025 5.1015L7.9005 8.06175C7.95042 8.11229 7.97842 8.18046 7.97842 8.2515C7.97842 8.32254 7.95042 8.39071 7.9005 8.44125L5.03025 11.4015C4.43175 12.0007 3.747 12.03 3.23325 11.913C2.95076 11.8473 2.68111 11.7353 2.43525 11.5815C2.34525 11.5245 2.26425 11.4578 2.2515 11.3438C2.24702 11.3058 2.25065 11.2673 2.26216 11.2308C2.27366 11.1944 2.29278 11.1608 2.31825 11.1322L4.85925 8.25225L2.3175 5.37C2.29213 5.34157 2.27307 5.30809 2.26157 5.27177C2.25006 5.23545 2.24638 5.1971 2.25075 5.15925C2.2635 5.0445 2.34375 4.97775 2.4345 4.92075L2.43525 4.9215Z"
        fill="#393C41"
      />
    </svg>
  );
};

// ----- Batterie -----

const BatteryIndicator: React.FC = () => {
  const [level, setLevel] = useState<number>(TOTAL_BATTERY_STEPS);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel((prev) => {
        if (prev <= 0) {
          // Quand on atteint 0, on repart plein (boucle infinie)
          return TOTAL_BATTERY_STEPS;
        }
        return prev - 1;
      });
    }, BATTERY_TICK_MS);

    return () => clearInterval(interval);
  }, []);

  // 6 blocs, chacun peut être : vide, moitié, plein
  const segments = Array.from({ length: 6 }, (_, index) => {
    const base = index * 2;
    const remaining = Math.max(0, Math.min(2, level - base)); // 0, 1 ou 2

    let innerWidthClass = 'w-0'; // vide
    if (remaining === 1) innerWidthClass = 'w-1/2';
    if (remaining === 2) innerWidthClass = 'w-full';

    return (
      <div
        key={index}
        className="
          w-4 h-4
          border border-os-border
          bg-os-bg-alt
          rounded-[1px]
          p-[1.5px]
          flex items-center
        "
      >
        <div
          className={`
            h-full
            ${innerWidthClass}
            bg-os-text
            rounded-[1px]
            transition-all duration-300
            text-os-text
          `}
        />
      </div>
    );
  });

  return <div className="flex items-center gap-[2px] ml-2">{segments}</div>;
};

// ----- TopBar principale -----

export const TopBar: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(':', ' : '); // style "15 : 33"

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 h-8
        z-topbar
        ${osColor.surfaceElevated}
        flex items-center justify-between
        shadow-2xs
        px-3
      `}
    >
      {/* Gauche : logo + nom */}
      <div className="flex items-center gap-2 text-os-text-muted">
        <VmLogo />
        <span className="text-[11px] leading-none">
          Proxmox Virtual Environment
        </span>
      </div>

      {/* Droite : heure + batterie */}
      <div className="flex items-center gap-2 text-os-text-muted text-[11px]">
        <span className="border-r border-os-border pr-2">{timeString}</span>
        <BatteryIndicator />
      </div>
    </header>
  );
};
