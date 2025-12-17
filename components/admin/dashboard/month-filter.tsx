"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

interface MonthFilterProps {
  currentMonth: number; // 1 - 12
  currentYear: number;
}

export default function MonthFilter({
  currentMonth,
  currentYear,
}: MonthFilterProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Format Value buat Input Month (YYYY-MM)
  const inputValue = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  // Helper: Pindah Bulan
  const handleNavigate = (direction: "prev" | "next") => {
    let newMonth = direction === "next" ? currentMonth + 1 : currentMonth - 1;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    router.push(`/admin/dashboard?month=${newMonth}&year=${newYear}`);
  };

  // Helper: Pilih dari Picker
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // "2025-02"
    if (val) {
      const [y, m] = val.split("-").map(Number);
      router.push(`/admin/dashboard?month=${m}&year=${y}`);
    }
  };

  // Format Tampilan (ex: "October 2025")
  const displayDate = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(currentYear, currentMonth - 1));

  return (
    <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-full p-1.5 gap-2 transition-all hover:shadow-md">
      {/* PREV MONTH */}
      <button
        onClick={() => handleNavigate("prev")}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
        title="Previous Month"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* CENTER PILL (Month Picker) */}
      <div className="relative group">
        <div
          onClick={() => inputRef.current?.showPicker()}
          className="flex items-center gap-3 px-6 py-2.5 border-gray-100 group-hover:border-gray-300 transition-all active:scale-95"
        >
          <CalendarDaysIcon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-light text-gray-900 whitespace-nowrap min-w-[120px] text-center select-none tracking-wide">
            {displayDate}
          </span>
        </div>

        {/* Input Month Native */}
        <input
          type="month"
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full -z-10"
        />
      </div>

      {/* NEXT MONTH */}
      <button
        onClick={() => handleNavigate("next")}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
        title="Next Month"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
