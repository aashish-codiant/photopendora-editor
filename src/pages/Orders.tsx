export default function Orders() {
  return (
    <div className="flex-1 p-8 bg-gray-50 flex flex-col justify-center items-center h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Your Orders</h1>
      <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">Track your product personalization orders here.</p>

      <div className="bg-white shadow rounded-lg border border-gray-100 p-8 text-center max-w-lg w-full">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900">No Orders Yet</h3>
        <p className="mt-1 text-sm text-gray-500">Your custom orders will appear here once placed.</p>
      </div>
    </div>
  );
}
