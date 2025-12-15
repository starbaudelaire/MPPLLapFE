// app/admin/field/create/page.tsx
import CreateForm from "@/components/admin/field/create-form";
import { prisma } from "@/lib/prisma";

export default async function CreateFieldPage() {
  // Fetch amenities buat opsi checkbox
  const amenities = await prisma.amenities.findMany();

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Field</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        {/* Pass data amenities ke client component */}
        <CreateForm amenities={amenities} />
      </div>
    </div>
  );
}
