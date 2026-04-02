import { Maximize } from "lucide-react";

export default function VariantCard({ variant, updateVariant }: { variant: any, updateVariant: (id: string, updates: any) => void }) {
    return (
        <div key={variant.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors group">
            <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {variant.imageSrc ? (
                        <img src={variant.imageSrc} alt={variant.title} className="w-full h-full object-contain p-1" />
                    ) : (
                        <div className="text-3xl">👕</div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{variant.title}</h3>
                            <p className="text-xs text-slate-400 font-medium font-mono">SKU: {variant.sku || "N/A"}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-indigo-600 font-extrabold text-lg">${variant.price}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Maximize size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Printable Area Configuration</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">X Pos</label>
                                <input
                                    type="number"
                                    value={variant.areaX || 0}
                                    onChange={(e) => updateVariant(variant.id, { areaX: parseInt(e.target.value) })}
                                    className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Y Pos</label>
                                <input
                                    type="number"
                                    value={variant.areaY || 0}
                                    onChange={(e) => updateVariant(variant.id, { areaY: parseInt(e.target.value) })}
                                    className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Width</label>
                                <input
                                    type="number"
                                    value={variant.areaWidth || 200}
                                    onChange={(e) => updateVariant(variant.id, { areaWidth: parseInt(e.target.value) })}
                                    className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Height</label>
                                <input
                                    type="number"
                                    value={variant.areaHeight || 300}
                                    onChange={(e) => updateVariant(variant.id, { areaHeight: parseInt(e.target.value) })}
                                    className="w-full border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
