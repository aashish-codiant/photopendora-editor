import React from 'react';
import { Bold, Italic, Type, Check } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';
import { AVAILABLE_FONTS } from '../constants/fonts';
import { loadFont } from '../utils/fontLoader';
import { Loader2 } from 'lucide-react';

const FontPanel: React.FC = () => {
    const { elements, selectedElementId, updateElement, template } = useEditorStore();
    const pushState = useHistoryStore(state => state.pushState);
    const selectedElement = elements.find(el => el.id === selectedElementId);
    const [loadingFont, setLoadingFont] = React.useState<string | null>(null);

    if (!selectedElement || selectedElement.type !== 'text') {
        return (
            <div className="p-8 text-slate-400 text-sm flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Type className="h-8 w-8 opacity-20" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">No Text Selected</h3>
                <p className="px-4 text-slate-500">Select a text element from the canvas to customize its typography.</p>
            </div>
        );
    }

    const filteredFonts = AVAILABLE_FONTS.filter(f => !template?.allowedFonts?.length || template.allowedFonts.includes(f.name));

    const toggleStyle = (style: 'bold' | 'italic' | 'underline') => {
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
        <div className="p-5 space-y-8">
            {/* Font Style Controls */}
            <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Style & Size</h3>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => toggleStyle('bold')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${selectedElement.fontStyle?.includes('bold')
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'
                            }`}
                    >
                        <Bold size={16} strokeWidth={2.5} />
                        <span className="text-xs font-semibold">Bold</span>
                    </button>
                    <button
                        onClick={() => toggleStyle('italic')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${selectedElement.fontStyle?.includes('italic')
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'
                            }`}
                    >
                        <Italic size={16} strokeWidth={2.5} />
                        <span className="text-xs font-semibold">Italic</span>
                    </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Font Size</label>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{selectedElement.fontSize}px</span>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="200"
                        value={selectedElement.fontSize}
                        onChange={(e) => {
                            updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) });
                        }}
                        onMouseUp={() => pushState(elements)}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />

                    <div className="pt-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Letter Spacing</label>
                            <span className="text-xs font-bold text-indigo-600">{selectedElement.letterSpacing || 0}px</span>
                        </div>
                        <input
                            type="range"
                            min="-5"
                            max="50"
                            step="0.5"
                            value={selectedElement.letterSpacing || 0}
                            onChange={(e) => {
                                updateElement(selectedElement.id, { letterSpacing: parseFloat(e.target.value) });
                            }}
                            onMouseUp={() => pushState(elements)}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Line Height</label>
                            <span className="text-xs font-bold text-indigo-600">{selectedElement.lineHeight || 1}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={selectedElement.lineHeight || 1}
                            onChange={(e) => {
                                updateElement(selectedElement.id, { lineHeight: parseFloat(e.target.value) });
                            }}
                            onMouseUp={() => pushState(elements)}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                </div>
            </div>

            {/* Font Family List */}
            <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Font Family</h3>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredFonts.map((font) => (
                        <button
                            key={font.name}
                            onClick={async () => {
                                setLoadingFont(font.name);
                                await loadFont(font.name, font.googleFontUrl);
                                updateElement(selectedElement.id, { fontFamily: font.name });
                                pushState(elements);
                                setLoadingFont(null);
                            }}
                            disabled={loadingFont === font.name}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all group ${selectedElement.fontFamily === font.name
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                    : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                } ${loadingFont === font.name ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            <div className="flex flex-col items-start transition-transform group-active:scale-95">
                                <span className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-2">
                                    {font.name}
                                    {loadingFont === font.name && <Loader2 size={12} className="animate-spin text-indigo-400" />}
                                </span>
                                <span
                                    className={`text-lg transition-colors ${selectedElement.fontFamily === font.name ? 'text-indigo-700' : 'text-slate-800'}`}
                                    style={{ fontFamily: font.family }}
                                >
                                    {selectedElement?.text}
                                </span>
                            </div>
                            {selectedElement.fontFamily === font.name && loadingFont !== font.name && (
                                <div className="bg-indigo-600 p-1 rounded-full text-white">
                                    <Check size={12} strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FontPanel;
