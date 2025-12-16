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
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    // Mengirim input sebagai 'location' (sesuai fix logic sebelumnya)
    if (query) params.set("location", query);
    if (type && type !== "all") params.set("type", type);

    router.push(`/field?${params.toString()}`);
  };

  const dropdownBgColor = transparent ? "rgba(0, 0, 0, 0.8)" : "white";
  const dropdownTextColor = transparent ? "white" : "black";

  return (
    <>
      {/* CSS HACK GLOBAL: Memaksa style pada elemen <option> di dalam dropdown list. */}
      <style jsx global>{`
        /* Memaksa background gelap semi-transparan (best effort untuk Chrome) */
        select option {
          background-color: ${dropdownBgColor} !important;
          color: ${dropdownTextColor} !important;
        }
        /* Menghilangkan efek hover/focus default pada select element */
        select:focus,
        select:hover,
        select:active {
          box-shadow: none !important;
          outline: none !important;
          background-color: ${transparent
            ? "transparent"
            : "#f9fafb"} !important;
        }
      `}</style>

      <div
        className={`w-full mx-auto p-1.5 rounded-full flex flex-col md:flex-row items-center gap-2 transition-all ${
          transparent
            ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl"
            : "bg-white shadow-lg"
        }`}
      >
        {/* 1. INPUT SEARCH (TANPA HOVER MENGGANGGU) */}
        <div className="relative flex-1 w-full group">
          <MagnifyingGlassIcon
            className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${
              transparent ? "text-gray-200" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Location"
            className={`w-full pl-10 pr-4 py-2.5 rounded-full outline-none text-sm transition-colors 
              ${
                transparent
                  ? "bg-transparent text-white placeholder-gray-300" // focus:bg-white/10 (semi-transparan saat diklik)
                  : "bg-gray-50 text-gray-900 focus:bg-white"
              }
            `}
          />
        </div>

        {/* DIVIDER */}
        <div
          className={`hidden md:block w-px h-6 ${
            transparent ? "bg-white/30" : "bg-gray-200"
          }`}
        />

        {/* 2. DROPDOWN (TANPA HOVER MENGGANGGU) */}
        <div className="relative w-full md:w-40 group">
          <ChevronDownIcon
            className={`absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none transition-transform group-focus-within:rotate-180 ${
              transparent ? "text-gray-200" : "text-gray-500"
            }`}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            // 👇 Hapus class hover:bg-gray-100/focus:bg-white. Biarkan background-nya konsisten.
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

        {/* 3. BUTTON SEARCH (TANPA HOVER GILA) */}
        <button
          onClick={handleSearch}
          // Hover di sini tetap kita kasih, tapi di elemen input/select yang lo complain gua hilangkan
          className="w-full md:w-auto px-6 py-2.5 bg-[#f64e42] text-white text-sm font-medium rounded-full transition-all transform hover:scale-105 shadow-md whitespace-nowrap"
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );
}
