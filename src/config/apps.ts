import type { AppId, DesktopIcon, StickyNote } from '../types/os';

export const APP_CONFIG: Record<
  AppId,
  {
    name: string;
    icon: string;
    defaultWindowSize: { width: number; height: number };
  }
> = {
  terminal: {
    name: 'Terminal',
    icon: 'terminal',
    defaultWindowSize: { width: 640, height: 420 },
  },
  notes: {
    name: 'Notes',
    icon: 'sticky_note_2',
    defaultWindowSize: { width: 520, height: 380 },
  },
  about: {
    name: 'Files',
    icon: 'files',
    defaultWindowSize: { width: 1080, height: 620 },
  },
};

export const DEFAULT_DESKTOP_ICONS: DesktopIcon[] = [
  {
    id: 'icon-terminal',
    type: 'app',
    appId: 'terminal',
    label: 'Terminal',
    x: 600,
    y: 600,
  },
  {
    id: 'icon-notes',
    type: 'app',
    appId: 'notes',
    label: 'Notes',
    x: 700,
    y: 650,
  },
  {
    id: 'icon-about',
    type: 'app',
    appId: 'about',
    label: 'Files',
    x: 800,
    y: 500,
  },
];

export const DEFAULT_STICKY_NOTES: StickyNote[] = [
    {
    id: 'note-1',
    title: 'DAY 86',
    content:
      'Run valgrind check on module_v2\nFix memory leak in /usr/bin/daemon\nUpdate firewall rules: iptables -L\nBackup database before Friday!',
    x: 1716,
    y: 96,
    variant: 'dark', // ou 'dark' si tu veux la version noire
  },


  {
    id: 'note-2',
    title: 'DAY 57',
    content:
      'Run valgrind check on module_v2\nFix memory leak in /usr/bin/daemon\nUpdate firewall rules: iptables -L\nBackup database before Friday!',
    x: 1708,
    y: 88,
    variant: 'light', // ou 'dark' si tu veux la version noire
  },

  {
    id: 'note-3',
    title: 'DAY 29',
    content:
      'Run valgrind check on module_v2\nFix memory leak in /usr/bin/daemon\nUpdate firewall rules: iptables -L\nBackup database before Friday!',
    x: 1700,
    y: 80,
    variant: 'light', // ou 'dark' si tu veux la version noire
  },
];

