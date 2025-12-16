import { getAllFields } from "@/lib/data";
import Card from "@/components/card";
import SearchFilter from "@/components/home/search-filter";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import HeaderSection from "@/components/header-section";

export default async function FieldPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; type?: string; location?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const location = params.location || "";
  const type = params.type || "";

  const fields = await getAllFields(query, location, type);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Header Image */}
      <HeaderSection
        title="Your Field, Your Game"
      />

      {/* 2. SEARCH FILTER SECTION (STATIC) */}
      {/* Hapus 'sticky', 'top-xx'. Ganti jadi relative biasa. */}
      {/* Kasih -mt-8 biar dia numpuk dikit ke header image, aesthetic tapi gak maksa */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        {/* Balik ke default (Solid White) biar bersih */}
        <SearchFilter buttonLabel="Find Court" />
      </div>

      {/* 3. LIST LAPANGAN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header kecil info jumlah lapangan */}
        <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Available Courts
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Book your spot instantly.
            </p>
          </div>
          <span className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {fields.length} Found
          </span>
        </div>

        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 text-center px-4 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <FaceFrownIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Literally nothing here.
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any field that matches your vibe in this
              location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {fields.map((field) => (
              <Card key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
