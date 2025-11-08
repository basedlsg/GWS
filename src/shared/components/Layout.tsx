import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { SettingsDialog } from './SettingsDialog';

export function Layout() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground aurora-bg">
      <Navigation onOpenSettings={() => setSettingsOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
