"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface SearchFilterProps {
  transparent?: boolean;
  buttonLabel?: string;
}

export default function SearchFilter({
  transparent = false,
  buttonLabel = "Start Now",
}: SearchFilterProps) {
  const router = useRouter();
  // Menggunakan 'query' untuk menyimpan input lokasi
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    // 👇 FIX: Mengirim input sebagai 'location' (bukan 'query')
    if (query) params.set("location", query);
    if (type && type !== "all") params.set("type", type);

    router.push(`/field?${params.toString()}`);
  };

  return (
    <>
      {/* CSS HACK: Ini membuat option list jadi putih solid, yang paling aman buat dibaca */}
      <style jsx global>{`
        /* Menghilangkan efek hover/focus aneh pada select element */
        select:focus,
        select:hover {
          box-shadow: none !important;
          outline: none !important;
        }
        /* Memaksa background putih pada list opsi */
        select option {
          background-color: white !important;
          color: black !important;
        }
      `}</style>

      <div
        className={`w-full mx-auto p-1.5 rounded-full flex flex-col md:flex-row items-center gap-2 transition-all ${
          transparent
            ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl"
            : "bg-white shadow-lg"
        }`}
      >
        {/* 1. INPUT SEARCH (Lokasi) */}
        <div className="relative flex-1 w-full group">
          <MagnifyingGlassIcon
            className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${
              transparent
                ? "text-gray-200 group-focus-within:text-white"
                : "text-gray-400"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location"
            className={`w-full pl-10 pr-4 py-2.5 rounded-full outline-none text-sm transition-colors ${
              transparent
                ? "bg-transparent text-white placeholder-gray-300 focus:bg-white/10"
                : "bg-gray-50 text-gray-900 focus:bg-white"
            }`}
          />
        </div>

        {/* DIVIDER */}
        <div className="hidden md:block w-px h-6 bg-white/30" />

        {/* 2. DROPDOWN (Tipe Lapangan) */}
        <div className="relative w-full md:w-40 group">
          <ChevronDownIcon
            className={`absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none transition-transform group-focus-within:rotate-180 ${
              transparent ? "text-gray-200" : "text-gray-500"
            }`}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            // 👇 Styling untuk Dropdown Ramping
            className={`w-full appearance-none pl-4 pr-8 py-2.5 rounded-full outline-none text-sm cursor-pointer transition-colors ${
              transparent
                ? "bg-transparent text-white focus:bg-white/10"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            <option value="all">Types</option>
            <option value="FUTSAL">Futsal</option>
            <option value="BASKETBALL">Basket</option>
            <option value="BADMINTON">Badminton</option>
            <option value="MINI_SOCCER">Mini Soccer</option>
            <option value="TENNIS">Tennis</option>
            <option value="VOLLEYBALL">Volleyball</option>
          </select>
        </div>

        {/* 3. BUTTON SEARCH */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-2.5 bg-[#f64e42] hover:bg-[#d63d32] text-white text-sm font-medium rounded-full transition-all transform hover:scale-105 shadow-md whitespace-nowrap"
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );
}
