import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PageLayout } from "../layouts";
import { Loader2, AlertCircle, Save, ArrowLeft, Layers } from "lucide-react";
import { VariantCard, ProductInfo } from "../features/products/components";

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
                <ProductInfo product={product} setProduct={setProduct} />

                {/* Variants Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Variants</h2>
                        <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{product.variants?.length || 0}</span>
                    </div>

                    <div className="space-y-4">
                        {product.variants?.map((variant: any) => (
                            <VariantCard key={variant.id} variant={variant} updateVariant={updateVariant} />
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
