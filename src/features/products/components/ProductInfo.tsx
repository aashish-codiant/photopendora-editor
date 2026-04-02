import { Layers } from "lucide-react";
export default function ProductInfo({ product, setProduct }: { product: any, setProduct: (product: any) => void }) {
    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center text-center">
                <div className="w-full aspect-square bg-slate-100 rounded-xl mb-6 overflow-hidden flex items-center justify-center">
                    {product.featureImage ? (
                        <img src={product.featureImage} alt={product.title} className="w-full h-full object-contain p-4" />
                    ) : (
                        <div className="text-6xl text-slate-300">📦</div>
                    )}
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-tight mb-2">{product.title}</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-100">
                    {product.productType || "Standard Product"}
                </span>
            </div>

            <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Layers size={20} className="text-indigo-200" />
                    </div>
                    <h2 className="text-lg font-bold">Global Defaults</h2>
                </div>
                <p className="text-indigo-200 text-xs font-medium mb-6 leading-relaxed opacity-80 italic italic">These settings will initialize new designs for this product.</p>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Canvas W</label>
                            <input
                                type="number"
                                value={product.canvasWidth || 800}
                                onChange={(e) => setProduct({ ...product, canvasWidth: parseInt(e.target.value) })}
                                className="w-full bg-indigo-800/50 border border-indigo-400/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-400 font-mono"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">Canvas H</label>
                            <input
                                type="number"
                                value={product.canvasHeight || 800}
                                onChange={(e) => setProduct({ ...product, canvasHeight: parseInt(e.target.value) })}
                                className="w-full bg-indigo-800/50 border border-indigo-400/30 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-400 font-mono"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}