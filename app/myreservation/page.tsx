import { auth } from "@/auth";
import { getUserReservations } from "@/lib/data";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  StarIcon, // Tambah icon bintang
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import ReviewModal from "@/components/field/review-modal"; // Import Modal yang tadi dibuat

export default async function MyReservationPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  const reservations = await getUserReservations();

  // Helper function buat warna status (Punya lo tetep dipake)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID": return "LUNAS";
      case "UNPAID": return "MENUNGGU PEMBAYARAN";
      case "CANCELLED": return "DIBATALKAN";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Riwayat Booking Saya
        </h1>

        {reservations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              Belum ada bookingan nih, skuy main!
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-lapang-primary font-semibold hover:underline"
            >
              Cari Lapangan Dulu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((res) => {
               // LOGIC TAMBAHAN: Cek kondisi booking
               const isFinished = true;
               const isPaid = res.Payment?.status === "PAID";
               const hasReview = (res as any).Review; // Type assertion kalo TS protes

               return (
                <div
                  key={res.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6 sm:flex gap-6">
                    {/* Gambar Lapangan */}
                    <div className="relative h-32 w-full sm:w-48 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 mb-4 sm:mb-0">
                      <Image
                        src={res.Field.image || "/card-lapangan.jpg"}
                        alt={res.Field.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info Booking */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {res.Field.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {res.Field.address}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                            res.Payment?.status || "UNPAID"
                          )}`}
                        >
                          {getStatusLabel(res.Payment?.status || "UNPAID")}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          {new Date(res.startDate).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          {new Date(res.startDate).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -
                          {new Date(res.endDate).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <CreditCardIcon className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            Rp {res.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-gray-400 text-xs ml-2">
                            (Ref: {res.id.slice(0, 8).toUpperCase()})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* === FOOTER ACTION ZONE === */}
                  
                  {/* 1. Kalo UNPAID -> Munculin Konfirmasi WA */}
                  {res.Payment?.status === "UNPAID" && (
                    <div className="bg-yellow-50 px-6 py-3 border-t border-yellow-100 flex items-center justify-between">
                      <p className="text-xs text-yellow-800">
                        Menunggu pembayaran.
                      </p>
                      <Link
                        href="https://wa.me/6287889387992"
                        target="_blank"
                        className="text-xs font-bold text-yellow-700 hover:underline"
                      >
                        Bayar Sekarang &rarr;
                      </Link>
                    </div>
                  )}

                  {/* 2. Kalo PAID & SUDAH MAIN -> Munculin Review */}
                  {isPaid && isFinished && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between transition-colors hover:bg-gray-100">
                        {hasReview ? (
                            // Kalo udah review
                            <div className="flex items-center gap-2 w-full">
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                                    ✓ Ulasan Terkirim
                                </span>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <StarSolid key={i} className={`h-3 w-3 ${i < hasReview.rating ? "" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400 ml-auto italic truncate max-w-[200px]">
                                    "{hasReview.comment}"
                                </span>
                            </div>
                        ) : (
                            // Kalo BELUM review
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <StarIcon className="h-4 w-4 text-gray-400" />
                                    <p className="text-xs text-gray-600 font-medium">
                                        Gimana mainnya? Kasih bintang dong!
                                    </p>
                                </div>
                                {/* Panggil Component Modal Disini */}
                                <ReviewModal reservationId={res.id} fieldId={res.fieldId} />
                            </div>
                        )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}