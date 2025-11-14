"use client"; // Ini WAJIB jadi client component

import { useActionState, useEffect, useRef } from "react";
import { contactAction, type FormState } from "@/lib/action"; // Impor action & type

// Komponen helper buat nampilin error
const FieldError = ({ errors }: { errors?: string[] }) => {
  if (!errors || errors.length === 0) return null;
  return <p className="text-sm text-red-500 mt-2">{errors[0]}</p>;
};

// Komponen helper buat nampilin notif
const FormNotification = ({
  status,
  message,
}: {
  status: "success" | "error" | "idle";
  message: string;
}) => {
  if (status === "idle" || !message) return null;

  const ariesRole = status === "error" ? "alert" : "status";
  const className =
    status === "success"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-red-100 border-red-400 text-red-700";

  return (
    <div
      className={`border px-4 py-3 rounded-sm relative mb-4 ${className}`}
      role={ariesRole}
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

// INI KOMPONEN-NYA
const ContactForm = () => {
  // state awal buat form
  const initialState: FormState = {
    status: "idle",
    message: "",
  };

  // Pake useActionState (pengganti useFormState di React 19)
  const [state, formAction, isPending] = useActionState(
    contactAction,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Kalo sukses, reset form-nya
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
<<<<<<< HEAD
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <form action="">
        <div className="grid md:grid-cols-2 gap-6 mt-6">
=======
    <div className="bg-white p-8 rounded-sm shadow-sm">
      <form ref={formRef} action={formAction}>
        {/* Tampilkan notifikasi sukses atau error general */}
        <FormNotification
          status={state.status}
          message={state.errors?._form?.[0] || state.message}
        />

        <div className="grid md:grid-cols-2 gap-7 mt-6">
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
          <div>
            <input
              type="text"
              name="name"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="Name"
            />
            <div aria-live="polite" aria-atomic="true">
<<<<<<< HEAD
              <p className="text-sm text-red-500 mt-2"></p>
=======
              <FieldError errors={state.errors?.name} />
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
            </div>
          </div>
          <div>
            <input
              type="email"
              name="email"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="email@example.com"
            />
            <div aria-live="polite" aria-atomic="true">
<<<<<<< HEAD
              <p className="text-sm text-red-500 mt-2"></p>
=======
              <FieldError errors={state.errors?.email} />
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
            </div>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              name="subject"
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="Subject"
            />
            <div aria-live="polite" aria-atomic="true">
<<<<<<< HEAD
              <p className="text-sm text-red-500 mt-2"></p>
=======
              <FieldError errors={state.errors?.subject} />
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
            </div>
          </div>
          <div className="md:col-span-2">
            <textarea
              name="message" // 'message', bukan 'messgae'
              rows={5}
              className="bg-gray-50 p-3 border border-gray-200 rounded-md w-full font-light"
              placeholder="Your Message"
            ></textarea>
            <div aria-live="polite" aria-atomic="true">
<<<<<<< HEAD
              <p className="text-sm text-red-500 mt-2"></p>
=======
              <FieldError errors={state.errors?.message} />
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
            </div>
          </div>
        </div>
        <button
          type="submit"
<<<<<<< HEAD
          className="px-10 py-3 mt-6 text-center font-semibold text-white w-full bg-[#f64e42] rounded-md hover:bg-[#f64e42]/90 cursor-pointer"
        >
          Send Message
=======
          className="px-10 py-4 text-center font-semibold text-white w-full bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer disabled:bg-gray-400 mt-4" // tambahin mt-4
          disabled={isPending} // Disable pas lagi loading
        >
          {isPending ? "Sending..." : "Send Message"}
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
        </button>
      </form>
    </div>
  );
};

<<<<<<< HEAD
=======
// INI YANG BIKIN ERROR-NYA ILANG
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
export default ContactForm;
