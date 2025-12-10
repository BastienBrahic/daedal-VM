import React from 'react';
import { useOs } from '../../context/OsContext';
import { AppWindow } from './AppWindow';
import { TerminalApp } from '../../apps/TerminalApp';
import { NotesApp } from '../../apps/NotesApp';
import { AboutApp } from '../../apps/AboutApp';
import type { AppId } from '../../types/os';

const renderAppContent = (appId: AppId) => {
  switch (appId) {
    case 'terminal':
      return <TerminalApp />;
    case 'notes':
      return <NotesApp />;
    case 'about':
      return <AboutApp />;
    default:
      return null;
  }
};

export const AppWindowManager: React.FC = () => {
  const { windows } = useOs();

  return (
    <>
      {windows.map((w) =>
        w.isOpen ? (
          <AppWindow key={w.id} window={w}>
            {renderAppContent(w.appId)}
          </AppWindow>
        ) : null,
      )}
    </>
  );
};
