import { PageLayout } from "../layouts";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, ShoppingBag, } from "lucide-react";
import { ProductCard, Pagination } from "../features/products/components";
import { getProducts } from "../features/products/services/productServices";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getProducts().then((products) => {
      setProducts(products);
      setLoading(false);
    }).catch((error) => {
      setError(error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">Fetching products from your Shopify store...</p>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-center gap-2 mb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingBag className="text-indigo-600" />
            Select a Product to Personalize
          </h1>
          <p className="text-slate-500 italic">Choose a product from your catalog to start creating a new design template.</p>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
