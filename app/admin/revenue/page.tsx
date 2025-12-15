import { getRevenueData } from "@/lib/action";
import Link from "next/link";
import Image from "next/image";
import { BanknotesIcon, ChartBarIcon } from "@heroicons/react/24/solid";

export default async function RevenuePage() {
  const { fieldRevenues, totalAppRevenue } = await getRevenueData();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Revenue Dashboard 💰</h1>
        <p className="text-gray-500">Pantau pendapatan lapangan dan aplikasi disini.</p>
      </div>

      {/* CARD TOTAL REVENUE APLIKASI */}
      <div className="bg-gradient-to-r from-[#f64e42] to-[#d93d32] rounded-2xl p-8 text-white shadow-lg mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium opacity-90 mb-1">Total Pendapatan LapangIn</h2>
          <p className="text-sm opacity-75 mb-4">(Akumulasi Application Fee 10% + Kode Unik)</p>
          <h3 className="text-4xl font-bold">
            Rp {totalAppRevenue.toLocaleString("id-ID")}
          </h3>
        </div>
        <div className="bg-white/20 p-4 rounded-full">
            <BanknotesIcon className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* LIST REVENUE PER LAPANGAN */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ChartBarIcon className="w-6 h-6 text-[#f64e42]" />
        Pendapatan Per Lapangan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fieldRevenues.map((field) => (
          <Link 
            href={`/admin/revenue/${field.id}`} 
            key={field.id}
            className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-[#f64e42]"
          >
            <div className="p-5 flex gap-4 items-center border-b border-gray-100">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
                   <Image 
                     src={field.image} 
                     alt={field.name}
                     fill
                     className="object-cover"
                   />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 group-hover:text-[#f64e42] transition">
                        {field.name}
                    </h4>
                    <p className="text-xs text-gray-500">{field.bookingCount} Transaksi Berhasil</p>
                </div>
            </div>
            
            <div className="p-5 bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Total Pendapatan Lapangan</p>
                <p className="text-xl font-bold text-gray-900">
                    Rp {field.totalRevenue.toLocaleString("id-ID")}
                </p>
                <div className="mt-3 text-xs text-blue-600 font-medium flex items-center gap-1">
                    Lihat Histori Booking →
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}