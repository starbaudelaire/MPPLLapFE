"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline"; // Pastikan install @heroicons/react

export default function SearchFilter() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [sportType, setSportType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // Kita push ke URL query params, nanti halaman list yang baca params ini
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (sportType) params.set("type", sportType);
    if (location) params.set("location", location);

    router.push(`/field?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-xl w-full max-w-4xl mx-auto -mt-10 relative z-20 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Input Tanggal */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarIcon className="h-5 w-5 text-gray-400 group-focus-within:text-lapang-primary" />
          </div>
          <input
            type="date"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lapang-primary focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Dropdown Tipe Olahraga (Sesuai Enum Prisma) */}
        <div className="relative">
          <select
            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lapang-primary focus:border-transparent outline-none text-gray-700 appearance-none bg-white transition-all"
            onChange={(e) => setSportType(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Pilih Olahraga</option>
            <option value="FUTSAL">Futsal</option>
            <option value="BASKETBALL">Basket</option>
            <option value="BADMINTON">Badminton</option>
            <option value="MINI_SOCCER">Mini Soccer</option>
            <option value="TENNIS">Tenis</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Input Lokasi */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400 group-focus-within:text-lapang-primary" />
          </div>
          <input
            type="text"
            placeholder="Cari Lokasi..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lapang-primary focus:border-transparent outline-none text-gray-700 transition-all"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Tombol Search */}
        <button
          onClick={handleSearch}
          className="w-full bg-[#f64e42] hover:bg-[#d93d32] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center gap-2 active:scale-95"
        >
          <MagnifyingGlassIcon className="h-5 w-5 font-bold" />
          Cari Lapangan
        </button>
      </div>
    </div>
  );
}