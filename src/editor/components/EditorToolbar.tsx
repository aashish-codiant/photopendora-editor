import React from 'react';
import { Trash2, Undo, Redo, Download, Type, Save } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useHistoryStore } from '../store/historyStore';
import { exportDesign } from '../utils/exportDesign';
import { generateSVG } from '../utils/generateSVG';
import { generatePreview } from '../utils/generatePreview';
import { exportStageAsImage } from '../utils/exportImage';
import Konva from 'konva';

export const EditorToolbar: React.FC = () => {
    const { 
        addTextElement, 
        addCurvedTextElement,
        deleteElement, 
        selectedElementId, 
        elements, 
        setElements, 
        template,
        designId
    } = useEditorStore();
    const { undo, redo, past, future } = useHistoryStore();

    const textElementsCount = elements.filter(el => el.type === 'text').length;
    const canAddText = !template || !template.maxTextElements || textElementsCount < template.maxTextElements;

    const handleUndo = () => {
        const previous = undo(elements);
        if (previous) setElements(previous);
    };

    const handleRedo = () => {
        const next = redo(elements);
        if (next) setElements(next);
    };

    const handleSaveDesign = async () => {
        if (!designId) return;

        // 1. Get Stage
        const stage = Konva.stages[0];
        if (!stage) {
            alert("Canvas not ready.");
            return;
        }

        // 2. Generate Preview
        const previewUrl = generatePreview(stage);
        
        // 3. Generate SVG & Export JSON
        const svgContent = generateSVG(elements, template?.canvasWidth, template?.canvasHeight);
        const designJSON = elements;

        // 4. Create Design Session
        const session = {
            designId,
            productId: template?.productId,
            designJSON,
            previewUrl,
            svgContent, // Store content instead of URL for mock
            status: 'submitted',
            createdAt: new Date()
        };

        // For now, save final session to localStorage too
        localStorage.setItem(`session_${designId}`, JSON.stringify(session));
        
        console.log("Full Design Session Exported:", session);
        alert("Design Session Submitted! Preview generated and designs exported.");
        
        // Trigger high-res PNG download
        exportStageAsImage(stage, elements, { 
            filename: `production-${template?.productId || 'design'}-${Date.now()}.png` 
        });
        
        // Also trigger JSON download
        exportDesign(elements, template?.productId);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={addTextElement}
                disabled={!canAddText}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium shadow-sm ${
                    canAddText 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                }`}
                title={canAddText ? "Add Text" : `Limit of ${template?.maxTextElements} text elements reached`}
            >
                <Type size={18} />
                Add Text
            </button>

            <button
                onClick={addCurvedTextElement}
                disabled={!canAddText}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium shadow-sm ${
                    canAddText 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                }`}
                title={canAddText ? "Add Curved Text" : `Limit of ${template?.maxTextElements} text elements reached`}
            >
                <Type size={18} className="rotate-[15deg]" />
                Curved Text
            </button>

            <div className="h-8 w-px bg-slate-200 mx-1" />

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

            <div className="h-8 w-px bg-slate-200 mx-1" />

            {/* Export */}
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        const stage = Konva.stages[0];
                        if (stage) exportStageAsImage(stage, elements);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm cursor-pointer"
                    title="Export High-Res PNG"
                >
                    <Download size={18} />
                    Export PNG
                </button>
                
                <button
                    onClick={handleSaveDesign}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm cursor-pointer shadow-indigo-200"
                    title="Save Design & Generate Production Files"
                >
                    <Save size={18} />
                    Save Design
                </button>
            </div>

            {selectedElementId && (
                <>
                    <div className="h-8 w-px bg-slate-200 mx-1" />
                    <button
                        onClick={() => deleteElement(selectedElementId)}
                        className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-md hover:bg-rose-100 transition-colors text-sm font-medium shadow-sm cursor-pointer"
                        title="Delete Selected Element"
                    >
                        <Trash2 size={16} />
                    </button>
                </>
            )}
        </div>
    );
};
