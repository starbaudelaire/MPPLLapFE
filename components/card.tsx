import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid"; // Pake StarIcon Solid

export default function Card({ field }: { field: any }) {
  // 1. Logic Hitung Rata-rata
  const totalReview = field.Reviews?.length || 0;
  const averageRating =
    totalReview > 0
      ? field.Reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        totalReview
      : 0;

  return (
    <Link href={`/field/${field.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image Wrapper */}
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={field.image || "/card-lapangan.jpg"}
            alt={field.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge Tipe */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
            {field.type.replace("_", " ")}
          </div>
          
          {/* 👇 2. Badge Rating (Posisi di kanan atas gambar) */}
          {totalReview > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <StarIcon className="h-3 w-3 text-yellow-500" />
              <span className="text-xs font-bold text-gray-800">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-500">
                ({totalReview})
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
              {field.name}
            </h3>
            <p className="font-bold text-blue-600 text-sm whitespace-nowrap">
              Rp {field.pricePerHour.toLocaleString("id-ID")}/Jam
            </p>
          </div>

          <div className="flex items-center text-gray-500 text-sm gap-1 mb-3">
            <MapPinIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="truncate">{field.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}