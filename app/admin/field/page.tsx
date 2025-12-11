// app/admin/field/page.tsx
import { getAllFields } from "@/lib/data";
import FieldList from "@/components/admin/field/field-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AdminFieldPage = async () => {
  const session = await auth();
  
  if (!session || session.user.role !== "admin") {
    redirect("/signin");
  }
  
  const fields = await getAllFields();

  return (
    <div className="max-w-screen-xl px-4 py-8 mt-10 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Fields</h1>
        <a 
          href="/field/create" 
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add New Field
        </a>
      </div>
      
      <FieldList fields={fields} />
    </div>
  );
};

export default AdminFieldPage;