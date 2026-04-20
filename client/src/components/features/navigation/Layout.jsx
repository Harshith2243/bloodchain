export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-xl font-bold text-red-600">BloodChain</h1>
        <ul className="mt-6 space-y-3">
          <li>Dashboard</li>
          <li>Register Donor</li>
          <li>Request Blood</li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}