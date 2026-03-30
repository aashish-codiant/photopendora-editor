import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { DesignCard } from "../features/designs/components";
import { PageLayout } from "../layouts";
export default function Designs() {
    const navigate = useNavigate();
    const createNewDesign = () => {
        navigate('/editor');
    }

    const editDesign = (id: string) => {
        navigate(`/editor/${id}`);
    }

    const designs = [
        { id: 1, name: "Design 1", product: "T-Shirt", image: "👕" },
        { id: 2, name: "Design 2", product: "Hoodie", image: "🧥" },
        { id: 3, name: "Design 3", product: "Tote Bag", image: "🛍️" },
        { id: 4, name: "Design 4", product: "Mug", image: "☕" }
    ]

    return (
        <PageLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Designs</h1>
                    <p className="text-slate-400 text-sm dark:text-slate-600">Manage your product designs</p>
                </div>
                <button onClick={createNewDesign} className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Plus size={20} />
                    New Design
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {designs.map((design) => (
                    <DesignCard key={design.id} design={design} editDesign={editDesign} />
                ))}
            </div>

        </PageLayout>
    );
}