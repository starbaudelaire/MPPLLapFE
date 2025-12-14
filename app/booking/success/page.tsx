import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  // Ambil ID reservasi dari URL (dikirim dari action.ts)
  const params = await searchParams;
  const reservationId = params.id || "-";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 pt-16">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
        {/* Icon Sukses */}
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-20 w-20 text-green-500 animate-bounce" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Berhasil!
        </h1>
        <p className="text-gray-500 mb-6">
          Mantap! Lapangan udah diamankan buat kamu. Jangan lupa datang tepat waktu ya.
        </p>

        {/* Kotak Info ID */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
            Kode Reservasi
          </p>
          <p className="text-lg font-mono font-bold text-gray-800 break-all">
            {reservationId}
          </p>
        </div>

        {/* Tombol Navigasi */}
        <div className="space-y-3">
          <Link 
            href="/myreservation"
            className="block w-full py-3 px-4 bg-[#f64e42] text-white font-medium rounded-lg hover:bg-[#d93d32] transition shadow-md shadow-orange-200"
          >
            Lihat Jadwal Saya
          </Link>
          <Link 
            href="/"
            className="block w-full py-3 px-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}