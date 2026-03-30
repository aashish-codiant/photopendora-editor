import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { useSearchParams, useNavigate } from 'react-router';
import { Check, Box } from 'lucide-react';

export const VariantSelector: React.FC = () => {
    const { template } = useEditorStore();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentVariantId = searchParams.get('variantId');

    const variants = template?.variants || [];

    const handleVariantSelect = (variantId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('variantId', variantId);
        
        // If we are editing a design, and we switch variant, 
        // usually we want to start a NEW design for that variant?
        // User said: "load that varint and create new design for that varinant"
        
        // So we navigate to /editor/create or /editor/new for that product/variant
        // Wait, if it's "create a new design", we should drop the current design ID.
        
        const productId = params.get('productId') || template?.productId;
        if (productId) {
            navigate(`/editor/create?productId=${productId}&variantId=${variantId}`);
        } else {
            // Fallback for general editing
            navigate(`/editor/create?variantId=${variantId}`);
        }
    };

    if (variants.length === 0) {
        return (
            <div className="p-6 text-center">
                <Box className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                <p className="text-sm text-slate-500 font-medium tracking-tight">No variants available for this product.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div>
                <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">Product Models</h2>
                <p className="text-[10px] text-slate-400 font-medium">Select a variant to personalize.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {variants.map((variant) => {
                    const isActive = currentVariantId === variant.id || (!currentVariantId && variant.id === template?.productId); // Simple fallback check
                    
                    return (
                        <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(variant.id)}
                            className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                isActive 
                                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm' 
                                : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'
                            }`}
                        >
                            <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                {variant.imageSrc ? (
                                    <img src={variant.imageSrc} alt={variant.title} className="h-full w-full object-contain p-1" />
                                ) : (
                                    <Box size={20} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700 group-hover:text-slate-900'}`}>{variant.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Configured Template</p>
                            </div>
                            {isActive && (
                                <div className="bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                                    <Check size={12} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="pt-4 border-t border-slate-100">
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                        <span className="font-bold underline">Note:</span> Switching variants will start a completely new design session for that specific model.
                    </p>
                </div>
            </div>
        </div>
    );
};
