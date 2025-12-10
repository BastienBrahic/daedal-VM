// src/apps/about/AboutApp.tsx

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ABOUT_FILES, type AboutFile } from "./about/aboutFiles";
import { useOs } from "../context/OsContext";

// SVG importés en brut
import file00Svg from "./svg/file_00.svg?raw";
import file01Svg from "./svg/file_01.svg?raw";
import file02Svg from "./svg/file_02.svg?raw";
import file03Svg from "./svg/file_03.svg?raw";
import file04Svg from "./svg/file_04.svg?raw";
import file05Svg from "./svg/file_05.svg?raw";
import file06Svg from "./svg/file_06.svg?raw";

// Inversion F1F2F6 ↔ 393C41 dans un SVG donné si actif
function applySelectionColors(svg: string, active: boolean): string {
  if (!active) return svg;

  let s = svg
    .replace(/#F1F2F6/gi, "__LIGHT__")
    .replace(/#393C41/gi, "__DARK__");

  s = s.replace(/__LIGHT__/g, "#393C41").replace(/__DARK__/g, "#F1F2F6");
  return s;
}

// Configuration de l'ordre visuel des dossiers (inchangée)
const FILE_ROWS_CONFIG: {
  id: string;
  svg: string;
  selectable: boolean;
  aboutFile?: AboutFile;
}[] = [
  {
    id: ABOUT_FILES[5].id,
    svg: file06Svg,
    selectable: true,
    aboutFile: ABOUT_FILES[5],
  },
  {
    id: ABOUT_FILES[4].id,
    svg: file05Svg,
    selectable: true,
    aboutFile: ABOUT_FILES[4],
  },
  {
    id: ABOUT_FILES[3].id,
    svg: file04Svg,
    selectable: true,
    aboutFile: ABOUT_FILES[3],
  },
  {
    id: ABOUT_FILES[2].id,
    svg: file03Svg,
    selectable: true,
    aboutFile: ABOUT_FILES[2],
  },
  {
    id: ABOUT_FILES[1].id,
    svg: file02Svg,
    selectable: true,
    aboutFile: ABOUT_FILES[1],
  },
  {
    id: ABOUT_FILES[0].id,
    svg: file01Svg,
    selectable: true,
    aboutFile: ABOUT_FILES[0],
  },
  {
    id: "file_00",
    svg: file00Svg,
    selectable: false,
  },
];

export const AboutApp: React.FC = () => {
  const { triggerEndState } = useOs();

  // Par défaut : on sélectionne le dernier ABOUT_FILE
  const [selectedId, setSelectedId] = useState<string>(
    ABOUT_FILES[ABOUT_FILES.length - 1]?.id
  );

  const selectedFile: AboutFile | undefined = useMemo(
    () => ABOUT_FILES.find((f) => f.id === selectedId),
    [selectedId]
  );

  // Fonction appelée quand une vidéo se termine
  const handleVideoEnded = () => {
    if (!selectedFile) return;

    // ✅ NOUVELLE LOGIQUE : On vérifie si ce fichier spécifique déclenche la fin
    if (selectedFile.triggersEndGame) {
       triggerEndState();
    }
  };

  return (
    <div className="h-full w-full flex bg-os-surface">
      {/* SIDEBAR : pile des SVG */}
      <aside
        className="
          w-[38%]
          max-w-[320px]
          min-w-[220px]
          border-r border-os-border
          relative
          px-4 pt-4 pb-6
          overflow-hidden
        "
      >
        <div className="absolute inset-x-0 bottom-0 h-4 bg-os-bg-alt border-t border-os-border" />

        <div className="relative h-full flex flex-col">
          {FILE_ROWS_CONFIG.map((row, index) => {
            const isActive = row.id === selectedId;
            const svgMarkup = applySelectionColors(row.svg, isActive);

            return (
              <motion.button
                key={row.id}
                type="button"
                className={`relative w-full text-left ${
                  row.selectable ? "cursor-pointer" : "cursor-default"
                }`}
                style={{
                  marginTop: index === 0 ? 0 : "-7%",
                  zIndex: index + 1,
                }}
                onClick={() => {
                  if (row.selectable && row.aboutFile) {
                    setSelectedId(row.aboutFile.id);
                  }
                }}
                data-cursor={row.selectable ? "pointer" : "default"}
                whileHover={
                  row.selectable
                    ? {
                        y: -3,
                      }
                    : undefined
                }
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
              >
                <div
                  className="about-file-svg w-full"
                  dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />
              </motion.button>
            );
          })}
        </div>
      </aside>

      {/* PANNEAU DROITE */}
      <section className="flex-1 flex flex-col px-4 py-3 gap-3">
        <nav className="text-[11px] text-os-text-muted">
          <span>Files</span>
          {selectedFile && (
            <>
              <span className="mx-1">/</span>
              <span>{selectedFile.groupLetter}</span>
              <span className="mx-1">/</span>
              <span className="text-os-text">{selectedFile.title}</span>
            </>
          )}
        </nav>

        <div
          className="
            flex-1
            border border-os-border
            bg-os-surface-elevated
            px-3 py-3
            flex flex-col gap-3
          "
        >
          {selectedFile ? (
            <>
              <header className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-os-text-muted">
                    #{selectedFile.number.toString().padStart(3, "0")}
                  </span>
                  <span className="text-xs font-medium">
                    {selectedFile.title}
                  </span>
                </div>
                <div className="text-[10px] text-os-text-muted">
                  {selectedFile.groupLetter} · {selectedFile.code}
                </div>
              </header>

              {/* ZONE CONTENU (Vidéo ou Erreur) */}
              <div className="flex-1 border border-dashed border-os-border bg-os-bg-alt flex items-center justify-center overflow-hidden relative">
                
                {/* ✅ VÉRIFICATION ACCESSIBILITÉ */}
                {selectedFile.isAccessible ? (
                  // CAS : Fichier accessible
                  selectedFile.videoSrc ? (
                    <video
                      src={selectedFile.videoSrc}
                      controls
                      autoPlay // Optionnel : lance la vidéo quand on clique sur le dossier
                      className="w-full h-full object-contain"
                      onEnded={handleVideoEnded}
                    />
                  ) : (
                    <p className="text-[11px] text-os-text-muted">
                      No video source found.
                    </p>
                  )
                ) : (
                  // ❌ CAS : Accès refusé
                  <div className="flex flex-col items-center gap-2 text-os-color-error">
                    <svg 
                      width="32" height="32" viewBox="0 0 24 24" fill="none" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="opacity-80"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M8 11h8" />
                      <path d="M8 11v4" />
                      <path d="M12 11v4" />
                      <path d="M16 11v4" />
                    </svg>
                    <span className="text-sm font-bold tracking-widest uppercase">
                      Access Denied
                    </span>
                    <span className="text-[10px] text-os-text-muted">
                      Insufficient clearance level
                    </span>
                  </div>
                )}

              </div>

              <div className="text-[11px] text-os-text-muted">
                {selectedFile.isAccessible 
                  ? "Playing archived footage from local database." 
                  : "Encrypted content. Decryption key required."}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[11px] text-os-text-muted">
              Select a file on the left.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};