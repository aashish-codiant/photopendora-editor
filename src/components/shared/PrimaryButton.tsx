export default function PrimaryButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
            {children}
        </button>
    );
}