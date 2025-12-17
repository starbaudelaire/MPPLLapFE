"use client";

import { useState, useEffect } from "react";
import { createReservation, getBookedHours } from "@/lib/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  "22:00",
];

interface BookingCardProps {
  pricePerHour: number;
  fieldId: string;
  userId?: string;
}

export default function BookingCard({
  pricePerHour,
  fieldId,
  userId,
}: BookingCardProps) {
  const [date, setDate] = useState("");
  const [teamName, setTeamName] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (date) {
        setLoadingSlots(true);
        setSelectedTimes([]);
        // Panggil Server Action buat cek slot
        const booked = await getBookedHours(fieldId, date);
        setBookedSlots(booked);
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [date, fieldId]);

  // Cek kalau jam udah lewat (biar gak bisa dibooking)
  const isTimePassed = (time: string) => {
    if (!date) return false;
    const now = new Date();
    const slotDate = new Date(`${date}T${time}:00`);
    return slotDate < now;
  };

  const handleTimeClick = (time: string) => {
    // Gabungan logic: Booked atau Lewat -> Gak bisa diklik
    if (bookedSlots.includes(time) || isTimePassed(time)) return;

    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  // Itung-itungan Duit & Jam
  const totalHours = selectedTimes.length;
  const totalPrice = totalHours * pricePerHour;

  const handleBooking = async () => {
    if (!date || selectedTimes.length === 0) return;
    if (!userId) return;

    setIsBooking(true);

    // Ambil jam paling awal
    const sortedTimes = [...selectedTimes].sort();
    const startTimeStr = sortedTimes[0];

    const formData = new FormData();
    formData.append("fieldId", fieldId);
    formData.append("userId", userId);
    formData.append("startDate", `${date}T${startTimeStr}`);
    formData.append("teamName", teamName);

    // [PENTING] Kirim durasi jam ke server!
    formData.append("hours", totalHours.toString());
    formData.append("price", totalPrice.toString());

    const result = await createReservation(formData);

    if (result?.error) {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 sticky top-24">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-sm text-gray-500 font-medium">Harga per jam</p>
          <h3 className="text-2xl font-bold text-gray-900">
            Rp {pricePerHour.toLocaleString("id-ID")}
          </h3>
        </div>
      </div>

      {/* Team Name */}
      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Team Name
        </label>
        <Input
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      {/* Input Tanggal */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Tanggal Main
        </label>
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#f64e42] focus:border-transparent outline-none transition-all"
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Grid Jam */}
      <div className="mb-8">
        <label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
          <span>Pilih Jam Kosong</span>
          {loadingSlots && (
            <span className="text-xs text-[#f64e42] animate-pulse">
              Cek jadwal...
            </span>
          )}
        </label>

        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isPassed = isTimePassed(time);
            const isSelected = selectedTimes.includes(time);
            const isDisabled = isBooked || isPassed;

            return (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                disabled={isDisabled}
                className={`
                  text-sm py-2 rounded-md border transition-all relative overflow-hidden font-medium
                  ${
                    isDisabled
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-[#f64e42] text-white border-[#f64e42] shadow-md transform scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#f64e42] hover:text-[#f64e42]"
                  }
                `}
              >
                {time}
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-gray-300 rotate-45 transform"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-gray-300 rotate-45 transform"></div>
                </div>
            </div>
            Tidak Tersedia
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#f64e42] rounded"></div>
            Pilihanmu
          </div>
        </div>

        {selectedTimes.length > 0 && (
          <p className="text-xs text-gray-500 mt-2 font-medium">
            {selectedTimes.length} jam dipilih
          </p>
        )}
      </div>

      {/* Total & Button */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-xl text-[#f64e42]">
            Rp {totalPrice.toLocaleString("id-ID")}
          </span>
        </div>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="w-full shadow-soft"
              disabled={
                !date || selectedTimes.length === 0 || isBooking || !userId
              }
            >
              {isBooking ? "Processing..." : "Book Now"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Please review your booking details before continuing to payment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Team:</span>{" "}
                {teamName || "Not set"}
              </p>
              <p>
                <span className="font-medium">Date:</span> {date || "-"}
              </p>
              <p>
                <span className="font-medium">Hours:</span> {totalHours}h
              </p>
              <p>
                <span className="font-medium">Total:</span>{" "}
                Rp {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                className="bg-[#0A84FF] text-white hover:bg-[#0666cc] shadow-soft"
                onClick={async () => {
                  await handleBooking();
                  setConfirmOpen(false);
                }}
                disabled={isBooking}
              >
                {isBooking ? "Processing..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <p className="text-xs text-center text-gray-400 mt-3">
          Belum dikenakan biaya admin.
        </p>
      </div>
    </div>
  );
}