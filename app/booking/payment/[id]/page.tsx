import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PaymentForm from "./payment-form";
import Image from "next/image";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  TicketIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  // 1. Ambil Data Reservasi
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      Field: true,
      Payment: true,
      User: true,
    },
  });

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-500">Booking not found.</p>
        </div>
      </div>
    );
  }

  // Format Tanggal & Jam
  const dateStr = new Date(reservation.startDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStart = new Date(reservation.startDate).toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const timeEnd = new Date(reservation.endDate).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const duration =
    (new Date(reservation.endDate).getTime() -
      new Date(reservation.startDate).getTime()) /
    (1000 * 60 * 60);

  return (
    // 👇 FIX DISINI BOS: Tambahin pt-24 biar gak ketimpa navbar
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Simple */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-[#f64e42] mb-6 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to Home
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* KOLOM KIRI: Invoice Detail */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Gambar Lapangan */}
              <div className="relative h-56 w-full">
                <Image
                  src={reservation.Field.image || "/card-lapangan.jpg"}
                  alt={reservation.Field.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-1">
                    {reservation.Field.name}
                  </h2>
                  <div className="flex items-center text-sm font-medium opacity-90">
                    <MapPinIcon className="w-4 h-4 mr-1.5" />
                    {reservation.Field.address}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* Grid Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-sm">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Date
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {dateStr}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-600 shadow-sm">
                      <ClockIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Time
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {timeStart} - {timeEnd}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {duration} Hours Session
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-600 shadow-sm">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Player
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {reservation.User.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {reservation.User.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm">
                      <TicketIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Booking Ref
                      </p>
                      <p className="font-mono font-bold text-gray-900 text-lg tracking-wider">
                        #{reservation.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200"></div>

                {/* Rincian Harga */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Court Price{" "}
                      <span className="text-xs text-gray-400">
                        ({duration}h x Rp {reservation.price.toLocaleString()})
                      </span>
                    </span>
                    <span className="font-medium">
                      Rp {reservation.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Platform Fee</span>
                    <span className="font-medium">
                      Rp{" "}
                      {(
                        reservation.Payment?.amount! -
                        reservation.price -
                        (reservation.Payment?.amount! % 1000)
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Unique Code</span>
                    <span className="font-medium text-orange-500">
                      Rp {reservation.Payment?.amount! % 1000}
                    </span>
                  </div>

                  <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      Total Bill
                    </span>
                    <span className="text-3xl font-extrabold text-[#f64e42]">
                      Rp {reservation.Payment?.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Form Pembayaran (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Payment Method
              </h3>
              <PaymentForm reservationId={reservation.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
