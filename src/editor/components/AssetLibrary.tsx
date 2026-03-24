import React, { useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { AVAILABLE_ORNAMENTS } from "../constants/ornaments";

const AssetLibrary: React.FC = () => {
    const { addImageElement, addSvgElement, template } = useEditorStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                addImageElement(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const assetsToDisplay = template?.allowedAssets 
        ? AVAILABLE_ORNAMENTS.filter(a => template.allowedAssets.some(allowed => a.name.toLowerCase().includes(allowed.toLowerCase())))
        : AVAILABLE_ORNAMENTS;

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Ornaments</h3>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
                >
                    <Upload size={14} />
                    Upload
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                {assetsToDisplay.map((asset, index) => (
                    <button
                        key={index}
                        onClick={() => addSvgElement(asset.url, true)}
                        className="group relative p-2 border border-gray-100 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/50 transition-all aspect-square flex items-center justify-center overflow-hidden"
                    >
                        <img 
                            src={asset.url} 
                            alt={asset.name} 
                            className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] py-1 translate-y-full group-hover:translate-y-0 transition-transform">
                            {asset.name}
                        </div>
                    </button>
                ))}
            </div>

            {assetsToDisplay.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <ImageIcon size={32} />
                    <p className="text-xs mt-2">No ornaments allowed for this product</p>
                </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex gap-2">
                    <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Click on an ornament to add it to your design. You can then resize and rotate it.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AssetLibrary;
