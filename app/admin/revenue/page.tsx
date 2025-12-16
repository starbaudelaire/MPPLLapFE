import { getRevenueByDate } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import DateFilter from "@/components/admin/revenue/date-filter";
import {
  BuildingStorefrontIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

// 1. 🔥 PAKSA JANGAN CACHE (Biar Realtime Terus)
export const dynamic = "force-dynamic";

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;

  // 2. 🔥 FIX TIMEZONE: Ambil Waktu 'Today' versi Jakarta (WIB)
  const todayWIB = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta", // Format YYYY-MM-DD sesuai WIB
  });

  // Kalo ga ada params date, pake hari ini versi WIB
  const dateParam = params.date || todayWIB;
  const currentDate = new Date(dateParam);

  // Format Date (Display)
  const displayDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(currentDate);

  // Fetch Data
  const { platformRevenue, ownerRevenue, fieldRevenues } =
    await getRevenueByDate(dateParam);

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER & DATE NAVIGATOR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Revenue Report
          </h1>
          <p className="text-gray-500 mt-1 text-lg font-light">
            Daily Income Breakdown.
          </p>
        </div>

        {/* Date Filter Component */}
        <DateFilter currentDateStr={dateParam} />
      </div>

      {/* SPLIT CARDS SECTION */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* CARD 1: PLATFORM REVENUE */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl p-8 group transition-all hover:scale-[1.01]">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-blue-300">
              <BuildingStorefrontIcon className="w-5 h-5" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                Net Platform Earnings
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
              <span className="text-lg text-gray-400 font-medium mr-1">Rp</span>
              {platformRevenue.toLocaleString("id-ID")}
            </h2>
            <p className="text-sm text-gray-400">
              Total from 10% App Fees & Unique Codes.
            </p>
            <div className="mt-8 pt-6 border-t border-gray-800">
              <Link
                href="/admin/revenue/app-history"
                className="text-sm font-semibold text-white flex items-center hover:text-blue-300 transition-colors"
              >
                View Details <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* CARD 2: OWNER REVENUE */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 text-gray-900 shadow-xl p-8 group transition-all hover:scale-[1.01]">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-400 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <BuildingStorefrontIcon className="w-5 h-5" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                Partners Revenue
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
              <span className="text-lg text-gray-400 font-medium mr-1">Rp</span>
              {ownerRevenue.toLocaleString("id-ID")}
            </h2>
            <p className="text-sm text-gray-500">
              Funds to be disbursed to Field Owners.
            </p>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Settlement Status:</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                  AUTO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BREAKDOWN PER FIELD */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          Partner Performance
        </h3>

        {fieldRevenues.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
            <p className="text-gray-500 font-medium">
              No transactions found for {displayDate}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldRevenues.map((field) => (
              <Link
                href={`/admin/revenue/${field.id}`}
                key={field.id}
                className="group relative bg-white rounded-2xl p-1 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-full bg-white rounded-xl overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image
                      src={field.image || "/card-lapangan.jpg"}
                      alt={field.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="font-bold text-lg leading-tight">
                        {field.name}
                      </h4>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Owner's Take
                        </span>
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {field.bookingCount} Trx
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        Rp {field.totalOwnerRevenue.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
