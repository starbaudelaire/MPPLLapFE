import Image from "next/image";
import Link from "next/link";
// Import tipe Review juga biar gak error TypeScript
import { Field, Review } from "@prisma/client"; 
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";

interface CardProps {
  // Kita kasih tau kalo field ini punya data Reviews didalemnya
  field: Field & { Reviews: Review[] };
}

const Card = ({ field }: CardProps) => {
  // 1. Logic Hitung Rata-Rata Bintang 🌟
  const totalRating = field.Reviews.reduce((acc, review) => acc + review.rating, 0);
  const reviewCount = field.Reviews.length;
  const avgRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0";

  return (
    <Link href={`/field/${field.id}`} className="block group h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
        {/* Bagian Gambar */}
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={field.image || "/card-lapangan.jpg"}
            alt={field.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm uppercase tracking-wide">
            {field.type.replace("_", " ")}
          </div>
          
          {/* ✅ TAMBAHAN: Badge Rating di Pojok Kanan Atas Gambar */}
          {reviewCount > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
              <StarIcon className="h-3 w-3 text-yellow-500" />
              <span>{avgRating}</span>
              <span className="text-gray-400 font-normal">({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Bagian Konten Bawah */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#f64e42] transition-colors line-clamp-1">
                {field.name}
                </h3>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <MapPinIcon className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
              <span className="truncate">{field.address}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Harga per jam</span>
              <span className="font-bold text-[#f64e42]">
                Rp {field.pricePerHour.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 group-hover:bg-[#f64e42] group-hover:text-white transition-colors">
              Book Now
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;