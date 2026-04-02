import { ArrowLeft, ArrowRight } from "lucide-react";
export default function Pagination({ currentPage, totalPages=5, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
    return (
        <div className="flex items-center justify-end gap-2">
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer" onClick={() => onPageChange(currentPage - 1)}>
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm">Prev</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    className={`flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer ${currentPage === i + 1 ? "text-indigo-600" : ""}`}
                    onClick={() => onPageChange(i + 1)}
                >
                    <span className="font-semibold text-sm">{i + 1}</span>
                </button>
            ))}
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer" onClick={() => onPageChange(currentPage + 1)}>
                <span className="font-semibold text-sm">Next</span>
                <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
            </button>
        </div>
    );
}