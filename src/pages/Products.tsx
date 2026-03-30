import { useEffect, useState } from "react";
import { Link } from "react-router";
import { PageLayout } from "../layouts";
import { Loader2, AlertCircle, ShoppingBag, Settings } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data || []);
        } else {
          setError(result.error || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error connecting to the product service.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium tracking-tight">Fetching products from your Shopify store...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-rose-50 rounded-2xl border border-rose-100">
          <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-slate-900 transition-all"
          >
            Try Again
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <ShoppingBag className="text-indigo-600" />
          Select a Product to Personalize
        </h1>
        <p className="text-slate-500 font-medium italic">Choose a product from your catalog to start creating a new design template.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
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
                    <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 pr-2">{product.title || product.name}</h3>
                    <Link to={`/products/${product.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Product Settings">
                      <Settings size={18} />
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                       {product.productType || "Standard"}
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
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-50">
            <ShoppingBag size={48} className="text-slate-300 mb-4" />
            <p className="text-xl font-medium text-slate-400 italic">No products found in your Shopify store.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
