import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Type, Lock, Unlock } from 'lucide-react';
import { AVAILABLE_FONTS } from '../constants/fonts';
import { loadFont } from '../utils/fontLoader';

export const PropertiesPanel: React.FC = () => {
    const { elements, selectedElementId, updateElement, template } = useEditorStore();
    const pushState = useHistoryStore(state => state.pushState);

    const element = elements.find((el) => el.id === selectedElementId);

    if (!element) {
        return (
            <div className="p-4">
                <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Properties</h2>
                <div className="text-sm text-slate-500 text-center mt-10 p-4 border border-dashed border-slate-300 rounded-md bg-slate-50">
                    Select an element on the canvas to edit its properties.
                </div>
            </div>
        );
    }

    const handleUpdate = (updates: Partial<typeof element>, commit: boolean = false) => {
        updateElement(element.id, updates);
        if (commit) pushState(elements);
    };

    const handleBoldToggle = () => {
        const isBold = element.fontStyle?.includes('bold');
        const isItalic = element.fontStyle?.includes('italic');
        let newStyle = 'normal';

        if (!isBold && isItalic) newStyle = 'italic bold';
        else if (!isBold && !isItalic) newStyle = 'bold';
        else if (isBold && isItalic) newStyle = 'italic';
        else if (isBold && !isItalic) newStyle = 'normal';

        handleUpdate({ fontStyle: newStyle as "normal" | "bold" | "italic" | "italic bold" }, true);
    };

    const handleItalicToggle = () => {
        const isBold = element.fontStyle?.includes('bold');
        const isItalic = element.fontStyle?.includes('italic');
        let newStyle = 'normal';

        if (!isItalic && isBold) newStyle = 'italic bold';
        else if (!isItalic && !isBold) newStyle = 'italic';
        else if (isItalic && isBold) newStyle = 'bold';
        else if (isItalic && !isBold) newStyle = 'normal';

        handleUpdate({ fontStyle: newStyle as "normal" | "bold" | "italic" | "italic bold" }, true);
    };

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Properties</h2>

            {/* Position & Size */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-700">Transform</h3>
                    <button
                        onClick={() => handleUpdate({ locked: !element.locked }, true)}
                        className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${element.locked ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        title={element.locked ? "Unlock element" : "Lock element"}
                    >
                        {element.locked ? <Lock size={14} /> : <Unlock size={14} />}
                        {element.locked ? 'Locked' : 'Unlocked'}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">X</label>
                        <input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={(e) => handleUpdate({ x: Number(e.target.value) })}
                            onBlur={() => pushState(elements)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Y</label>
                        <input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={(e) => handleUpdate({ y: Number(e.target.value) })}
                            onBlur={() => pushState(elements)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Rotation (°)</label>
                        <input
                            type="number"
                            value={Math.round(element.rotation)}
                            onChange={(e) => handleUpdate({ rotation: Number(e.target.value) })}
                            onBlur={() => pushState(elements)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Text Specific Properties */}
            {(element.type === 'text' || element.type === 'curvedText') && (
                <>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-sm font-semibold text-slate-700">Text Content</h3>
                            {template?.maxCharacters && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${(element.text?.length || 0) >= (template.maxCharacters || 0) ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {element.text?.length || 0} / {template.maxCharacters}
                                </span>
                            )}
                        </div>
                        <textarea
                            value={element.text || ''}
                            onChange={(e) => {
                                if (template?.maxCharacters && e.target.value.length > template.maxCharacters) return;
                                handleUpdate({ text: e.target.value });
                            }}
                            onBlur={() => pushState(elements)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-700">Typography</h3>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Font Size</label>
                                <input
                                    type="number"
                                    value={Math.round(element.fontSize || 40)}
                                    onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                                    onBlur={() => pushState(elements)}
                                    className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={element.fill || '#000000'}
                                        onChange={(e) => handleUpdate({ fill: e.target.value })}
                                        onBlur={() => pushState(elements)}
                                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                    />
                                    <span className="text-sm text-slate-600 uppercase font-mono">{element.fill || '#000000'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="text-xs text-slate-500 mb-1 block">Font Family</label>
                            <div className="relative">
                                <select
                                    value={element.fontFamily || 'Arial'}
                                    onChange={async (e) => {
                                        const fontName = e.target.value;
                                        const fontData = AVAILABLE_FONTS.find(f => f.name === fontName);
                                        if (fontData) {
                                            await loadFont(fontName, fontData.googleFontUrl);
                                        }
                                        handleUpdate({ fontFamily: fontName }, true);
                                    }}
                                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium"
                                    style={{ fontFamily: element.fontFamily || 'Arial' }}
                                >
                                    {AVAILABLE_FONTS.filter(f => !template?.allowedFonts?.length || template.allowedFonts.includes(f.name)).map((font) => (
                                        <option key={font.name} value={font.name} style={{ fontFamily: font.family }}>
                                            {font.name}
                                        </option>
                                    ))}
                                </select>
                                <Type size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Formatting */}
                        <div className="pt-2">
                            <label className="text-xs text-slate-500 mb-1 block">Formatting</label>
                            <div className="flex gap-1 border border-slate-200 rounded-md p-1 bg-slate-50 w-fit">
                                <button
                                    onClick={() => handleUpdate({ align: 'left' }, true)}
                                    className={`p-1.5 rounded-sm transition-colors ${element.align === 'left' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                    title="Align Left"
                                >
                                    <AlignLeft size={16} />
                                </button>
                                <button
                                    onClick={() => handleUpdate({ align: 'center' }, true)}
                                    className={`p-1.5 rounded-sm transition-colors ${element.align === 'center' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                    title="Align Center"
                                >
                                    <AlignCenter size={16} />
                                </button>
                                <button
                                    onClick={() => handleUpdate({ align: 'right' }, true)}
                                    className={`p-1.5 rounded-sm transition-colors ${element.align === 'right' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                    title="Align Right"
                                >
                                    <AlignRight size={16} />
                                </button>
                                <div className="w-px h-6 bg-slate-200 mx-1 self-center" />
                                <button
                                    onClick={handleBoldToggle}
                                    className={`p-1.5 rounded-sm transition-colors ${element.fontStyle?.includes('bold') ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                    title="Bold"
                                >
                                    <Bold size={16} />
                                </button>
                                <button
                                    onClick={handleItalicToggle}
                                    className={`p-1.5 rounded-sm transition-colors ${element.fontStyle?.includes('italic') ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                                    title="Italic"
                                >
                                    <Italic size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs text-slate-500">Letter Spacing</label>
                                    <span className="text-[10px] font-mono text-slate-400">{element.letterSpacing || 0}</span>
                                </div>
                                <input
                                    type="range"
                                    min="-2"
                                    max="20"
                                    step="0.5"
                                    value={element.letterSpacing || 0}
                                    onChange={(e) => handleUpdate({ letterSpacing: parseFloat(e.target.value) })}
                                    onBlur={() => pushState(elements)}
                                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs text-slate-500">Line Height</label>
                                    <span className="text-[10px] font-mono text-slate-400">{element.lineHeight || 1}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="2.5"
                                    step="0.1"
                                    value={element.lineHeight || 1}
                                    onChange={(e) => handleUpdate({ lineHeight: parseFloat(e.target.value) })}
                                    onBlur={() => pushState(elements)}
                                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        {element.type === 'curvedText' && (
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-2">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-slate-500">Curve Radius</label>
                                        <span className="text-[10px] font-mono text-slate-400">{element.radius || 120}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="20"
                                        max="500"
                                        step="1"
                                        value={element.radius || 120}
                                        onChange={(e) => handleUpdate({ radius: parseFloat(e.target.value) })}
                                        onBlur={() => pushState(elements)}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-slate-500">Arc Angle (°)</label>
                                        <span className="text-[10px] font-mono text-slate-400">{element.arcAngle || 180}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="360"
                                        step="1"
                                        value={element.arcAngle || 180}
                                        onChange={(e) => handleUpdate({ arcAngle: parseFloat(e.target.value) })}
                                        onBlur={() => pushState(elements)}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* SVG Specific Properties */}
            {element.type === 'svg' && element.colorEditable && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700">SVG Colors</h3>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Tint Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={element.tintColor || '#000000'}
                                onChange={(e) => handleUpdate({ tintColor: e.target.value })}
                                onBlur={() => pushState(elements)}
                                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                            />
                            <span className="text-sm text-slate-600 uppercase font-mono">{element.tintColor || '#000000'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
