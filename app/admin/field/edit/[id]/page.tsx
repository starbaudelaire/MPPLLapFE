import EditForm from "@/components/admin/field/edit-form";
import { getFieldById, getAllAmenities } from "@/lib/data"; // [1] Pastikan ini ke-import!
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default async function EditFieldPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // [2] Tarik dua data sekaligus: Field-nya & List Fasilitas-nya
  const [field, amenities] = await Promise.all([
    getFieldById(id),
    getAllAmenities(),
  ]);

  if (!field) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <Link
          href="/admin/field"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to List
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Edit Arena
          </h1>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-mono font-bold">
            #{id.slice(0, 6)}
          </span>
        </div>
        <p className="text-gray-500 mt-1">
          Update details for{" "}
          <span className="font-semibold text-gray-800">{field.name}</span>.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* [3] INI BIANG KEROKNYA: Jangan lupa oper amenities={amenities} */}
          <EditForm
            field={field}
            amenities={amenities || []} // Kasih '|| []' biar kalo error dia gak bikin crash, cuma kosong doang
          />
        </div>
      </div>
    </div>
  );
}
