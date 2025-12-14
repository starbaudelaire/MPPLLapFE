import { getAllFields } from "@/lib/data";
import Card from "@/components/card";
import SearchFilter from "@/components/home/search-filter";

// Kita bikin page ini dinamis karena nerima Search Params
export default async function FieldPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; type?: string; location?: string }>;
}) {
  // Await search params (Next.js 15/16 requirement)
  const params = await searchParams;
  
  // Ambil data lapangan sesuai filter
  const fields = await getAllFields(params.query || params.location, params.type);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header & Filter Section */}
      <div className="max-w-7xl mx-auto mb-12 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cari Lapangan</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Temukan venue olahraga terbaik di sekitarmu dan booking sekarang juga.
          </p>
        </div>
        
        {/* Kita pasang komponen Search biar user bisa ganti filter disini */}
        <div className="relative z-10">
          <SearchFilter />
        </div>
      </div>

      {/* Grid Lapangan */}
      <div className="max-w-7xl mx-auto">
        {fields.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <Card key={field.id} field={field} />
            ))}
          </div>
        ) : (
          /* Empty State (Kalo ga ada lapangan yg cocok) */
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-4">
              <span className="text-4xl">🏟️</span>
              <h3 className="text-lg font-medium text-gray-900">
                Yah, lapangan tidak ditemukan.
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Coba ganti kata kunci pencarian atau reset filter kamu, bro.
              </p>
              <a 
                href="/field" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#f64e42] hover:bg-[#d93d32] transition"
              >
                Reset Filter
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}