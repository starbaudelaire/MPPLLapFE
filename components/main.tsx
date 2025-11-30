import Card from "@/components/card";
import { getAllFields } from "@/lib/data";

// Component ini async karena Server Component
const Main = async ({
  searchParams,
}: {
  searchParams?: { query?: string; type?: string; location?: string };
}) => {
  // Gabungkan query search nama & lokasi
  const query = searchParams?.query || searchParams?.location || "";
  const type = searchParams?.type || "";

  // Fetch data
  const fields = await getAllFields(query, type);

  if (fields.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
        <h3 className="text-lg font-medium text-gray-900">Tidak ada lapangan ditemukan.</h3>
        <p className="text-gray-500">Coba ganti kata kunci atau filter pencarianmu.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <Card key={field.id} field={field} />
      ))}
    </div>
  );
};

export default Main;