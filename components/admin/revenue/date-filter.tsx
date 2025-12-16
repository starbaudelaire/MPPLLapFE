"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

export default function DateFilter({
  currentDateStr,
}: {
  currentDateStr: string;
}) {
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Helper: Pindah Hari (Prev/Next)
  const handleNavigate = (direction: "prev" | "next") => {
    const date = new Date(currentDateStr);
    date.setDate(date.getDate() + (direction === "next" ? 1 : -1));
    const newDateStr = date.toISOString().split("T")[0];
    router.push(`/admin/revenue?date=${newDateStr}`);
  };

  // Helper: Pilih dari Kalender
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      router.push(`/admin/revenue?date=${newDate}`);
    }
  };

  // Trigger Kalender biar muncul
  const openCalendar = () => {
    try {
      dateInputRef.current?.showPicker(); // API Modern Browser
    } catch (error) {
      dateInputRef.current?.click(); // Fallback
    }
  };

  // Format Tanggal Cantik (ex: "Senin, 12 Okt 2025")
  const displayDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(currentDateStr));

  return (
    <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-full p-1.5 gap-2 transition-all hover:shadow-md">
      {/* PREV BUTTON */}
      <button
        onClick={() => handleNavigate("prev")}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
        title="Previous Day"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* CENTER PILL (THE CALENDAR TRIGGER) */}
      <div className="relative group">
        {/* Tampilan Luar (Kosmetik) */}
        <div
          onClick={openCalendar}
          className="flex items-center gap-3 px-6 py-2.5 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-full border border-gray-100 group-hover:border-gray-300 transition-all active:scale-95"
        >
          <CalendarDaysIcon className="w-5 h-5 text-[#f64e42] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap min-w-[140px] text-center select-none">
            {displayDate}
          </span>
        </div>

        {/* Input Asli (Ngumpet tapi kerjanya penting) */}
        <input
          type="date"
          ref={dateInputRef}
          value={currentDateStr}
          onChange={handleDateChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full -z-10"
        />
      </div>

      {/* NEXT BUTTON */}
      <button
        onClick={() => handleNavigate("next")}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
        title="Next Day"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
