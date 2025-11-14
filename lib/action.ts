<<<<<<< HEAD
// lib/action.ts

"use server"; // <-- Tambahin "use server" di atas

import { FieldSchema } from "@/lib/zod"; // <-- Ganti RoomSchema jadi FieldSchema
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

// Ganti nama fungsi dan parameternya
export const saveField = async (
  image: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Image is Required." };

  // Sesuaikan sama field baru
=======
"use server"; // Pastikan ini ada di paling atas

import { RoomSchema, ContactSchema } from "@/lib/zod"; // Impor ContactSchema
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Untuk refresh data

// --- State Awal (Biar rapi) ---
export type FormState = {
  status: "success" | "error" | "idle";
  message: string;
  errors?: {
    name?: string[];
    description?: string[];
    capacity?: string[];
    price?: string[];
    amenities?: string[];
    subject?: string[];
    email?: string[];
    message?: string[];
    _form?: string[];
  };
};

// --- ACTION UNTUK ROOM ---
export const saveRoom = async (
  image: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> => {
  if (!image) {
    return {
      status: "error",
      message: "Image is required.",
      errors: { _form: ["Image is required."] },
    };
  }

>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
<<<<<<< HEAD
    pricePerHour: formData.get("pricePerHour"), // <-- Ganti
    amenities: formData.getAll("amenities"),
    image: image, // <-- Tambah
    address: formData.get("address"), // <-- Tambah
    type: formData.get("type"), // <-- Tambah
  };

  const validateFields = FieldSchema.safeParse(rawData); // <-- Ganti
  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  // Destructure data baru
  const {
    name,
    description,
    pricePerHour,
    capacity,
    amenities,
    address,
    type,
  } = validateFields.data;

  try {
    // Ganti prisma.room.create jadi prisma.field.create
    await prisma.field.create({
=======
    price: formData.get("price"),
    amenities: formData.getAll("amenities"),
  };

  const validateFields = RoomSchema.safeParse(rawData);
  if (!validateFields.success) {
    return {
      status: "error",
      message: "Failed to create room. Please check your inputs.",
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, capacity, amenities } = validateFields.data;

  try {
    await prisma.room.create({
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
      data: {
        name,
        description,
        image,
<<<<<<< HEAD
        pricePerHour, // <-- Ganti
        capacity,
        address, // <-- Tambah
        type, // <-- Tambah
        FieldAmenities: {
          // <-- Ganti RoomAmenties
=======
        price,
        capacity,
        RoomAmenties: {
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
          createMany: {
            data: amenities.map((item) => ({
              amenitiesId: item,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
<<<<<<< HEAD
    return { message: "Failed to create field." }; // <-- Kasih error message
  }
  redirect("/admin/field"); // <-- Ganti redirect
=======
    return {
      status: "error",
      message: "Database error: Failed to create room.",
      errors: { _form: ["Database error: Failed to create room."] },
    };
  }

  revalidatePath("/admin/room"); // Revalidate path admin
  revalidatePath("/room"); // Revalidate path public
  redirect("/admin/room"); // Redirect setelah sukses
};

// --- BARU DITAMBAHKAN ---
// Server Action untuk Contact Form
export const contactAction = async (
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> => {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  // Validasi pake Zod
  const validateFields = ContactSchema.safeParse(rawData);

  // Kalo validasi gagal
  if (!validateFields.success) {
    return {
      status: "error",
      message: "Failed to send message. Please check your inputs.",
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validateFields.data;

  // Kalo validasi sukses, simpen ke DB
  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // Kirim response sukses
    revalidatePath("/contact"); // Oprional, tapi good practice
    return {
      status: "success",
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Database error: Failed to send message.",
      errors: { _form: ["Database error: Failed to send message."] },
    };
  }
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
};
