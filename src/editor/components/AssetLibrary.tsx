import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { Image as ImageIcon } from 'lucide-react';

const ORNAMENTS = [
    { name: 'Floral 1', url: 'https://cdn-icons-png.flaticon.com/512/3233/3233486.png' },
    { name: 'Floral 2', url: 'https://cdn-icons-png.flaticon.com/512/3233/3233493.png' },
    { name: 'Star', url: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' },
    { name: 'Heart', url: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' },
    { name: 'Banner', url: 'https://cdn-icons-png.flaticon.com/512/3232/3232675.png' },
    { name: 'Crown', url: 'https://cdn-icons-png.flaticon.com/512/1042/1042301.png' },
];

const AssetLibrary: React.FC = () => {
    const { addImageElement, template } = useEditorStore();

    const assetsToDisplay = template?.allowedAssets 
        ? ORNAMENTS.filter(a => template.allowedAssets.some(allowed => a.name.toLowerCase().includes(allowed.toLowerCase())))
        : ORNAMENTS;

    return (
        <div className="p-4 space-y-6">
            <h3 className="text-sm font-semibold text-gray-900">Ornaments</h3>
            
            <div className="grid grid-cols-2 gap-3">
                {assetsToDisplay.map((asset, index) => (
                    <button
                        key={index}
                        onClick={() => addImageElement(asset.url)}
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
