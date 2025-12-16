//components/contact-form.tsx

"use client";

import { useActionState } from "react";
import { saveMessage } from "@/lib/action";

const ContactForm = () => {
  // Hook sakti React 19 buat handle form (State, Action, Loading)
  const [state, formAction, isPending] = useActionState(saveMessage, null);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      {/* Kalo sukses, tampilin pesan sukses doang biar bersih */}
      {state?.success ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Terima Kasih!</h3>
          <p className="text-gray-600">{state.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 text-sm text-blue-500 hover:underline"
          >
            Kirim pesan lagi
          </button>
        </div>
      ) : (
        /* Kalo belum sukses, tampilin formnya */
        <form action={formAction}>
          {/* Alert Error Global */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              ⚠️ {state.error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Input Name */}
            <div>
              <input
                type="text"
                name="name"
                required
                disabled={isPending}
                className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light focus:outline-none focus:ring-2 focus:ring-[#f64e42] focus:border-transparent transition-all"
                placeholder="Name"
              />
            </div>

            {/* Input Email */}
            <div>
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light focus:outline-none focus:ring-2 focus:ring-[#f64e42] focus:border-transparent transition-all"
                placeholder="email@example.com"
              />
            </div>

            {/* Input Subject */}
            <div className="md:col-span-2">
              <input
                type="text"
                name="subject"
                disabled={isPending}
                className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light focus:outline-none focus:ring-2 focus:ring-[#f64e42] focus:border-transparent transition-all"
                placeholder="Subject"
              />
            </div>

            {/* Input Message */}
            <div className="md:col-span-2">
              <textarea
                name="message" // ✅ TYPO FIXED (messgae -> message)
                required
                disabled={isPending}
                rows={5}
                className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light focus:outline-none focus:ring-2 focus:ring-[#f64e42] focus:border-transparent transition-all"
                placeholder="Your Message"
              ></textarea>
            </div>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={isPending}
            className={`px-10 py-3 mt-6 text-center font-semibold text-white w-full rounded-md transition-all
              ${isPending 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#f64e42] hover:bg-[#f64e42]/90 cursor-pointer shadow-lg hover:shadow-xl"
              }`}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                ⏳ Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;