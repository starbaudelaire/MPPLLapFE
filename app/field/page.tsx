import { getAllFields } from "@/lib/data";
import Card from "@/components/card";
import SearchFilter from "@/components/home/search-filter";

// Halaman ini sekarang jadi Pusat Pencarian
export default async function FieldPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; type?: string; location?: string }>;
}) {
  // 1. Tangkep filter dari URL
  const params = await searchParams;
  const query = params.query || "";
  const location = params.location || "";
  const type = params.type || "";

  // 2. Fetch data sesuai filter
  const fields = await getAllFields(query, location, type);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      {/* Search Filter kita taruh lagi disini biar user bisa ganti filter tanpa balik home */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <SearchFilter />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {fields.length > 0
              ? "Hasil Pencarian"
              : "Belum ada lapangan yang pas"}
          </h1>
          <p className="text-gray-500 text-sm">
            Menampilkan {fields.length} lapangan
          </p>
        </div>

        {/* 3. Render Hasil */}
        {fields.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              Waduh, gak nemu lapangan di lokasi itu.
            </p>
            <p className="text-gray-400 text-sm">
              Coba cari daerah lain atau ganti tipe olahraga.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <Card key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
