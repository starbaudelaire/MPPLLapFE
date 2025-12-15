import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { IoAddSharp, IoPencil, IoTrashOutline } from "react-icons/io5";
import { deleteField } from "@/lib/action";

// --- KOMPONEN DELETE BUTTON (Server Action di Client Component Kecil) ---
function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await deleteField(id);
      }}
    >
      <button
        type="submit"
        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition shadow-sm"
        title="Delete Field"
        // Tambahin confirm javascript native biar ga kepencet ga sengaja
        // (Opsional, tapi recommended buat admin)
      >
        <IoTrashOutline />
      </button>
    </form>
  );
}

// ------------------------------------------------

export default async function FieldPage() {
  // Fetch data terbaru (urutkan dari yang paling baru dibuat)
  const fields = await prisma.field.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full py-6">
      {" "}
      {/* Gak perlu px-4 lagi karena udah dihandle Layout */}
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Fields</h1>
          <p className="text-sm text-gray-500">
            Atur daftar lapangan futsal lo disini.
          </p>
        </div>
        <Link
          href="/admin/field/create"
          className="bg-lapang-primary hover:bg-red-600 text-white py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <IoAddSharp className="text-xl" />
          <span>Add New</span>
        </Link>
      </div>
      {/* TABEL DATA */}
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="py-4 px-6 border-b">No</th>
              <th className="py-4 px-6 border-b">Image</th>
              <th className="py-4 px-6 border-b">Name</th>
              <th className="py-4 px-6 border-b">Type</th>
              <th className="py-4 px-6 border-b">Price/Hr</th>
              <th className="py-4 px-6 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
            {fields.map((field, index) => (
              <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-400">
                  {index + 1}
                </td>
                <td className="py-4 px-6">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={field.image || "/card-lapangan.jpg"}
                      alt={field.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-gray-900">
                  {field.name}
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    {field.type}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium">
                  Rp {field.pricePerHour.toLocaleString("id-ID")}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center gap-2">
                    {/* Tombol Edit */}
                    <Link
                      href={`/admin/field/edit/${field.id}`}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition shadow-sm"
                      title="Edit Field"
                    >
                      <IoPencil />
                    </Link>

                    {/* Tombol Delete */}
                    <DeleteButton id={field.id} />
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty State */}
            {fields.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <IoTrashOutline className="text-4xl mb-2 opacity-20" />
                    <p>Belum ada lapangan nih, Bos.</p>
                    <p className="text-xs">
                      Klik tombol "Add New" di atas buat mulai.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
