import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-gray-50">
      <h2 className="text-7xl font-extrabold text-indigo-600 tracking-tight">404</h2>
      <h3 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">Page not found</h3>
      <p className="mt-4 text-base text-gray-500 max-w-sm">Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.</p>
      <div className="mt-8">
        <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          Go back home
        </Link>
      </div>
    </div>
  );
}
