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
        </div>
      </div>
    </div>
  );
};

export default Card;
