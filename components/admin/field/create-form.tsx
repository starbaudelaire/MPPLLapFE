"use client";

import { useRef, useState, useTransition } from "react";
// import { useActionState } from "react"; // Ngga dipake di 'master'
import { saveField } from "@/lib/action"; // <-- Ganti ke saveField
import { type putBlobResult } from "@vercel/blob";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import Image from "next/image";
//import {BarLoader} from "react-spinners"
import { Amenities, SportType } from "@/app/generated/prisma/client"; // <-- Benerin import path
import clsx from "clsx"; // <-- Import clsx
import { useActionState } from "react"; // <-- Import useActionState

//                                          v-- Tambahin '[]' (array)
const CreateForm = ({ amenities }: { amenities: Amenities[] }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition(); // <-- Benerin 'userTransition'

  const handleUpload = () => {
    if (!inputFileRef.current?.files) return null;
    const file = inputFileRef.current.files[0];
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      try {
        const response = await fetch("/api/upload", {
          method: "PUT",
          body: formData,
        });
        const data = await response.json();
        if (response.status !== 200) {
          setMessage(data.message);
          return; // <-- Stop kalo gagal
        }
        const img = data as putBlobResult;
        setImage(img.url);
        setMessage(""); // <-- Clear message kalo sukses
      } catch (error) {
        console.log(error);
        setMessage("Upload failed.");
      }
    });
  };

  const deleteImage = (image: string) => {
    startTransition(async () => {
      try {
        // Benerin typo 'iamgeUrl' jadi 'imageUrl'
        await fetch(`/api/upload/?imageUrl=${image}`, {
          method: "DELETE",
        });
        setImage(""); // <-- Ganti jadi string kosong
      } catch (error) {
        console.log(error);
      }
    });
  };

  // Pake useActionState dari repo lama
  const [state, formAction, isPending] = useActionState(
    saveField.bind(null, image),
    null
  );

  return (
    <form action={formAction}>
      <div className="grid md:grid-cols-12 gap-5">
        <div className="col-span-8 bg-white p-4">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Field Name.."
            />
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.name}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              rows={8}
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Description"
            ></textarea>
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.description}
              </span>
            </div>
          </div>

          <div className="mb-4 grid md:grid-cols-3">
            {amenities.map((item) => (
              <div className="flex items-center mb-4" key={item.id}>
                <input
                  type="checkbox"
                  name="amenities"
                  defaultValue={item.id}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
                <label className="ms-2 text-sm font-medium text-gray-900 capitalize">
                  {item.name}
                </label>
              </div>
            ))}

            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.amenities}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-white p-4">
          <input type="hidden" name="image" value={image} />
          <label
            htmlFor="input-file"
            className="flex flex-col mb-4 items-center
                justify-center aspect-video border-2 border-gray-300 border-dashed rounded-md
                cursor-pointer bg-gray-50 relative"
          >
            <div className="flex flex-col items-center justify-center text-gray-500 pt-5 pb-6 z-10">
              {/* {pending ? <BarLoader /> : null} */}
              {image ? (
                <button
                  type="button"
                  onClick={() => deleteImage(image)}
                  className="flex items-center justify-center bg-transparent size-6 rounded-sm absolute right-1 top-1 text-white hover:bg-red-400"
                >
                  <IoTrashOutline className="size-4 text-transparent hover:text-white" />
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <IoCloudUploadOutline className="size-8" />
                  <p className="mb-1 text-sm font-bold">Select Image</p>
                  {message ? (
                    <p className="text-xs text-red-500">{message}</p>
                  ) : (
                    <p className="text-xs">
                      SVG, PNG, JPG, GIF, or Other (Max: 4MB)
                    </p>
                  )}
                </div>
              )}
            </div>
            {!image ? (
              <input
                type="file"
                ref={inputFileRef}
                onChange={handleUpload}
                id="input-file"
                className="hidden"
                disabled={pending} // <-- Disable pas lagi upload
              />
            ) : (
              <Image
                src={image}
                alt="image"
                width={640}
                height={360}
                className="rounded-md absolute aspect-video object-cover"
              />
            )}
          </label>
          <div aria-live="polite" aria-atomic="true">
            <span className="text-sm text-red-500 mt-2">
              {state?.error?.image}
            </span>
          </div>

          <div className="mb-4">
            <select
              name="type"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select Sport Type..
              </option>
              {Object.values(SportType).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ").charAt(0).toUpperCase() +
                    type.replace(/_/g, " ").slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.type}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="address"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Address.."
            />
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.address}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="capacity"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Capacity.."
            />
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.capacity}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="pricePerHour"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Price per Hour.."
            />
            <div aria-live="polite" aria-atomic="true">
              <span className="text-sm text-red-500 mt-2">
                {state?.error?.pricePerHour}
              </span>
            </div>
          </div>

          {/* General Message */}
          {state?.message ? (
            <div className="mb-4 bg-red-200 p-2">
              <span className="text-sm text-gray-700 mt-2">
                {state.message}
              </span>
            </div>
          ) : null}

          <button
            type="submit"
            className={clsx(
              "bg-primary text-white w-full hover:bg-primary/90 py-2.5 px-6 md:px-1 text-lg font-semibold cursor-pointer",
              { "opacity-50 cursor-progress": isPending }
            )}
            disabled={isPending || pending}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateForm;
