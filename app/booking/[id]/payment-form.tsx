"use client";

import { useState } from "react";
// Jangan lupa import cancelReservation
import { confirmPayment, cancelReservation } from "@/lib/action";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Buat navigasi client-side kalau perlu

interface PaymentFormProps {
  reservationId: string;
  totalAmount: number;
}

export default function PaymentForm({ reservationId, totalAmount }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false); // Loading state buat cancel

  // Hardcode Rekening BCA
  const rekeningBCA = "1232305411";
  const namaPemilik = "ADMIN LAPANGAN";

  const handleBayarClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert("Pilih metode pembayaran dulu bos!");
      return;
    }
    setShowModal(true);
  };

  // Function buat handle Cancel
  const handleCancel = async () => {
    const confirmCancel = confirm("Yakin mau batalin booking ini? Slot bakal dilepas lho.");
    if (!confirmCancel) return;

    setIsCancelling(true);
    await cancelReservation(reservationId); 
    // Action cancelReservation udah ada redirect, jadi gak perlu router.push manual
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleBayarClick}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>
          
          <div className="space-y-3">
            {/* OPSI QRIS */}
            <label 
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                selectedMethod === "QRIS" ? "border-[#f64e42] bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <input 
                type="radio" 
                name="paymentMethod" 
                value="QRIS" 
                className="h-4 w-4 text-[#f64e42] focus:ring-[#f64e42]"
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <span className="ml-3 font-medium text-gray-700">QRIS (Gopay/OVO/Dana)</span>
              <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Instant</span>
            </label>
            
            {/* OPSI TRANSFER BCA */}
            <label 
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                selectedMethod === "BANK_TRANSFER" ? "border-[#f64e42] bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <input 
                type="radio" 
                name="paymentMethod" 
                value="BANK_TRANSFER" 
                className="h-4 w-4 text-[#f64e42] focus:ring-[#f64e42]" 
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <span className="ml-3 font-medium text-gray-700">Transfer Bank (BCA)</span>
              <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">Manual Check</span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={!selectedMethod}
            className="w-full mt-6 bg-[#f64e42] text-white font-bold py-4 rounded-xl hover:bg-[#d93d32] transition shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bayar Sekarang
          </button>
        </form>

        {/* TOMBOL CANCEL / BATALKAN PESANAN */}
        <button 
          onClick={handleCancel}
          disabled={isCancelling}
          className="w-full mt-3 py-4 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition active:scale-95"
        >
          {isCancelling ? "Membatalkan..." : "Batalkan Pesanan & Kembali"}
        </button>
      </div>

      {/* --- MODAL POPUP (Sama kayak sebelumnya, cuma dirapihin dikit) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* Header Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">
                {selectedMethod === "QRIS" ? "Scan QRIS" : "Transfer BCA"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 flex flex-col items-center text-center">
              
              {selectedMethod === "QRIS" ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">Scan QR di bawah ini pake aplikasi e-wallet lo.</p>
                  <div className="bg-white p-2 border rounded-lg shadow-inner mb-4">
                    <Image src="/qris.jpg" alt="QRIS" width={250} height={250} className="rounded-md" />
                  </div>
                  <p className="font-bold text-xl text-[#f64e42] mb-2 whitespace-nowrap">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    Silakan transfer <strong>SESUAI NOMINAL (3 digit terakhir)</strong> biar admin gampang cek.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl w-full mb-6 relative group cursor-pointer hover:bg-blue-100 transition"
                       onClick={() => {
                         navigator.clipboard.writeText(rekeningBCA);
                         alert("Nomor rekening dicopy!");
                       }}
                  >
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider">BCA</p>
                        <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">Copy</span>
                    </div>
                    <p className="text-3xl font-mono font-bold text-blue-700 tracking-widest my-1">{rekeningBCA}</p>
                    <p className="text-xs text-blue-400 font-medium">a.n. {namaPemilik}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 w-full mb-4">
                    <p className="text-xs text-gray-500 mb-1">Total Transfer</p>
                    <p className="font-bold text-lg text-[#f64e42] whitespace-nowrap">
                        Rp {totalAmount.toLocaleString("id-ID")}
                    </p>
                  </div>
                </>
              )}

              {/* Form Confirmation */}
              <form action={confirmPayment} className="w-full mt-2">
                <input type="hidden" name="reservationId" value={reservationId} />
                <input type="hidden" name="paymentMethod" value={selectedMethod} />
                
                <button 
                  type="submit"
                  className="w-full bg-[#f64e42] text-white font-bold py-3 rounded-xl hover:bg-[#d93d32] transition shadow-md"
                >
                  Saya Sudah Bayar
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full mt-3 text-gray-500 text-sm hover:underline"
                >
                  Kembali
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}