export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-red-600">Access Denied 🚫</h1>
      <p className="mt-2 text-gray-700">
        You do not have permission to access this page.
      </p>
    </div>
  );
}