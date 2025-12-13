// app/admin/field/page.tsx

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";
import { deleteField } from "@/lib/action"; // Pastikan ini bener import-nya

// --- KITA BIKIN KOMPONEN TOMBOLNYA DISINI AJA ---
function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await deleteField(id);
      }}
      // Kita pake onSubmit client-side logic dikit buat konfirmasi
      // (Note: Kalo mau full interactive confirm, idealnya dipisah component client.
      // Tapi buat admin simple, kita bypass confirm JS dulu atau biarin action jalan langsung)
    >
      <button
        type="submit"
        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        title="Delete Field"
      >
        <IoTrashOutline />
      </button>
    </form>
  );
}
// ------------------------------------------------

export default async function FieldPage() {
  // Fetch data lapangan terbaru
  const fields = await prisma.field.findMany({
    orderBy: { createdAt: "desc" },
    // include: { FieldAmenities: true }, // Uncomment kalo butuh liat amenities
  });

  return (
    <div className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Fields</h1>
        <Link
          href="/admin/field/create"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
        >
          <IoAddSharp className="text-xl" />
          <span>Add New</span>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 border-b">No</th>
              <th className="py-3 px-4 border-b">Image</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Type</th>
              <th className="py-3 px-4 border-b">Price/Hr</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {fields.map((field, index) => (
              <tr key={field.id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                    <div className="relative w-16 h-10 rounded overflow-hidden bg-gray-200">
                       {/* Pastikan field.image valid URL */}
                        <Image 
                           src={field.image} 
                           alt={field.name} 
                           fill 
                           className="object-cover"
                        />
                    </div>
                </td>
                <td className="py-3 px-4 font-medium">{field.name}</td>
                <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                        {field.type}
                    </span>
                </td>
                <td className="py-3 px-4">Rp {field.pricePerHour.toLocaleString('id-ID')}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    {/* Tombol Edit */}
                    <Link
                      href={`/admin/field/edit/${field.id}`}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition"
                    >
                      <IoPencil />
                    </Link>
                    
                    {/* Tombol Delete (Langsung Pake Component di Atas) */}
                    <DeleteButton id={field.id} />
                  </div>
                </td>
              </tr>
            ))}
            
            {fields.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                        Belum ada lapangan nih, bro. Klik "Add New" buat nambah!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}