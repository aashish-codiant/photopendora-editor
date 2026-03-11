export default function Assets() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Assets Library</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder content for assets */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse border border-gray-100">
            <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center p-12 bg-gray-50 h-48">
              <span className="text-gray-400">Asset {i}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
