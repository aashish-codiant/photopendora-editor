import { Link } from "react-router";
import { PageLayout } from "../layouts";
export default function Products() {
  const products = [
    { id: 1, name: "T-Shirt Classic", price: "$25.00", image: "👕" },
    { id: 2, name: "Premium Hoodie", price: "$45.00", image: "🧥" },
    { id: 3, name: "Canvas Tote", price: "$15.00", image: "🛍️" },
    { id: 4, name: "Ceramic Mug", price: "$12.00", image: "☕" },
  ];

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 sm:text-center">Select a Product to Personalize</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
              {product.image}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-gray-500 mt-1">{product.price}</p>
              <Link to="/editor" className="mt-4 block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150">
                Customize
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
