"use client";

import { saveMessage } from "@/lib/action";
import { useState } from "react";
import {
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setToast(null);

    const formData = new FormData(event.currentTarget);
    const result = await saveMessage(null, formData);

    setLoading(false);

    if (result.error) {
      setToast({ message: "Oops! Something went wrong.", type: "error" });
    } else if (result.success) {
      setToast({
        message: "Message sent! We'll get back to you ASAP.",
        type: "success",
      });
      (event.target as HTMLFormElement).reset();
    }

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative text-sm">
      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div
          className={`absolute -top-20 left-0 right-0 p-4 rounded-xl flex items-center gap-3 shadow-lg animate-in slide-in-from-top-5 fade-in z-50 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <ExclamationCircleIcon className="w-5 h-5" />
          )}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* NAME & EMAIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            name="name"
            id="name"
            placeholder=" "
            required
            className="peer w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder-transparent text-sm"
          />
          <label
            htmlFor="name"
            className="absolute left-3 -top-2 bg-white px-1 text-[11px] text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2 peer-focus:text-brand peer-focus:text-[11px]"
          >
            Full Name
          </label>
        </div>

        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            required
            className="peer w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder-transparent text-sm"
          />
          <label
            htmlFor="email"
            className="absolute left-3 -top-2 bg-white px-1 text-[11px] text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2 peer-focus:text-brand peer-focus:text-[11px]"
          >
            Email Address
          </label>
        </div>
      </div>

      {/* SUBJECT */}
      <div className="relative">
        <input
          type="text"
          name="subject"
          id="subject"
          placeholder=" "
          required
          className="peer w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder-transparent text-sm"
        />
        <label
          htmlFor="subject"
          className="absolute left-3 -top-2 bg-white px-1 text-[11px] text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2 peer-focus:text-brand peer-focus:text-[11px]"
        >
          Subject / Topic
        </label>
      </div>

      {/* MESSAGE */}
      <div className="relative">
        <textarea
          name="message"
          id="message"
          rows={4}
          placeholder=" "
          required
          className="peer w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder-transparent resize-none text-sm"
        ></textarea>
        <label
          htmlFor="message"
          className="absolute left-3 -top-2 bg-white px-1 text-[11px] text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2 peer-focus:text-brand peer-focus:text-[11px]"
        >
          Your Message
        </label>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-[#0A84FF] hover:bg-[#0666cc] text-white font-semibold rounded-full shadow-soft transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
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
            Sending...
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 mb-1" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
