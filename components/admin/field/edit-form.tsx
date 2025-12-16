"use client";

import { useActionState } from "react";
import { updateField } from "@/lib/action";
import Link from "next/link";
import {
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  UserGroupIcon, // Icon baru buat Capacity
} from "@heroicons/react/24/solid";
import { Amenities } from "@prisma/client";

interface EditFormProps {
  field: any;
  amenities: Amenities[];
}

const inputClass =
  "w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none";
const labelClass =
  "mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider";

export default function EditForm({ field, amenities = [] }: EditFormProps) {
  const updateFieldWithId = updateField.bind(null, field.id);
  const [state, formAction] = useActionState(updateFieldWithId, null);

  const hasAmenity = (amenityId: string) => {
    return (
      field.FieldAmenities?.some((fa: any) => fa.amenitiesId === amenityId) ??
      false
    );
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* 1. Basic Info */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-full">
          <label htmlFor="name" className={labelClass}>
            Field Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={field.name}
            className={inputClass}
            required
          />
        </div>

        {/* TYPE & CAPACITY (Sebelahan) */}
        <div>
          <label htmlFor="type" className={labelClass}>
            Sport Type
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              defaultValue={field.type}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="FUTSAL">Futsal</option>
              <option value="BASKETBALL">Basketball</option>
              <option value="BADMINTON">Badminton</option>
              <option value="MINI_SOCCER">Mini Soccer</option>
              <option value="TENNIS">Tennis</option>
              <option value="VOLLEYBALL">Volleyball</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="capacity" className={labelClass}>
            Capacity (Orang)
          </label>
          <div className="relative">
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            {/* INI YANG TADI ILANG BOSKU 👇 */}
            <input
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={field.capacity}
              className={`${inputClass} pl-10`}
              placeholder="e.g. 10"
              min="1"
              required
            />
          </div>
        </div>

        {/* Price (Full Width di Mobile, Separuh di Desktop) */}
        <div className="col-span-full md:col-span-1">
          <label htmlFor="price" className={labelClass}>
            Price / Hour
          </label>
          <div className="relative">
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="price"
              name="pricePerHour"
              type="number"
              defaultValue={field.pricePerHour}
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>
      </div>

      {/* 2. Address & Desc */}
      <div>
        <label htmlFor="address" className={labelClass}>
          Location Address
        </label>
        <div className="relative">
          <MapPinIcon className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="address"
            name="address"
            rows={2}
            defaultValue={field.address}
            className={`${inputClass} pl-10 resize-none`}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={field.description}
          className={inputClass}
          required
        />
      </div>

      {/* 3. Amenities Checklist */}
      <div>
        <label className={labelClass}>Facilities & Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenities.map((item) => (
            <div key={item.id} className="relative">
              <input
                type="checkbox"
                id={item.id}
                name="amenities"
                value={item.id}
                defaultChecked={hasAmenity(item.id)}
                className="peer hidden"
              />
              <label
                htmlFor={item.id}
                className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer transition-all hover:bg-gray-100 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700"
              >
                <SparklesIcon className="w-4 h-4 text-gray-400 peer-checked:text-blue-500" />
                <span className="text-sm font-medium select-none">
                  {item.name}
                </span>
              </label>
            </div>
          ))}
        </div>
        {amenities.length === 0 && (
          <div className="p-4 bg-yellow-50 text-yellow-700 text-xs rounded-lg mt-2 flex items-center gap-2">
            <span>⚠️</span> Data fasilitas kosong di database.
          </div>
        )}
      </div>

      {/* 4. Image Logic */}
      <div>
        <label htmlFor="image" className={labelClass}>
          Cover Image
        </label>
        {field.image && (
          <div className="mb-4 relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={field.image}
              alt="Current"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <input type="hidden" name="image" value={field.image || ""} />
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors opacity-70 hover:opacity-100"
          >
            <div className="flex flex-row items-center gap-3">
              <PhotoIcon className="w-6 h-6 text-gray-400" />
              <p className="text-sm text-gray-500">Change Image (Optional)</p>
            </div>
            <input id="imageUpload" type="file" className="hidden" />
          </label>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {state?.message ? (
          <p className="mt-2 text-sm text-red-500 font-medium">
            🚫 {state.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/admin/field"
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
