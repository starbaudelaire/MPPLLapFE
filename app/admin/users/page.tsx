// app/admin/users/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AdminUsersPage = async () => {
  const session = await auth();
  
  if (!session || session.user.role !== "admin") {
    redirect("/signin");
  }

  return (
    <div className="max-w-screen-xl px-4 py-8 mt-10 mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">User management features coming soon.</p>
        <p className="text-gray-500 mt-2">This page will allow you to manage user accounts, view user details, and handle user roles.</p>
      </div>
    </div>
  );
};

export default AdminUsersPage;