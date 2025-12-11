// app/admin/field/edit/[id]/page.tsx
import { auth } from "@/auth";
import EditFieldFormWrapper from "@/components/admin/field/edit-field-form-wrapper";
import { getFieldById } from "@/lib/data";

type Props = {
  params: {
    id: string;
  };
};

const EditFieldPage = async ({ params }: Props) => {
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

  const field = await getFieldById(params.id);

  if (!field) {
    return <div>Field not found</div>;
  }

  return (
    <div className="max-w-screen-xl px-4 py-8 mt-10 mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Edit Field: {field.name}
        </h1>
        <EditFieldFormWrapper field={field} />
      </div>
    </div>
  );
};

export default EditFieldPage;