import { Link } from "react-router";
import type { Product } from "../types/product.types";
import { Settings } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-500 flex flex-col transform hover:-translate-y-1">
            <div className="h-60 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {product.featureImage ? (
                    <img src={product.featureImage} alt={product.title} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="text-7xl group-hover:scale-125 transition-transform duration-500 opacity-60">📦</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 pr-2">{product.title}</h3>
                        <Link to={`/products/${product.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Product Settings">
                            <Settings size={18} />
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                            {product.variants.length || 0} Designs
                        </span>
                        {product.variants?.length > 0 && (
                            <span className="text-xs font-medium text-slate-400">
                                {product.variants.length} Variants
                            </span>
                        )}
                    </div>
                </div>
                <Link to={`/editor/create?productId=${product.id}`} className="mt-auto w-full group/btn flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95">
                    Customize Template
                </Link>
            </div>
        </div>
    )

}