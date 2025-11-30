import Image from "next/image";
import Link from "next/link";
import { IoPeopleOutline } from "react-icons/io5";

const Card = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl transition duration-200 hover:shadow-lg overflow-hidden">
      <div className="h-[260px] w-auto relative">
        <Image
          src="/card-lapangan.jpg"
          width={384}
          height={256}
          alt="room image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h4 className="text-2xl font-semibold">
          <Link
            href="#"
            className="hover:text-gray-800 transition duration-150"
          >
            Pelle Basketball
          </Link>
        </h4>
        <h4 className="text-lg mb-6">
          <span className="font-semibold text-gray-700">Rp 150.000</span>
          <span className="text-gray-500 text-sm">/Hour</span>
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <IoPeopleOutline />
            <span className="text-sm">Up to 12 people</span>
          </div>
          <Link
            href="/lapangan/id-lapangan"
            className="text-[#f64e42] text-lg font-normal hover:underline"
          >
            Book &gt;
          </Link>
        </div>import Image from "next/image";
import Link from "next/link";
import { IoPeopleOutline } from "react-icons/io5";
import { Field } from "@prisma/client"; // Import tipe data dari Prisma

// Card menerima props data 'field'
const Card = ({ field }: { field: Field }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl transition duration-200 hover:shadow-xl hover:-translate-y-1 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="h-[240px] w-full relative bg-gray-200">
        <Image
          src={field.image || "/card-lapangan.jpg"} // Fallback image
          alt={field.name}
          fill
          className="w-full h-full object-cover"
        />
        {/* Badge Tipe Olahraga */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-lapang-dark shadow-sm">
          {field.type.replace("_", " ")}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h4 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
            <Link href={`/field/${field.id}`} className="hover:text-[#f64e42] transition">
              {field.name}
            </Link>
          </h4>
          <p className="text-sm text-gray-500 mb-4 line-clamp-1">
             {field.address || "Lokasi belum diatur"}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-2">
           <div className="flex items-end justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Harga mulai</span>
                <span className="font-bold text-lg text-[#f64e42]">
                  Rp {field.pricePerHour.toLocaleString("id-ID")}
                </span>
                <span className="text-gray-400 text-xs">/jam</span>
              </div>
              
              <Link
                href={`/field/${field.id}`}
                className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-[#f64e42] transition-colors"
              >
                Book
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
      </div>
    </div>
  );
};

export default Card;
