import Image from "next/image";
import Link from "next/link";
import { Field } from "@prisma/client"; // Pake tipe data asli dari Prisma
import { MapPinIcon } from "@heroicons/react/24/outline";

interface CardProps {
  field: Field;
}

const Card = ({ field }: CardProps) => {
  return (
    <Link href={`/field/${field.id}`} className="block group h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
        {/* Bagian Gambar */}
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={field.image || "/card-lapangan.jpg"} // Fallback image biar ga broken
            alt={field.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge Tipe Olahraga */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm uppercase tracking-wide">
            {field.type.replace("_", " ")}
          </div>
        </div>

        {/* Bagian Konten Bawah */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#f64e42] transition-colors line-clamp-1">
              {field.name}
            </h3>
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
