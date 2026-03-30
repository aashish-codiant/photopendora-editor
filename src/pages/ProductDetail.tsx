import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PageLayout } from "../layouts";
import { Loader2, AlertCircle, Save, ArrowLeft, Layers, Maximize } from "lucide-react";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                const result = await response.json();
                if (result.success) {
                    setProduct(result.data);
                } else {
                    setError(result.error || "Failed to fetch product information.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Error connecting to the product service.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                method: 'PUT', // or PATCH
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const result = await response.json();
            if (result.success) {
                alert("Product configuration saved successfully!");
            } else {
                alert(`Failed to save: ${result.error}`);
            }
        } catch (err) {
            alert("Error saving product configuration.");
        } finally {
            setSaving(false);
        }
    };

    const updateVariant = (variantId: string, updates: any) => {
        setProduct({
            ...product,
            variants: product.variants.map((v: any) => 
                v.id === variantId ? { ...v, ...updates } : v
            )
        });
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading Product Configuration...</p>
                </div>
            </PageLayout>
        );
    }

    if (error || !product) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-rose-50 rounded-2xl border border-rose-100 max-w-2xl mx-auto">
                    <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Error</h2>
                    <p className="text-slate-600 mb-6">{error || "Product not found"}</p>
                    <button onClick={() => navigate('/products')} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold">Return to Catalog</button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Back to catalog</span>
                </button>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? "Saving Changes..." : "Save Product Settings"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Info Section */}
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

                {/* Variants Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Variants</h2>
                        <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{product.variants?.length || 0}</span>
                    </div>

                    <div className="space-y-4">
                        {product.variants?.map((variant: any) => (
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
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
