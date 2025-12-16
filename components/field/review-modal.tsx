"use client";

import { createReview } from "@/lib/action";
import {
  StarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ReviewModalProps {
  reservationId: string;
  fieldId: string;
}

export default function ReviewModal({
  reservationId,
  fieldId,
}: ReviewModalProps) {
  // State Internal buat buka/tutup modal
  const [isOpen, setIsOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // Fungsi Tutup Modal & Reset State
  const handleClose = () => {
    setIsOpen(false);
    setToast(null);
    // Optional: Reset form kalo mau
    // setRating(0);
    // setComment("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setToast({ msg: "Please give a star rating!", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    const formData = new FormData();
    formData.append("reservationId", reservationId);
    formData.append("fieldId", fieldId);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    const res = await createReview(formData);

    if (res?.error) {
      setToast({ msg: res.error, type: "error" });
      setIsSubmitting(false);
    } else {
      setToast({ msg: "Review published successfully!", type: "success" });
      // Delay dikit biar user liat notif sukses, baru tutup & refresh
      setTimeout(() => {
        handleClose();
        window.location.reload(); // Refresh biar status di halaman berubah
      }, 1500);
    }
  };

  return (
    <>
      {/* 1. TOMBOL PEMICU (Ini yang muncul di list booking) */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
      >
        <PencilSquareIcon className="w-4 h-4" />
        Rate Experience
      </button>

      {/* 2. MODAL OVERLAY (Cuma muncul kalo isOpen = true) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={handleClose}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Rate your experience
                </h3>
                <p className="text-sm text-gray-500">How was the game?</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Notif Toast (Floating inside modal) */}
            {toast && (
              <div
                className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce ${
                  toast.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : (
                  <ExclamationCircleIcon className="w-4 h-4" />
                )}
                {toast.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Star Rating Interactive */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      {star <= (hoverRating || rating) ? (
                        <StarIcon className="w-10 h-10 text-yellow-400 drop-shadow-sm" />
                      ) : (
                        <StarOutline className="w-10 h-10 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-500 min-h-[20px]">
                  {hoverRating === 5 || rating === 5
                    ? "Awesome! 🔥"
                    : hoverRating === 4 || rating === 4
                    ? "Pretty Good! 👍"
                    : hoverRating === 3 || rating === 3
                    ? "Average 🙂"
                    : hoverRating === 2 || rating === 2
                    ? "Meh 😕"
                    : hoverRating === 1 || rating === 1
                    ? "Bad 😠"
                    : "Tap a star to rate"}
                </p>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="comment"
                  className="block text-sm font-bold text-gray-700"
                >
                  Write a review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full rounded-2xl border-gray-200 bg-gray-50 p-4 text-sm focus:border-[#f64e42] focus:bg-white focus:ring-2 focus:ring-[#f64e42]/20 transition-all resize-none outline-none"
                  placeholder="Tell us what you liked or didn't like about the field..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#f64e42] hover:bg-[#d93d32] text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
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
                  "Submit Review"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
