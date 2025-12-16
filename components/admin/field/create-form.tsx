"use client";

import { useActionState } from "react";
import { createField } from "@/lib/action";
import Link from "next/link";
import {
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Amenities } from "@prisma/client";

const inputClass =
  "w-full rounded-xl border-gray-200 bg-gray-50/50 p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none";
const labelClass =
  "mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider";

export default function CreateForm({
  amenities = [],
}: {
  amenities: Amenities[];
}) {
  const [state, formAction] = useActionState(createField, null);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-full">
          <label htmlFor="name" className={labelClass}>
            Field Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Gelora Bung Karno"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>
            Sport Type
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              className={`${inputClass} appearance-none cursor-pointer`}
              defaultValue="FUTSAL"
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

        {/* CAPACITY BUAT CREATE */}
        <div>
          <label htmlFor="capacity" className={labelClass}>
            Capacity (Orang)
          </label>
          <div className="relative">
            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="e.g. 10"
              min="1"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="price" className={labelClass}>
            Price / Hour
          </label>
          <div className="relative">
            <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="price"
              name="price"
              type="number"
              placeholder="150000"
              className={`${inputClass} pl-10`}
              required
            />
          </div>
        </div>
      </div>

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
            placeholder="Full address of the venue..."
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
          placeholder="Describe facilities, floor type, rules, etc..."
          className={inputClass}
          required
        />
      </div>

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
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className={labelClass}>
          Cover Image
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <PhotoIcon className="w-8 h-8 mb-3 text-gray-400" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (MAX. 4MB)
              </p>
            </div>
            <input id="image" name="image" type="file" className="hidden" />
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
          className="px-8 py-2.5 rounded-xl bg-[#f64e42] hover:bg-[#d93d32] text-white text-sm font-bold shadow-lg hover:shadow-red-500/40 transition-all hover:-translate-y-0.5"
        >
          Publish Arena
        </button>
      </div>
    </form>
  );
}
