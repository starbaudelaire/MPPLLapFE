// app/field/create/page.tsx
import { auth } from "@/auth";
import CreateField from "@/components/admin/field/create-field";

const CreateFieldPage = async () => {
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
    <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
      <CreateField />
    </div>
  );
};

export default CreateFieldPage;
