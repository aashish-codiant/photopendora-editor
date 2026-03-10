import React from 'react';
import { Type, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const EditorToolbar: React.FC = () => {
  const addTextElement = useEditorStore((state) => state.addTextElement);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);

  const handleAddOrnament = () => {
    // Placeholder for adding ornament
    console.log('Add ornament placeholder');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={addTextElement}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm cursor-pointer"
        title="Add Text"
      >
        <Type size={18} />
        Add Text
      </button>

      <button
        onClick={handleAddOrnament}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-200 transition-colors text-sm font-medium shadow-sm cursor-pointer"
        title="Add Ornament (Placeholder)"
      >
        <ImageIcon size={18} />
        Add Ornament
      </button>

      <button
        onClick={deleteSelected}
        disabled={!selectedElementId}
        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors text-sm font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete Selected Element"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
