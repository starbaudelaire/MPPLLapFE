"use client";

import { useActionState, useState, useRef, useTransition } from "react";
import { updateField } from "@/lib/action";
import type { Amenities, Field, FieldAmenities } from "@/app/generated/prisma/client";
import Image from "next/image";
import clsx from "clsx";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import { type PutBlobResult } from "@vercel/blob"; // 👈 INI YANG TADINYA KURANG

// List Manual Tipe Olahraga
const SPORT_TYPES = [
  "FUTSAL",
  "BASKETBALL",
  "BADMINTON",
  "MINI_SOCCER",
  "TENNIS",
];

// Tipe data props: Field + Relasi Amenities-nya
type FieldWithAmenities = Field & {
  FieldAmenities: FieldAmenities[];
};

interface EditFormProps {
  field: FieldWithAmenities;
  amenities: Amenities[];
}

const EditForm = ({ field, amenities }: EditFormProps) => {
  // Bind ID lapangan ke server action
  const updateFieldWithId = updateField.bind(null, field.id);
  const [state, formAction, isPending] = useActionState(updateFieldWithId, null);

  // State awal ambil dari data field yang ada
  const [imageUrl, setImageUrl] = useState<string>(field.image);
  const [isUploading, startTransition] = useTransition();
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Logic Upload Vercel Blob
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    const file = event.target.files[0];

    if (file.size > 4 * 1024 * 1024) {
      alert("File max 4MB");
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
          const errorRes = await response.json();
          throw new Error(errorRes.message || "Upload failed");
        }

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
      {/* --- Image Upload --- */}
      <div className="grid gap-2">
        <label className="font-semibold text-gray-700">Field Image</label>
        <input type="hidden" name="image" value={imageUrl} />

        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="relative w-full md:w-64 aspect-video bg-gray-50 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={deleteImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                >
                  <IoTrashOutline />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <IoCloudUploadOutline className="mx-auto text-2xl text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">
                  Change Image (Max 4MB)
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {isUploading && (
              <p className="text-xs text-blue-500 mt-2">Uploading to Vercel...</p>
            )}
            <p className="text-sm text-red-500 mt-1">{state?.error?.image}</p>
          </div>
        </div>
      </div>

      {/* --- Basic Info (Pake defaultValue) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Name
          </label>
          <input
            name="name"
            type="text"
            defaultValue={field.name}
            className="py-2 px-4 rounded-sm border border-gray-400 w-full"
          />
          <p className="text-red-500 text-xs mt-1">{state?.error?.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sport Type
          </label>
          <select
            name="type"
            defaultValue={field.type}
            className="py-2 px-4 rounded-sm border border-gray-400 w-full bg-white"
          >
            {SPORT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-xs mt-1">{state?.error?.type}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={field.description}
          className="py-2 px-4 rounded-sm border border-gray-400 w-full"
        ></textarea>
        <p className="text-red-500 text-xs mt-1">
          {state?.error?.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price / Hour
          </label>
          <input
            name="pricePerHour"
            type="number"
            defaultValue={field.pricePerHour}
            className="py-2 px-4 rounded-sm border border-gray-400 w-full"
          />
          <p className="text-red-500 text-xs mt-1">
            {state?.error?.pricePerHour}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            name="capacity"
            type="number"
            defaultValue={field.capacity}
            className="py-2 px-4 rounded-sm border border-gray-400 w-full"
          />
          <p className="text-red-500 text-xs mt-1">
            {state?.error?.capacity}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location/Address
          </label>
          <input
            name="address"
            type="text"
            defaultValue={field.address || ""}
            className="py-2 px-4 rounded-sm border border-gray-400 w-full"
          />
          <p className="text-red-500 text-xs mt-1">{state?.error?.address}</p>
        </div>
      </div>

      {/* --- Amenities (Multi Select) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities / Facilities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amenities.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-2 bg-gray-50 border p-2 rounded cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                name="amenities"
                value={item.id}
                id={`amenity-${item.id}`}
                // Cek apakah amenity ini ada di data field (defaultChecked)
                defaultChecked={field.FieldAmenities.some(
                  (fa) => fa.amenitiesId === item.id
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`amenity-${item.id}`}
                className="text-sm cursor-pointer select-none text-gray-700 capitalize"
              >
                {item.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {state?.message && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || isUploading}
        className={clsx(
          "w-full py-3 px-4 rounded-md text-white font-bold text-lg transition-all",
          isPending || isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        )}
      >
        {isPending ? "Updating..." : "Update Field"}
      </button>
    </form>
  );
};

export default EditForm;