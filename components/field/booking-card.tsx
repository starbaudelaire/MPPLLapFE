"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils"; // Asumsi ada helper, kalau tidak nanti kita buat inline

// Jam operasional dummy (bisa diganti logic real nanti)
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
  "20:00", "21:00"
];

interface BookingCardProps {
  pricePerHour: number;
  fieldId: string;
}

export default function BookingCard({ pricePerHour, fieldId }: BookingCardProps) {
  const [date, setDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // Handle pilih jam (toggle selection)
  const handleTimeClick = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const totalPrice = selectedTimes.length * pricePerHour;

  const handleBooking = () => {
    if (!date || selectedTimes.length === 0) return;
    alert(`Booking initiated! \nDate: ${date} \nSlots: ${selectedTimes.join(", ")}`);
    // Di sini nanti panggil Server Action untuk create Reservation
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-sm text-gray-500 font-medium">Harga per jam</p>
          <h3 className="text-2xl font-bold text-lapang-dark">
            Rp {pricePerHour.toLocaleString("id-ID")}
          </h3>
        </div>
      </div>

      {/* 1. Pilih Tanggal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Tanggal Main
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#f64e42] focus:border-transparent outline-none"
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* 2. Pilih Jam (Grid Layout) */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Jam Kosong
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              className={`text-sm py-2 rounded-md border transition-all ${
                selectedTimes.includes(time)
                  ? "bg-[#f64e42] text-white border-[#f64e42]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#f64e42] hover:text-[#f64e42]"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        {selectedTimes.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {selectedTimes.length} jam dipilih
          </p>
        )}
      </div>

      {/* 3. Total & Action */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-xl text-[#f64e42]">
            Rp {totalPrice.toLocaleString("id-ID")}
          </span>
        </div>
        <button
          onClick={handleBooking}
          disabled={!date || selectedTimes.length === 0}
          className="w-full bg-[#f64e42] text-white font-bold py-3 rounded-lg hover:bg-[#d93d32] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Booking Sekarang
        </button>
        <p className="text-xs text-center text-gray-400 mt-3">
          Belum dikenakan biaya admin.
        </p>
      </div>
    </div>
  );
}