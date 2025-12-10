// src/context/OsContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  APP_CONFIG,
  DEFAULT_DESKTOP_ICONS,
  DEFAULT_STICKY_NOTES,
} from '../config/apps';
import type {
  AppId,
  DesktopIcon,
  StickyNote,
  WindowId,
  WindowState,
} from '../types/os';

interface OsContextValue {
  windows: WindowState[];
  desktopIcons: DesktopIcon[];
  stickyNotes: StickyNote[];
  isEndState: boolean; // <--- NEW

  openApp: (appId: AppId) => void;
  focusWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  toggleMinimize: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;

  moveWindow: (id: WindowId, x: number, y: number) => void;
  resizeWindow: (id: WindowId, width: number, height: number) => void;

  moveDesktopIcon: (id: string, x: number, y: number) => void;
  moveStickyNote: (id: string, x: number, y: number) => void;
  
  triggerEndState: () => void; // <--- NEW
}

const OsContext = createContext<OsContextValue | undefined>(undefined);

let windowIdCounter = 0;
const nextWindowId = (): WindowId => `w-${++windowIdCounter}`;

export const OsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>(DEFAULT_DESKTOP_ICONS);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>(DEFAULT_STICKY_NOTES);
  const [isEndState, setIsEndState] = useState(false); // <--- NEW

  const getNextZIndex = useCallback(
    () => (windows.length ? Math.max(...windows.map((w) => w.zIndex)) + 1 : 1),
    [windows],
  );

  const openApp = useCallback(
    (appId: AppId) => {
      setWindows((prev) => {
        const existing = prev.find(
          (w) => w.appId === appId && w.isOpen && !w.isMinimized,
        );
        if (existing) {
          return prev.map((w) =>
            w.id === existing.id
              ? { ...w, isFocused: true, zIndex: getNextZIndex() }
              : { ...w, isFocused: false },
          );
        }

        const config = APP_CONFIG[appId];

        const newWindow: WindowState = {
          id: nextWindowId(),
          appId,
          title: config.name,
          x: 200 + prev.length * 20,
          y: 120 + prev.length * 20,
          width: config.defaultWindowSize.width,
          height: config.defaultWindowSize.height,
          isOpen: true,
          isFocused: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: getNextZIndex(),
        };

        return [
          ...prev.map((w) => ({ ...w, isFocused: false })),
          newWindow,
        ];
      });
    },
    [getNextZIndex],
  );

  const focusWindow = useCallback(
    (id: WindowId) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, isFocused: true, zIndex: getNextZIndex() }
            : { ...w, isFocused: false },
        ),
      );
    },
    [getNextZIndex],
  );

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const toggleMinimize = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w,
      ),
    );
  }, []);

  const toggleMaximize = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  const moveWindow = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w)),
    );
  }, []);

  const resizeWindow = useCallback(
    (id: WindowId, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, width, height } : w,
        ),
      );
    },
    [],
  );

  const moveDesktopIcon = useCallback((id: string, x: number, y: number) => {
    setDesktopIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, x, y } : icon)),
    );
  }, []);

  const moveStickyNote = useCallback((id: string, x: number, y: number) => {
    setStickyNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, x, y } : note)),
    );
  }, []);

  // NEW TRIGGER
  const triggerEndState = useCallback(() => {
    setIsEndState(true);
  }, []);

  const value: OsContextValue = {
    windows,
    desktopIcons,
    stickyNotes,
    isEndState, // <--- Exported
    openApp,
    focusWindow,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    moveDesktopIcon,
    moveStickyNote,
    triggerEndState, // <--- Exported
  };

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
};

export const useOs = (): OsContextValue => {
  const ctx = useContext(OsContext);
  if (!ctx) {
    throw new Error('useOs must be used inside <OsProvider>');
  }
  return ctx;
};