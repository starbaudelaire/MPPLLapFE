"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function SearchFilter() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [sportType, setSportType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (sportType) params.set("type", sportType);
    if (location) params.set("location", location);

    // FIX DISINI BOS:
    // Ganti "/field" jadi "/" biar dia nembak ke HOME yang udah siap logic search-nya
    router.push(`/?${params.toString()}`);
  };

  return (
    // ... (Sisa codingan UI sama persis kayak sebelumnya, gak usah diubah)
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-5xl mx-auto mt-8 mb-8 relative z-10 border border-gray-100">
      {/* Header Kecil biar manis */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Cari Lapangan</h3>
        <p className="text-sm text-gray-500">
          Isi filter di bawah buat nemuin lapangan yang pas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Input Tanggal (Span 3) */}
        <div className="md:col-span-3 relative group">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">
            Tanggal Main
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400 group-focus-within:text-lapang-primary" />
            </div>
            <input
              type="date"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lapang-primary focus:border-transparent outline-none text-gray-700 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Dropdown Tipe (Span 3) */}
        <div className="md:col-span-3 relative">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">
            Jenis Olahraga
          </label>
          <div className="relative">
            <select
              className="block w-full px-4 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lapang-primary focus:border-transparent outline-none text-gray-700 appearance-none transition-all bg-gray-50 focus:bg-white"
              onChange={(e) => setSportType(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Pilih Olahraga
              </option>
              <option value="FUTSAL">Futsal</option>
              <option value="BASKETBALL">Basket</option>
              <option value="BADMINTON">Badminton</option>
              <option value="MINI_SOCCER">Mini Soccer</option>
              <option value="TENNIS">Tenis</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Input Lokasi (Span 4) */}
        <div className="md:col-span-4 relative group">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">
            Lokasi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400 group-focus-within:text-lapang-primary" />
            </div>
            <input
              type="text"
              placeholder="Misal: Jakarta Selatan"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lapang-primary focus:border-transparent outline-none text-gray-700 transition-all bg-gray-50 focus:bg-white"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Tombol Search (Span 2) */}
        <div className="md:col-span-2">
          <button
            onClick={handleSearch}
            className="w-full h-[50px] bg-[#f64e42] hover:bg-[#d93d32] text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center gap-2 active:scale-95"
          >
            <MagnifyingGlassIcon className="h-5 w-5 font-bold" />
            Cari
          </button>
        </div>
      </div>
    </div>
  );
}
