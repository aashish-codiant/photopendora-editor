import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';
import { Bold, Italic, Type } from 'lucide-react';

const FONTS = [
    'Arial',
    'Times New Roman',
    'Montserrat',
    'Playfair Display',
    'Courier New',
    'Georgia'
];

const FontPanel: React.FC = () => {
    const { elements, selectedElementId, updateElement, template } = useEditorStore();
    const pushState = useHistoryStore(state => state.pushState);
    const selectedElement = elements.find(el => el.id === selectedElementId);

    if (!selectedElement || selectedElement.type !== 'text') {
        return (
            <div className="p-4 text-gray-400 text-sm flex flex-col items-center justify-center h-full">
                <Type className="h-8 w-8 mb-2 opacity-20" />
                <p>Select a text element to edit fonts</p>
            </div>
        );
    }

    const fontsToDisplay = template?.allowedFonts?.length ? template.allowedFonts : FONTS;

    const toggleStyle = (style: 'bold' | 'italic') => {
        let currentStyle = selectedElement.fontStyle || 'normal';
        let newStyle: "normal" | "bold" | "italic" | "italic bold" = 'normal';

        if (style === 'bold') {
            if (currentStyle === 'normal') newStyle = 'bold';
            else if (currentStyle === 'italic') newStyle = 'italic bold';
            else if (currentStyle === 'bold') newStyle = 'normal';
            else if (currentStyle === 'italic bold') newStyle = 'italic';
        } else {
            if (currentStyle === 'normal') newStyle = 'italic';
            else if (currentStyle === 'bold') newStyle = 'italic bold';
            else if (currentStyle === 'italic') newStyle = 'normal';
            else if (currentStyle === 'italic bold') newStyle = 'bold';
        }

        updateElement(selectedElement.id, { fontStyle: newStyle });
        pushState(elements);
    };

    return (
        <div className="p-4 space-y-6">
            <h3 className="text-sm font-semibold text-gray-900">Typography</h3>

            {/* Font Family */}
            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase font-medium">Font Family</label>
                <select
                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={selectedElement.fontFamily}
                    onChange={(e) => {
                        updateElement(selectedElement.id, { fontFamily: e.target.value });
                        pushState(elements);
                    }}
                >
                    {fontsToDisplay.map(font => (
                        <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                </select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase font-medium">Font Size</label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="8"
                        max="200"
                        value={selectedElement.fontSize}
                        onChange={(e) => {
                            updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) });
                        }}
                        onMouseUp={() => pushState(elements)}
                        className="flex-1"
                    />
                    <span className="text-sm font-medium w-8 text-right">{selectedElement.fontSize}</span>
                </div>
            </div>

            {/* Text Decoration */}
            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase font-medium">Style</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleStyle('bold')}
                        className={`p-2 rounded-md border flex-1 flex justify-center transition-colors ${
                            selectedElement.fontStyle?.includes('bold')
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => toggleStyle('italic')}
                        className={`p-2 rounded-md border flex-1 flex justify-center transition-colors ${
                            selectedElement.fontStyle?.includes('italic')
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FontPanel;
