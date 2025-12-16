// app/page.tsx

import Hero from "@/components/hero";
import Main from "@/components/main";
// ❌ SearchFilter tidak perlu diimport lagi karena sudah ada di Hero.tsx
// import SearchFilter from "@/components/home/search-filter";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; type?: string; location?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section (Sudah termasuk SearchFilter Transparan) */}
      <Hero />

      {/* ❌ Search Filter Section (Floating overlapping Hero) DIHAPUS karena duplikat */}

      {/* Main Content Section */}
      <div className="py-12 sm:py-20">
        <div className="text-center max-w-7xl mx-auto px-4 mb-12">
          {/* Diubah: "Pilihan Komunitas" -> "Pilih Lapanganmu!" */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Let the match begin!
          </h2>
          {/* Diubah: "Temukan lapangan terpopuler..." -> "Cari lapangan sesuai minatmu" */}
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Pick your field, set your game. Find the perfect spot to play
          </p>
        </div>

        {/* List Lapangan dengan Props Search Params yang udah di-await */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Main searchParams={params} />
        </div>
      </div>
    </main>
  );
}
