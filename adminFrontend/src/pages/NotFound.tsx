export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>

      <a
        href="/builder"
        className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Go to Builder
      </a>
    </div>
  );
}