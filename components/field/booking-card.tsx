"use client";

import { useState } from "react";
// Import Server Action yang udah kita gabungin di action.ts
import { createReservation } from "@/lib/action";

// Jam operasional dummy
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

interface BookingCardProps {
  pricePerHour: number;
  fieldId: string;
  userId?: string; // Tambahin ini biar bisa nerima ID user yg login
}

export default function BookingCard({
  pricePerHour,
  fieldId,
  userId,
}: BookingCardProps) {
  const [date, setDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false); // Buat loading state

  // Handle pilih jam (toggle selection)
  const handleTimeClick = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const totalPrice = selectedTimes.length * pricePerHour;

  const handleBooking = async () => {
    if (!date || selectedTimes.length === 0)
      return alert("Pilih tanggal & jam dulu bos!");
    if (!userId) return alert("Login dulu bro sebelum booking!");

    setIsBooking(true);

    // Kita cari jam paling awal (start) dan jam paling akhir (end) dari pilihan user
    // Note: Logic ini sederhana (asumsi jamnya urut/bersambung).
    // Kalo mau canggih, harus divalidasi biar jamnya gak loncat-loncat.
    const sortedTimes = [...selectedTimes].sort();
    const startTimeStr = sortedTimes[0];
    // End time itu jam terakhir + 1 jam (misal main jam 10:00 - 11:00, berarti end-nya 11:00)
    const endTimeStr = sortedTimes[sortedTimes.length - 1];

    // Konversi jam string (08:00) jadi angka buat nambahin durasi
    const endHour = parseInt(endTimeStr.split(":")[0]) + 1;
    const formattedEndTime = `${endHour < 10 ? "0" + endHour : endHour}:00`;

    // Bikin FormData manual buat dikirim ke Server Action
    const formData = new FormData();
    formData.append("fieldId", fieldId);
    formData.append("userId", userId);

    // Gabungin Tanggal + Jam jadi format ISO Date lengkap
    // Contoh: 2025-12-12T08:00:00.000Z
    formData.append("startDate", `${date}T${startTimeStr}:00.000Z`);
    formData.append("endDate", `${date}T${formattedEndTime}:00.000Z`);

    formData.append("price", totalPrice.toString());

    // Panggil Server Action 'createReservation' dari lib/action.ts
    const result = await createReservation(formData);

    if (result?.error) {
      alert(result.error); // Munculin error kalo gagal (misal udah dibooking)
      setIsBooking(false);
    }
    // Kalo sukses, dia bakal redirect otomatis dari server action, jadi gak perlu ngapa-ngapain.
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
          disabled={!date || selectedTimes.length === 0 || isBooking}
          className="w-full bg-[#f64e42] text-white font-bold py-3 rounded-lg hover:bg-[#d93d32] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
        >
          {isBooking ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          ) : null}
          {isBooking ? "Memproses..." : "Booking Sekarang"}
        </button>
        <p className="text-xs text-center text-gray-400 mt-3">
          Belum dikenakan biaya admin.
        </p>
      </div>
    </div>
  );
}
