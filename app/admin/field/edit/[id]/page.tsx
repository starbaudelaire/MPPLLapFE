import EditForm from "@/components/admin/field/edit-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Next.js 15/16: Params itu Promise, jadi harus di-await
const EditFieldPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;

  // Fetch data lapangan + fasilitas yang udah dipilih
  const field = await prisma.field.findUnique({
    where: { id },
    include: { FieldAmenities: true }, 
  });

  // Fetch semua opsi fasilitas buat checkbox
  const amenities = await prisma.amenities.findMany();

  if (!field) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Field</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <EditForm field={field} amenities={amenities} />
      </div>
    </div>
  );
};

export default EditFieldPage;