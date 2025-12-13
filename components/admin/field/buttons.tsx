"use client";

import { deleteField } from "@/lib/action";
import { IoTrashOutline } from "react-icons/io5";

export const DeleteButton = ({ id }: { id: string }) => {
  return (
    <form
      // Kita bungkus pake async function biar return value-nya gak dibaca TS
      action={async () => {
        await deleteField(id);
      }}
      onSubmit={(e) => {
        // Konfirmasi biar gak kepencet
        if (!confirm("Yakin mau apus lapangan ini, bro?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
      >
        <IoTrashOutline />
      </button>
    </form>
  );
};