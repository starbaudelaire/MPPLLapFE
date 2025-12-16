"use client";

import { confirmPayment } from "@/lib/action";
import { useState } from "react";
import {
  QrCodeIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("reservationId", reservationId);
    formData.append("paymentMethod", selected);

    const res = await confirmPayment(formData); // Panggil Server Action
    if (res?.error) {
      setToast({ msg: res.error, type: "err" });
      setLoading(false);
    } else {
      setToast({ msg: "Success! Redirecting...", type: "ok" });
      // Redirect otomatis dari server action
    }
  };

  const methods = [
    { id: "QRIS", name: "QRIS", icon: QrCodeIcon, desc: "GoPay, OVO, Dana" },
    {
      id: "TRANSFER",
      name: "Bank Transfer",
      icon: BuildingLibraryIcon,
      desc: "BCA, Mandiri",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4">
      {/* TOAST NOTIF */}
      {toast && (
        <div
          className={`absolute -top-20 left-0 right-0 p-3 rounded-lg flex items-center gap-2 shadow-lg ${
            toast.type === "ok"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
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

      {methods.map((m) => (
        <label
          key={m.id}
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
            selected === m.id
              ? "border-[#f64e42] bg-red-50/50"
              : "border-gray-100 hover:bg-gray-50"
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
            className={`p-2 rounded-full mr-4 ${
              selected === m.id
                ? "bg-[#f64e42] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <m.icon className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-bold text-gray-900">{m.name}</span>
            <span className="text-xs text-gray-500">{m.desc}</span>
          </div>
          {selected === m.id && (
            <CheckCircleIcon className="w-6 h-6 text-[#f64e42] ml-auto" />
          )}
        </label>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-[#f64e42] hover:bg-[#d93d32] text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? "Processing..." : "Confirm Payment"}
      </button>
    </form>
  );
}
