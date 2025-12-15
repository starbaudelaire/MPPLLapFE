"use client";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { createReview } from "@/lib/action";

export default function ReviewModal({ reservationId, fieldId }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // Handle ketika form disubmit
  const handleSubmit = async (formData: FormData) => {
    setLoading(true); // Mulai loading

    // Panggil Server Action
    const result = await createReview(formData);

    setLoading(false); // Selesai loading

    if (result?.error) {
      // Kalo Gagal -> Alert Error
      alert(`❌ Gagal: ${result.error}`);
    } else {
      // Kalo Sukses -> Alert Sukses & Tutup Modal
      alert("✅ Mantap! Review lo udah terkirim.");
      setIsOpen(false);
      // Opsional: Refresh halaman biar tombolnya update
      window.location.reload(); 
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white text-xs px-3 py-2 rounded-md font-medium hover:bg-gray-800 transition"
      >
        Beri Review
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Gimana mainnya tadi?</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            
            <form action={handleSubmit}>
              <input type="hidden" name="reservationId" value={reservationId} />
              <input type="hidden" name="fieldId" value={fieldId} />
              <input type="hidden" name="rating" value={rating} />

              {/* Bintang */}
              <div className="flex gap-2 justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)}>
                    {star <= rating ? (
                      <StarIcon className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarOutline className="h-8 w-8 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>

              <textarea
                name="comment"
                placeholder="Ceritain dong serunya (atau minusnya)..."
                className="w-full border rounded-lg p-3 text-sm mb-4 h-24"
                required
              />

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}