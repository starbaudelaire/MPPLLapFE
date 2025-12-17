"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div
      className={`w-full mx-auto p-1.5 rounded-full flex flex-col md:flex-row items-center gap-1.5 transition-all ${
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

        {/* 2. DROPDOWN (Shadcn) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`w-full md:w-40 inline-flex items-center justify-between rounded-full px-3.5 py-2 text-xs font-medium transition-colors border ${
                transparent
                  ? "bg-white/10 border-white/30 text-white hover:bg-white/20"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-white"
              }`}
            >
              <span className="truncate">
                {type === "all"
                  ? "All types"
                  : type.replace("_", " ").toLowerCase()}
              </span>
              <span className="ml-2 text-[10px] text-gray-400">▼</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[160px] rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md p-1 shadow-soft text-xs"
          >
            {[
              { value: "all", label: "All types" },
              { value: "FUTSAL", label: "Futsal" },
              { value: "BASKETBALL", label: "Basketball" },
              { value: "BADMINTON", label: "Badminton" },
              { value: "MINI_SOCCER", label: "Mini Soccer" },
              { value: "TENNIS", label: "Tennis" },
              { value: "VOLLEYBALL", label: "Volleyball" },
            ].map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => setType(item.value)}
                className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 cursor-pointer transition-colors ${
                  type === item.value
                    ? "bg-brand/10 text-brand"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 3. BUTTON SEARCH */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-5 py-2 bg-[#0A84FF] text-white text-xs font-semibold rounded-full transition-all shadow-soft hover:bg-[#0666cc] whitespace-nowrap"
        >
          {buttonLabel}
        </button>
      </div>
  );
}
