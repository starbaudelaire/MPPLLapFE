"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { verifyTicket } from "@/lib/action";
import {
  CheckCircleIcon,
  XCircleIcon,
  QrCodeIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleScan = async (decodedText: string) => {
    if (!decodedText || loading) return;

    // Stop scan bentar biar ga spam request
    setIsScanning(false);
    setLoading(true);

    // Panggil Server Action buat cek database
    const result = await verifyTicket(decodedText);

    // Tampilkan hasil
    setScanResult(result);
    setLoading(false);
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-24">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Ticket Validator
        </h1>
        <p className="text-gray-500">Arahkan kamera ke QR Code pengunjung.</p>
      </div>

      {/* SCANNER AREA */}
      <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-900 aspect-square mx-auto w-full max-w-sm">
        {isScanning ? (
          <>
            <Scanner
              onScan={(result) => {
                if (result && result[0]) {
                  handleScan(result[0].rawValue);
                }
              }}
              allowMultiple={true}
              scanDelay={2000} // Jeda antar scan
              components={{
                onOff: false,
                torch: true, // Lampu flash kalo gelap
                zoom: true,
                finder: true, // Kotak fokus merah
              }}
            />
            {/* Animasi Garis Scan */}
            <div className="absolute inset-0 border-2 border-white/20 pointer-events-none">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse"></div>
            </div>
            <p className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm font-medium bg-black/50 py-1">
              Scanning...
            </p>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <QrCodeIcon className="w-20 h-20 text-gray-700 animate-pulse" />
          </div>
        )}
      </div>

      {/* RESULT CARD (MUNCUL SETELAH SCAN) */}
      {scanResult && (
        <div
          className={`rounded-3xl p-6 shadow-xl border-2 animate-in slide-in-from-bottom-4 ${
            scanResult.success
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full flex-shrink-0 ${
                scanResult.success
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {scanResult.success ? (
                <CheckCircleIcon className="w-8 h-8" />
              ) : (
                <XCircleIcon className="w-8 h-8" />
              )}
            </div>

            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-1 ${
                  scanResult.success ? "text-emerald-800" : "text-red-800"
                }`}
              >
                {scanResult.success ? "ACCESS GRANTED" : "ACCESS DENIED"}
              </h3>
              <p
                className={`text-sm font-medium mb-4 ${
                  scanResult.success ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {scanResult.message || scanResult.error}
              </p>

              {/* DETAIL BOOKING (KALO ADA DATA) */}
              {(scanResult.data || scanResult.details) && (
                <div className="bg-white/60 rounded-xl p-4 space-y-3 text-sm border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-700">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-bold">
                      {(scanResult.data || scanResult.details).User.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(
                        (scanResult.data || scanResult.details).startDate
                      ).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(
                        (scanResult.data || scanResult.details).startDate
                      ).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {new Date(
                        (scanResult.data || scanResult.details).endDate
                      ).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Info Tambahan buat yang Gagal */}
                  {!scanResult.success && (
                    <div className="mt-2 text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded w-fit">
                      Status:{" "}
                      {(scanResult.data || scanResult.details).Payment
                        ?.status || "UNKNOWN"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={resetScan}
            className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Scan Next Ticket
          </button>
        </div>
      )}
    </div>
  );
}
