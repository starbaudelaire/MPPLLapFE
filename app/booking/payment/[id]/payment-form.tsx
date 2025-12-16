"use client";

import { confirmPayment } from "@/lib/action";
import { useState, useEffect } from "react";
import Image from "next/image"; // Jangan lupa import Image
import {
  QrCodeIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function PaymentForm({
  reservationId,
}: {
  reservationId: string;
}) {
  const [selected, setSelected] = useState("QRIS");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  // --- LOGIC COUNTDOWN (30 MENIT) ---
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 menit dalam detik

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  // ----------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("reservationId", reservationId);
    formData.append("paymentMethod", selected);

    // Simulasi delay biar user ngerasa lagi "verifikasi"
    await new Promise((r) => setTimeout(r, 1500));

    const res = await confirmPayment(formData);
    if (res?.error) {
      setToast({ msg: res.error, type: "err" });
      setLoading(false);
    } else {
      setToast({ msg: "Payment Confirmed! Redirecting...", type: "ok" });
      // Redirect otomatis handled by server action
    }
  };

  const methods = [
    {
      id: "QRIS",
      name: "QRIS",
      icon: QrCodeIcon,
      desc: "Scan with GoPay, OVO, Dana",
    },
    {
      id: "TRANSFER",
      name: "Bank Transfer",
      icon: BuildingLibraryIcon,
      desc: "BCA, Mandiri",
    },
  ];

  return (
    <div className="relative space-y-6">
      {/* --- COUNTDOWN TIMER --- */}
      <div className="flex items-center justify-between bg-orange-50 border border-orange-100 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-orange-700">
          <ClockIcon className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-bold">Complete payment in</span>
        </div>
        <span className="text-xl font-mono font-bold text-orange-600 bg-white px-3 py-1 rounded-lg border border-orange-100 shadow-sm">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div
          className={`absolute -top-24 left-0 right-0 p-3 rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-4 ${
            toast.type === "ok"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {toast.type === "ok" ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <ExclamationCircleIcon className="w-5 h-5" />
          )}
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {methods.map((m) => (
          <div key={m.id} className="relative group">
            {/* RADIO CARD */}
            <label
              className={`flex items-center p-4 border-2 cursor-pointer transition-all duration-300 ${
                selected === m.id
                  ? // Kalo dipilih, border bawah ilang (rounded-b-none) biar nyambung sama konten bawahnya
                    "border-[#f64e42] bg-red-50/10 rounded-t-2xl rounded-b-none border-b-0"
                  : "border-gray-100 hover:bg-gray-50 rounded-2xl"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={selected === m.id}
                onChange={(e) => setSelected(e.target.value)}
                className="hidden"
              />
              <div
                className={`p-2.5 rounded-full mr-4 transition-colors ${
                  selected === m.id
                    ? "bg-[#f64e42] text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <m.icon className="w-6 h-6" />
              </div>
              <div>
                <span
                  className={`block font-bold ${
                    selected === m.id ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {m.name}
                </span>
                <span className="text-xs text-gray-500">{m.desc}</span>
              </div>
              {selected === m.id && (
                <CheckCircleIcon className="w-6 h-6 text-[#f64e42] ml-auto" />
              )}
            </label>

            {/* EXPANDABLE CONTENT (BUAT QRIS) */}
            {selected === m.id && m.id === "QRIS" && (
              <div className="border-2 border-t-0 border-[#f64e42] rounded-b-2xl p-6 bg-white animate-in slide-in-from-top-2 flex flex-col items-center gap-4">
                <div className="relative w-48 h-48 bg-white p-2 rounded-xl border border-gray-200 shadow-inner">
                  {/* Ganti src="/qris.jpg" sesuai file lu */}
                  <Image
                    src="/qris.jpg"
                    alt="QRIS Code"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <p className="text-xs text-center text-gray-500 font-medium">
                  Scan QR code above using your preferred e-wallet app.
                  <br />
                  <span className="text-orange-500">
                    Wait for verification after payment.
                  </span>
                </p>
              </div>
            )}

            {/* EXPANDABLE CONTENT (BUAT TRANSFER - OPTIONAL) */}
            {selected === m.id && m.id === "TRANSFER" && (
              <div className="border-2 border-t-0 border-[#f64e42] rounded-b-2xl p-6 bg-white animate-in slide-in-from-top-2 space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      Bank BCA
                    </p>
                    <p className="text-lg font-mono font-bold text-gray-800">
                      123-456-7890
                    </p>
                    <p className="text-xs text-gray-500">
                      a.n. Lapang.in Official
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText("1234567890")}
                    className="text-xs text-[#f64e42] font-bold hover:underline"
                  >
                    COPY
                  </button>
                </div>
                <p className="text-xs text-center text-gray-500">
                  Transfer exact amount to the account above.
                </p>
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-[#f64e42] hover:bg-[#d93d32] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "I Have Paid"
          )}
        </button>
      </form>
    </div>
  );
}
