export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6 text-center">
        Welcome to <span className="text-indigo-600">PhotoPandora</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-center">
        Customize products with our advanced editor, manage your assets, and track your orders all in one place.
      </p>
    </div>
  );
}
