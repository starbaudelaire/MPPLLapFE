// components/contact-form.tsx
"use client";

import { useActionState } from "react"; // Pake useActionState (React 19 / Next 15)
import { sendMessage } from "@/lib/action";
import { SubmitButton } from "@/components/submit-button"; // Pastikan bikin component button terpisah atau pakai yang ada

const ContactForm = () => {
  const [state, formAction, isPending] = useActionState(sendMessage, null);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      {state?.message && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg ${
            state.message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={formAction}>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full"
            />
            <p className="text-red-500 text-sm mt-1">{state?.error?.name}</p>
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full"
            />
            <p className="text-red-500 text-sm mt-1">{state?.error?.email}</p>
          </div>
          <div className="md:col-span-2">
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full"
            />
            <p className="text-red-500 text-sm mt-1">{state?.error?.subject}</p>
          </div>
          <div className="md:col-span-2">
            <textarea
              name="message"
              rows={5}
              placeholder="Your Message"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full"
            ></textarea>
            <p className="text-red-500 text-sm mt-1">{state?.error?.message}</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-10 py-3 mt-6 w-full bg-[#f64e42] text-white rounded-md hover:bg-[#f64e42]/90 disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
