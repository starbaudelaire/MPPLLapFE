import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingCard from "@/components/field/booking-card"; // Pake yang udah fix
import ReviewList from "@/components/field/review-list"; // Dari branch review
import { auth } from "@/auth";

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
      FieldAmenities: { include: { amenity: true } },
      Reviews: { include: { user: true }, orderBy: { createdAt: "desc" } }, // Tarik review juga
    },
  });

  if (!field) return notFound();

  // Hitung Rating Rata-rata
  const avgRating =
    field.Reviews.length > 0
      ? field.Reviews.reduce((acc, curr) => acc + curr.rating, 0) /
        field.Reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Atas: Foto & Judul */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-6">
            <Image
              src={field.image || "/hero.jpg"}
              alt={field.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{field.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {field.type}
                </span>
                <span>
                  ⭐ {avgRating.toFixed(1)} ({field.Reviews.length} Reviews)
                </span>
              </div>
              <p className="mt-4 text-gray-600 max-w-2xl">
                {field.description}
              </p>
              <p className="mt-2 text-gray-500 flex items-center gap-1">
                📍 {field.address}
              </p>
            </div>
          </div>
        </div>

        {/* Bawah: Grid Booking & Review */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Review & Amenities (Lebar 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fasilitas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Fasilitas</h3>
              <div className="flex flex-wrap gap-2">
                {field.FieldAmenities.map((fa) => (
                  <span
                    key={fa.amenitiesId}
                    className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700"
                  >
                    ✅ {fa.amenity.name}
                  </span>
                ))}
              </div>
            </div>

            {/* List Review */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Ulasan Pengguna</h3>
              <ReviewList
                reviews={field.Reviews}
                fieldId={field.id}
                canReview={!!session} // Cuma user login yg bisa review
              />
            </div>
          </div>

          {/* Kolom Kanan: Booking Card (Lebar 1 - Sticky) */}
          <div className="lg:col-span-1">
            <BookingCard
              pricePerHour={field.pricePerHour}
              fieldId={field.id}
              userId={session?.user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
