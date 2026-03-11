import { Trash2, Undo, Redo, Download, Printer, Type } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';
import { exportDesign } from '../utils/exportDesign';
import { generateSVG } from '../utils/generateSVG';

export const EditorToolbar: React.FC = () => {
  const addTextElement = useEditorStore((state) => state.addTextElement);
  const deleteElement = useEditorStore((state) => state.deleteElement);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const elements = useEditorStore((state) => state.elements);
  const setElements = useEditorStore((state) => state.setElements);
  
  const { undo, redo, past, future } = useHistoryStore();

  const handleUndo = () => {
    const previous = undo(elements);
    if (previous) setElements(previous);
  };

  const handleRedo = () => {
    const next = redo(elements);
    if (next) setElements(next);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={addTextElement}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm cursor-pointer"
        title="Add Text"
      >
        <Type size={18} />
        Add Text
      </button>

      <div className="h-8 w-px bg-slate-200 mx-2" />

      {/* History */}
      <div className="flex gap-1">
        <button
          onClick={handleUndo}
          disabled={past.length === 0}
          className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} className="text-slate-600" />
        </button>
        <button
          onClick={handleRedo}
          disabled={future.length === 0}
          className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={18} className="text-slate-600" />
        </button>
      </div>

      <div className="h-8 w-px bg-slate-200 mx-2" />

      {/* Export */}
      <div className="flex gap-2">
        <button
          onClick={() => exportDesign(elements)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm cursor-pointer"
          title="Export Design JSON"
        >
          <Download size={18} />
          Export JSON
        </button>
        <button
          onClick={() => generateSVG(elements)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm cursor-pointer"
          title="Generate Production SVG"
        >
          <Printer size={18} />
          Export SVG
        </button>
      </div>

      {selectedElementId && (
        <>
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <button
            onClick={() => deleteElement(selectedElementId)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors text-sm font-medium shadow-sm cursor-pointer"
            title="Delete Selected Element"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}
    </div>
  );
};
