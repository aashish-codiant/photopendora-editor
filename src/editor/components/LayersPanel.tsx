import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { Layers, ChevronUp, ChevronDown, Trash2, Type, Image as ImageIcon } from 'lucide-react';

const LayersPanel: React.FC = () => {
    const { elements, selectedElementId, selectElement, deleteElement, bringForward, sendBackward } = useEditorStore();

    // Reverse elements for display so top layer is at top of list
    const reversedElements = [...elements].reverse();

    if (elements.length === 0) {
        return (
            <div className="p-4 text-gray-400 text-sm flex flex-col items-center justify-center h-full">
                <Layers className="h-8 w-8 mb-2 opacity-20" />
                <p>No layers yet</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Layers</h3>
            
            <div className="space-y-2">
                {reversedElements.map((el) => (
                    <div
                        key={el.id}
                        onClick={() => selectElement(el.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                            selectedElementId === el.id
                                ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                : 'bg-white border-gray-100 hover:border-gray-300'
                        }`}
                    >
                        {/* Icon */}
                        <div className={`p-2 rounded-md ${
                            selectedElementId === el.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-500'
                        }`}>
                            {el.type === 'text' ? <Type className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {el.type === 'text' ? (el.text || 'Text Layer') : 'Image Layer'}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase">
                                {el.type} layer
                            </p>
                        </div>

                        {/* Actions */}
                        {selectedElementId === el.id && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); bringForward(el.id); }}
                                    className="p-1 hover:bg-white rounded-md transition-colors"
                                    title="Bring Forward"
                                >
                                    <ChevronUp className="h-4 w-4 text-gray-600" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); sendBackward(el.id); }}
                                    className="p-1 hover:bg-white rounded-md transition-colors"
                                    title="Send Backward"
                                >
                                    <ChevronDown className="h-4 w-4 text-gray-600" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                                    className="p-1 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete Layer"
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LayersPanel;
