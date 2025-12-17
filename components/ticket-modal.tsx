"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image"; // 👈 LIBRARY BARU
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface TicketModalProps {
  reservation: any;
  onClose: () => void;
}

export default function TicketModal({
  reservation,
  onClose,
}: TicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      // Tunggu sebentar biar gambar & font ke-load sempurna
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Pake html-to-image (toPng)
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true, // Biar gak kena cache gambar lama
        pixelRatio: 2, // Biar HD (Retina)
        backgroundColor: "transparent", // Background transparan aman
      });

      const link = document.createElement("a");
      link.download = `TIKET-LAPANGIN-${reservation.id
        .slice(-6)
        .toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal download tiket:", err);
      alert("Gagal save gambar. Coba lagi atau screenshot manual.");
    } finally {
      setIsDownloading(false);
    }
  };

  const bookingCode = reservation.id.slice(-6).toUpperCase();
  const dateStr = new Date(reservation.startDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = `${new Date(reservation.startDate).toLocaleTimeString(
    "id-ID",
    { hour: "2-digit", minute: "2-digit" }
  )} - ${new Date(reservation.endDate).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-sm z-10 animate-in zoom-in-95 duration-200">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* === AREA TIKET (REF) === */}
        <div
          ref={ticketRef}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* HEADER TIKET */}
          <div className="relative p-6 text-white overflow-hidden min-h-[220px] flex flex-col justify-between">
            {/* 1. BACKGROUND IMAGE (Pake Style CSS biar aman) */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: "url('/well-2.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* 2. OVERLAY GELAP */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>

            {/* 3. KONTEN TEXT (z-20) */}
            <div className="relative z-20">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold tracking-widest border border-white/30 shadow-sm">
                  E-TICKET
                </div>

                {/* LOGO */}
                <img
                  src="/lapang-in.png"
                  alt="Lapang.in Logo"
                  className="h-8 opacity-95 drop-shadow-md"
                  crossOrigin="anonymous"
                />
              </div>

              <h2 className="text-2xl font-extrabold leading-tight mb-1 drop-shadow-sm">
                {reservation.Field.name}
              </h2>
              <div className="flex items-center text-xs opacity-90 mb-6 font-medium">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span className="truncate max-w-[200px]">
                  {reservation.Field.address}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase opacity-70 font-bold mb-1">
                    Date
                  </p>
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    {dateStr}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-70 font-bold mb-1">
                    Time
                  </p>
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <ClockIcon className="w-4 h-4" />
                    {timeStr}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SOBEKAN KERTAS */}
          <div className="relative bg-white h-8 -mt-4 flex items-center justify-between px-[-10px] z-30">
            <div className="w-6 h-6 bg-[#1a1a1a] rounded-full -ml-3"></div>
            <div className="w-full border-t-2 border-dashed border-gray-300 mx-2"></div>
            <div className="w-6 h-6 bg-[#1a1a1a] rounded-full -mr-3"></div>
          </div>

          {/* QR CODE SECTION */}
          <div className="bg-white p-6 pt-2 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-2 border-2 border-gray-100 rounded-xl mb-4">
              <QRCode
                value={`BOOKING-${reservation.id}`}
                size={140}
                viewBox={`0 0 256 256`}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>

            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
              Booking Ref
            </p>
            <p className="text-2xl font-mono font-bold text-gray-900 tracking-[0.2em]">
              {bookingCode}
            </p>

            <p className="text-[10px] text-gray-400 mt-4 px-4">
              Show this QR code to the admin at the venue counter.
            </p>
          </div>
        </div>

        {/* TOMBOL DOWNLOAD */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <span className="text-sm">Saving to Gallery...</span>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-5 h-5" />
              Save Ticket
            </>
          )}
        </button>
      </div>
    </div>
  );
}
