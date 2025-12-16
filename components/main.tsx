// components/main.tsx

import { getAllFields } from "@/lib/data";
import Card from "./card";

export default async function Main({
  searchParams,
}: {
  searchParams: { query?: string; type?: string; location?: string };
}) {
  // Panggil function sakti dengan 3 filter
  // Note: searchParams.query sekarang berfungsi sebagai 'name' filter.
  // searchParams.location sekarang berfungsi sebagai 'address' filter.
  const fields = await getAllFields(
    searchParams.query,
    searchParams.location,
    searchParams.type
  );

  if (fields.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          Waduh, lapangan yang dicari gak ketemu nih.
        </p>
        <p className="text-gray-400 text-sm">
          Coba ganti kata kunci atau reset filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {fields.map((field) => (
        <div key={field.id} className="h-full">
          <Card field={field} />
        </div>
      ))}
    </div>
  );
}
