import {
  CreateField,
  DeleteField,
  UpdateField,
} from "@/components/admin/field/buttons";
import { getAllFields } from "@/lib/data";
import Image from "next/image";
import { MapPinIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";

export default async function AdminFieldPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";

  const fields = await getAllFields(query);

  return (
    // UPDATED: pb-20 kejauhan, gue ganti pb-10 biar pas. space-y-6 udah cukup.
    <div className="w-full pb-10 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Field Manager
          </h1>
          <p className="text-gray-500 mt-1 text-lg font-light">
            Manage your courts, prices, and amenities.
          </p>
        </div>
        <CreateField />
      </div>

      {/* GRID LAYOUT */}
      {/* UPDATED: gap-8 jadi gap-6 biar lebih rapi */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div
            key={field.id}
            // UPDATED: Tambah 'flex flex-col' biar card-nya ngisi tinggi grid dengan pinter
            className="group relative bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
          >
            {/* Image Header */}
            {/* UPDATED: h-56 ketinggian buat card compact, h-48 or h-52 is sweet spot */}
            <div className="relative h-52 w-full bg-gray-100">
              <Image
                src={field.image || "/card-lapangan.jpg"}
                alt={field.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

              {/* Badge Tipe */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm border border-white/20">
                  {field.type.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Content Body */}
            {/* UPDATED: p-6 jadi p-5 biar gap pinggir gak lebay. 'flex-grow' buat dorong footer ke bawah rapi */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {field.name}
                </h3>
                {/* UPDATED: mb-6 kejauhan, mb-1 aja cukup karena udah ada spacing dari container */}
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400 shrink-0" />
                  <span className="truncate">{field.address}</span>
                </div>
              </div>

              {/* Stats Row */}
              {/* UPDATED: py-4 jadi py-3 biar gap vertical lebih 'tight' */}
              <div className="flex items-center gap-4 py-3 border-t border-gray-100 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                    Price/Hour
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#f64e42]">
                      Rp {field.pricePerHour.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {/* UPDATED: Gak perlu mt-auto lagi karena udah didorong container atas, kasih pt-3 biar misah dikit */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex-1">
                  <UpdateField id={field.id} />
                </div>
                <div className="flex-none">
                  <DeleteField id={field.id} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No fields found yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start adding one using the button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
