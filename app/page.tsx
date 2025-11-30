import Hero from "@/components/hero";
import Main from "@/components/main";
import SearchFilter from "@/components/home/search-filter";

// Page component di Next.js 13+ menerima props searchParams secara otomatis
export default function Home({
  searchParams,
}: {
  searchParams?: { query?: string; type?: string; location?: string };
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Search Filter Section (Floating overlapping Hero) */}
      <div className="px-4 sm:px-6 lg:px-8">
        <SearchFilter />
      </div>

      {/* Main Content Section */}
      <div className="py-12 sm:py-20">
        <div className="text-center max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pilihan Komunitas
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Temukan lapangan terpopuler di sekitarmu minggu ini.
          </p>
        </div>

        {/* List Lapangan dengan Props Search Params */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Main searchParams={searchParams} />
        </div>
      </div>
    </main>
  );
}