// src/App.tsx
import React, { useEffect } from "react";
import { OsProvider, useOs } from "./context/OsContext";
import { Desktop } from "./components/layout/Desktop";
import { TopBar } from "./components/layout/TopBar";
import { Dock } from "./components/layout/Dock";
import { AppWindowManager } from "./components/window/AppWindowManager";
import { VisualFilters } from "./components/effects/VisualFilters";
import { EndScreen } from "./components/layout/EndScreen";
import { sound } from "./sound/sounds";
import { Howler } from "howler"; 
import { motion, AnimatePresence } from "framer-motion";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginScreen } from "./components/auth/LoginScreen";

/* ANIMATION VARIANTS */
const crtVariants = {
  initial: { 
    scaleX: 1, 
    scaleY: 1, 
    opacity: 1, 
    filter: "brightness(1)" 
  },
  exit: {
    scaleX: [1, 1, 1, 0],
    scaleY: [1, 0.005, 0.005, 0.005],
    opacity: [1, 1, 1, 0],
    filter: ["brightness(1)", "brightness(2)", "brightness(5)", "brightness(0)"],
    transition: { 
      duration: 0.5, 
      times: [0, 0.4, 0.9, 1],
      ease: "easeInOut" 
    }
  }
};

function OsShell() {
  const { isEndState } = useOs();

  // GESTION AUDIO DE FIN
  useEffect(() => {
    if (isEndState) {
      // Coupe tout le reste (Background Loop, bruits de fond, etc.)
      Howler.stop();

      // Lance l'outro
      if (!sound.outro.playing()) {
         sound.outro.play();
         sound.outro.fade(0, 0.6, 4000);
      }
    }
  }, [isEndState]);

  return (
    <div className="os-shell h-full w-full relative overflow-hidden bg-os-bg text-os-text font-ubuntu">
      <AnimatePresence mode="wait">
        {!isEndState ? (
          <motion.div
            key="os-desktop"
            className="w-full h-full absolute inset-0 z-0"
            variants={crtVariants}
            initial="initial"
            exit="exit"
          >
            <TopBar />
            <Desktop />
            <Dock />
            <AppWindowManager />
          </motion.div>
        ) : (
          <motion.div
            key="end-screen"
            className="w-full h-full absolute inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <EndScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <VisualFilters />
    </div>
  );
}

function AuthGate() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    // SÉCURITÉ AUDIO : Au montage de AuthGate, on coupe l'outro si elle traîne
    try {
        if (sound.outro && sound.outro.playing()) {
            sound.outro.stop();
        }
    } catch {}

    // On lance la musique de fond ambiance (background-loop)
    try {
        if (!sound.backgroundLoop.playing()) {
            sound.backgroundLoop.play();
        }
    } catch {}

  }, []);

  if (!isAdmin) {
    return <LoginScreen />;
  }

  return (
    <OsProvider>
       <OsShell />
    </OsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
        {/* Hidden preloader video */}
        <video
          id="preload-loading-video"
          src="/loading.mp4"
          preload="auto"
          muted
          loop
          style={{ display: "none" }}
        />
        <AuthGate />
    </AuthProvider>
  );
}