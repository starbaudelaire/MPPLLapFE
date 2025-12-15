"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function SearchFilter() {
  const router = useRouter();
  const [sportType, setSportType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (sportType) params.set("type", sportType);
    if (location) params.set("location", location);

    // UX Logic: Tetep tembak ke halaman /field biar konsisten
    router.push(`/field?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-5xl mx-auto mt-8 mb-8 relative z-10 border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Cari Lapangan</h3>
        <p className="text-sm text-gray-500">
          Temukan lapangan olahraga favoritmu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Dropdown Tipe */}
        <div className="md:col-span-4 relative">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">
            Jenis Olahraga
          </label>
          <div className="relative">
            <select
              className="block w-full px-4 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f64e42] focus:border-transparent outline-none text-gray-700 appearance-none transition-all bg-gray-50 focus:bg-white"
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

        {/* Input Lokasi */}
        <div className="md:col-span-6 relative group">
          <label className="text-xs font-semibold text-gray-500 mb-1 block ml-1">
            Lokasi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#f64e42]" />
            </div>
            <input
              type="text"
              placeholder="Misal: Jakarta Selatan"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f64e42] focus:border-transparent outline-none text-gray-700 transition-all bg-gray-50 focus:bg-white"
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Tombol Search - HARDCODE WARNA MERAH */}
        <div className="md:col-span-2">
          <button
            onClick={handleSearch}
            className="w-full h-[50px] bg-[#f64e42] hover:bg-[#d93d32] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            <MagnifyingGlassIcon className="h-5 w-5 font-bold" />
            Cari
          </button>
        </div>
      </div>
    </div>
  );
}
