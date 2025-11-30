import { getUserReservations } from "@/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function MyReservationPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  const reservations = await getUserReservations();

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jadwal Saya</h1>
        <p className="text-gray-500 mb-8">Kelola riwayat booking lapanganmu di sini.</p>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          {reservations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                {/* Icon Calendar Empty */}
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Belum ada booking</h3>
              <p className="mt-1 text-gray-500">Mulai olahraga dengan membooking lapangan sekarang.</p>
              <div className="mt-6">
                <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#f64e42] hover:bg-[#d93d32]">
                  Cari Lapangan
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {reservations.map((res) => {
                const statusColor = 
                  res.Payment?.status === "paid" ? "bg-green-100 text-green-800" : 
                  res.Payment?.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"; // unpaid

                return (
                  <li key={res.id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-4">
                      {/* Image Thumbnail */}
                      <div className="flex-shrink-0 h-16 w-16 relative rounded-lg overflow-hidden bg-gray-200">
                         <Image 
                            src={res.Field.image || "/card-lapangan.jpg"} 
                            alt={res.Field.name}
                            fill
                            className="object-cover"
                         />
                      </div>
                      
                      {/* Info Booking */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {res.Field.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(res.startDate).toLocaleDateString("id-ID", {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(res.startDate).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'})} - {new Date(res.endDate).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'})} WIB
                        </p>
                      </div>

                      {/* Status & Price */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor}`}>
                          {res.Payment?.status || "Unpaid"}
                        </span>
                        <div className="text-sm font-bold text-gray-900">
                          Rp {res.price.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}