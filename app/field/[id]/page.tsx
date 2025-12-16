import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingCard from "@/components/field/booking-card";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import ReviewList from "@/components/field/review-list";
export const dynamic = "force-dynamic";

const SportBadge = ({ type }: { type: string }) => {
  const colors: Record<string, string> = {
    FUTSAL: "bg-blue-100 text-blue-800",
    BASKETBALL: "bg-orange-100 text-orange-800",
    BADMINTON: "bg-green-100 text-green-800",
    MINI_SOCCER: "bg-emerald-100 text-emerald-800",
    TENNIS: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
        colors[type] || "bg-gray-100"
      }`}
    >
      {type.replace("_", " ")}
    </span>
  );
};

export default async function FieldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  const field = await prisma.field.findUnique({
    where: { id },
    include: {
      FieldAmenities: {
        include: { Amenities: true },
      },
      // 👇 PERBAIKAN DI SINI (SESUAI SCHEMA)
      Reviews: {
        // 1. Pake Huruf Besar 'Reviews'
        orderBy: { createdAt: "desc" },
        include: { user: true }, // 2. Pake Huruf Kecil 'user' (cek model Review lo)
      },
    },
  });

  if (!field) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-gray-900">
        <Image
          src={field.image || "/hero.jpg"}
          alt={field.name}
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 mb-2">
              <SportBadge type={field.type} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm">
              {field.name}
            </h1>
            <div className="flex items-center text-gray-200 gap-2 text-sm md:text-base">
              <MapPinIcon className="h-5 w-5 text-[#f64e42]" />
              {field.address || "Lokasi tidak tersedia"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deskripsi */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tentang Lapangan
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                {field.description}
              </div>
            </div>

            {/* Fasilitas */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Fasilitas
              </h2>
              {field.FieldAmenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {field.FieldAmenities.map((item) => (
                    <div
                      key={item.amenitiesId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="h-2 w-2 rounded-full bg-[#f64e42]" />
                      <span className="text-gray-700 font-medium text-sm">
                        {item.Amenities.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  Belum ada data fasilitas.
                </p>
              )}
            </div>

            {/* 👇 PERBAIKAN DI SINI JUGA */}
            <div className="mt-8">
              {/* Panggil field.Reviews (Huruf Besar) */}
              <ReviewList reviews={field.Reviews} />
            </div>
          </div>

          {/* Right Column: Booking Card (1/3 width) */}
          <div className="relative">
            <BookingCard
              pricePerHour={field.pricePerHour}
              fieldId={field.id}
              userId={session?.user?.id}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
