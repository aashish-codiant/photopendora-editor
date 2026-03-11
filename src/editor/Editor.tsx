import React from 'react';
import { CanvasStage } from './components/CanvasStage';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import AssetLibrary from './components/AssetLibrary';
import FontPanel from './components/FontPanel';
import { Layers, Library, Settings2, Type } from 'lucide-react';

export const Editor: React.FC = () => {
  const [leftTab, setLeftTab] = React.useState<'layers' | 'assets'>('layers');
  const [rightTab, setRightTab] = React.useState<'properties' | 'fonts'>('properties');

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans">
      {/* Top Toolbar */}
      <header className="h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Settings2 className="text-white h-5 w-5" />
          </div>
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">PhotoPandora <span className="text-indigo-600 font-medium text-sm ml-2 px-2 py-0.5 bg-indigo-50 rounded-full border border-indigo-100">Editor v2</span></h1>
        </div>
        <EditorToolbar />
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation & Primary Panels */}
        <aside className="w-16 border-r bg-slate-900 flex flex-col items-center py-6 gap-6 shrink-0 z-10 shadow-lg">
          <button 
            onClick={() => setLeftTab('layers')}
            className={`p-3 rounded-xl transition-all ${leftTab === 'layers' ? 'bg-indigo-600 text-white shadow-indigo-500/50 shadow-lg scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title="Layers"
          >
            <Layers size={22} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setLeftTab('assets')}
            className={`p-3 rounded-xl transition-all ${leftTab === 'assets' ? 'bg-indigo-600 text-white shadow-indigo-500/50 shadow-lg scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title="Asset Library"
          >
            <Library size={22} strokeWidth={2.5} />
          </button>
        </aside>

        {/* Left Secondary Panel */}
        <aside className="w-72 border-r bg-white hidden md:block shrink-0 overflow-y-auto shadow-sm">
          {leftTab === 'layers' ? <LayersPanel /> : <AssetLibrary />}
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-100 relative group">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />
          <CanvasStage />
        </div>

        {/* Right Sidebar - Properties & Fonts */}
        <aside className="w-80 border-l bg-white hidden lg:flex flex-col shrink-0 shadow-sm">
          <div className="flex border-b">
            <button 
              onClick={() => setRightTab('properties')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${rightTab === 'properties' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <Settings2 size={14} />
                Properties
              </div>
            </button>
            <button 
              onClick={() => setRightTab('fonts')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${rightTab === 'fonts' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <div className="flex items-center justify-center gap-2">
                <Type size={14} />
                Typography
              </div>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightTab === 'properties' ? <PropertiesPanel /> : <FontPanel />}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Editor;
