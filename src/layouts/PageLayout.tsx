export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
            {children}
        </div>
    );
}