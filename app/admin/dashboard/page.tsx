// app/admin/dashboard/page.tsx
import { auth } from "@/auth";

const AdminDashboard = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className="max-w-screen-xl px-4 py-8 mt-10 mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600">Please sign in to access this page.</p>
        <a href="/signin" className="text-primary hover:underline">Sign In</a>
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <div className="max-w-screen-xl px-4 py-8 mt-10 mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
        <a href="/" className="text-primary hover:underline">Go Home</a>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl px-4 py-8 mt-10 mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">Fields Management</h3>
          <p className="text-gray-600 mb-4">Create, view, edit, and delete sports fields</p>
          <a
            href="/admin/field"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 inline-block"
          >
            Manage Fields
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">Reservations</h3>
          <p className="text-gray-600 mb-4">View and manage field reservations</p>
          <a
            href="/admin/reservations"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 inline-block"
          >
            Manage Reservations
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">Users</h3>
          <p className="text-gray-600 mb-4">View and manage user accounts</p>
          <a
            href="/admin/users"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 inline-block"
          >
            Manage Users
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;