import React, { useEffect } from 'react';
import { Header } from '../../components/Header';
import { WorkspaceIndicator } from '../../components/WorkspaceIndicator';
import { ProjectList } from '../../components/ProjectList';
import { ProjectDetail } from '../../components/ProjectDetail';
import { CreateProjectModal } from '../../components/CreateProjectModal';
import { CommandPalette } from '../../components/CommandPalette';
import { SettingsModal } from '../../components/SettingsModal';
import { Toast } from '../../components/Toast';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';

export const App: React.FC = () => {
  const { loadInitialData, selectedProject } = useWorkspaceStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-background text-foreground overflow-hidden font-sans antialiased">
      <Header />
      
      {!selectedProject && <WorkspaceIndicator />}

      <main className="flex-1 overflow-hidden flex flex-col">
        {selectedProject ? <ProjectDetail /> : <ProjectList />}
      </main>

      <CreateProjectModal />
      <CommandPalette />
      <SettingsModal />
      <Toast />
    </div>
  );
};

export default App;
