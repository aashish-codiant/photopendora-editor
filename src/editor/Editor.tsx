import React from 'react';
import { CanvasStage } from './components/CanvasStage';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';

export const Editor: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-50">
      {/* Top Toolbar */}
      <header className="h-16 border-b bg-white flex items-center px-4 justify-between shadow-sm shrink-0">
        <h1 className="font-semibold text-xl text-slate-800">Personalization Editor</h1>
        <EditorToolbar />
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Tools */}
        <aside className="w-64 border-r bg-white hidden md:block shrink-0">
          <div className="p-4">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Layers (Soon)</h2>
            <div className="text-sm text-slate-500 text-center p-4 border border-dashed border-slate-300 rounded-md bg-slate-50">
              Layers panel placeholder
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-100 relative">
          <CanvasStage />
        </div>

        {/* Right Sidebar Properties */}
        <aside className="w-72 border-l bg-white hidden lg:block shrink-0 overflow-y-auto">
          <PropertiesPanel />
        </aside>
      </main>
    </div>
  );
};

export default Editor;
