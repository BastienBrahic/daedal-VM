export type AppId = 'terminal' | 'notes' | 'about';

export type WindowId = string;

export interface WindowState {
  id: WindowId;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export type DesktopItemType = 'app' | 'note';

export interface DesktopIcon {
  id: string;
  type: DesktopItemType;
  appId?: AppId;
  label: string;
  x: number;
  y: number;
}

export type StickyNoteVariant = 'light' | 'dark';

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  x: number;
  y: number;
  variant: StickyNoteVariant;
}

export interface OsWindow {
  id: string;
  appId: AppId;
  x: number;
  y: number;
  width: number;   // ← NEW
  height: number;  // ← NEW
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
}

