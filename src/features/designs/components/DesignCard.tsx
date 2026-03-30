export default function DesignCard({ design, editDesign }: { design: any, editDesign: (id: string) => void }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
              {design.image}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{design.name}</h3>
              {/* <p className="text-gray-500 mt-1">{product.price}</p> */}
              <button onClick={() => editDesign(design.id.toString())} className="mt-4 block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150">
                Edit
              </button>
            </div>
        </div>

    )
}