"use client";

import { useActionState, useState, useRef, useTransition } from "react";
import { saveField } from "@/lib/action";
import type { Amenities } from "@/app/generated/prisma/client";
import Image from "next/image";
import clsx from "clsx";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import { type PutBlobResult } from "@vercel/blob"; // Import tipe data Vercel

const SPORT_TYPES = [
  "FUTSAL", "BASKETBALL", "BADMINTON", "MINI_SOCCER", "TENNIS"
];

interface CreateFormProps {
  amenities: Amenities[];
}

const CreateForm = ({ amenities }: CreateFormProps) => {
  const [state, formAction, isPending] = useActionState(saveField, null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, startTransition] = useTransition();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    const file = event.target.files[0];

    if (file.size > 4 * 1024 * 1024) {
      alert("File max 4MB bro!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const response = await fetch("/api/upload", {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          // Ambil pesan error dari server (biar gak kosong lagi)
          const errorRes = await response.json(); 
          throw new Error(errorRes.message || "Upload failed");
        }

        // Casting ke tipe PutBlobResult biar aman
        const newBlob = (await response.json()) as PutBlobResult;
        setImageUrl(newBlob.url);

      } catch (error) {
        console.error("Upload Error:", error);
        alert(`Gagal upload: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    });
  };

  const deleteImage = () => {
    setImageUrl("");
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Image Upload */}
      <div className="grid gap-2">
        <label className="font-semibold text-gray-700">Field Image</label>
        <input type="hidden" name="image" value={imageUrl} />
        
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="relative w-full md:w-64 aspect-video bg-gray-50 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <>
                <Image src={imageUrl} alt="Preview" fill className="object-cover" unoptimized />
                <button type="button" onClick={deleteImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600">
                  <IoTrashOutline />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <IoCloudUploadOutline className="mx-auto text-2xl text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Upload Image (Max 4MB)</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input ref={inputFileRef} type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
            {isUploading && <p className="text-xs text-blue-500 mt-2">Uploading to Vercel...</p>}
            <p className="text-sm text-red-500 mt-1">{state?.error?.image}</p>
          </div>
        </div>
      </div>

      {/* Inputs Lainnya (Tetep Sama) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
          <input name="name" type="text" className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
          <p className="text-red-500 text-xs mt-1">{state?.error?.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sport Type</label>
          <select name="type" defaultValue="" className="py-2 px-4 rounded-sm border border-gray-400 w-full bg-white">
            <option value="" disabled>Select Type</option>
            {SPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <p className="text-red-500 text-xs mt-1">{state?.error?.type}</p>
        </div>
      </div>

      {/* Sisa input (Description, Price, dll) sama persis kayak sebelumnya... */}
      {/* ... (Copy bagian Description, Price, Capacity, Address, Amenities dari kode sebelumnya) ... */}
      
      {/* Short version buat sisa input biar gak kepanjangan (Isi sendiri sesuai yg lokal tadi ya) */}
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
         <textarea name="description" rows={3} className="py-2 px-4 rounded-sm border border-gray-400 w-full"></textarea>
      </div>
      <div className="grid grid-cols-3 gap-4">
         <input name="pricePerHour" type="number" placeholder="Price" className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
         <input name="capacity" type="number" placeholder="Capacity" className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
         <input name="address" type="text" placeholder="Address" className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
      </div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {amenities.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 bg-gray-50 border p-2 rounded">
                    <input type="checkbox" name="amenities" value={item.id} className="w-4 h-4 text-blue-600" />
                    <label className="text-sm capitalize">{item.name}</label>
                </div>
            ))}
        </div>

      {state?.message && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{state.message}</div>}
      
      <button type="submit" disabled={isPending || isUploading} className={clsx("w-full py-3 px-4 rounded-md text-white font-bold transition-all", isPending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700")}>
        {isPending ? "Saving..." : "Save Field"}
      </button>
    </form>
  );
};

export default CreateForm;