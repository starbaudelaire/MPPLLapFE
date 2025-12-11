// lib/action.ts

"use server";

import { ContactSchema, FieldSchema } from "@/lib/zod"; // Gabung import zod
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { SportType } from "@prisma/client"; // Import Enum SportType (opsional, biar type-safe)

// --- ACTION: SAVE FIELD ---
export const saveField = async (
  image: string,
  prevState: unknown,
  formData: FormData
) => {
  // Cek image dulu
  if (!image) return { message: "Image is Required." };

  // Ambil amenities sebagai array string
  const amenities = formData.getAll("amenities") as string[];

  // Susun rawData.
  // Note: Pastikan FieldSchema di lib/zod.ts menggunakan z.coerce.number()
  // untuk capacity dan pricePerHour agar string otomatis jadi number.
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    pricePerHour: formData.get("pricePerHour"),
    amenities: amenities,
    image: image,
    address: formData.get("address"),
    type: formData.get("type"),
  };

  // Validasi Zod
  const validatedFields = FieldSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Destructure data yang sudah valid
  const {
    name,
    description,
    pricePerHour,
    capacity,
    amenities: validatedAmenities,
    address,
    type,
  } = validatedFields.data;

  try {
    await prisma.field.create({
      data: {
        name,
        description,
        image,
        pricePerHour,
        capacity,
        address,
        // Pastikan type yang dikirim sesuai dengan Enum SportType di Prisma
        type: type as SportType,
        FieldAmenities: {
          createMany: {
            data: validatedAmenities.map((item) => ({
              amenitiesId: item,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to create field:", error);
    return { message: "Failed to create field." };
  }

  // Revalidate agar data terbaru muncul di halaman ini
  revalidatePath("/field");
  revalidatePath("/admin/field");

  redirect("/admin/field");
};

// --- ACTION: UPDATE FIELD ---
export const updateField = async (
  id: string,
  currentImage: string,
  prevState: unknown,
  formData: FormData
) => {
  // Ambil amenities sebagai array string
  const amenities = formData.getAll("amenities") as string[];

  // Cek image dulu - jika tidak ada image baru, gunakan image yang lama
  let image = formData.get("image") as string;
  if (!image) image = currentImage;

  // Susun rawData
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    pricePerHour: formData.get("pricePerHour"),
    amenities: amenities,
    image: image,
    address: formData.get("address"),
    type: formData.get("type"),
  };

  // Validasi Zod
  const validatedFields = FieldSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Destructure data yang sudah valid
  const {
    name,
    description,
    pricePerHour,
    capacity,
    amenities: validatedAmenities,
    address,
    type,
  } = validatedFields.data;

  try {
    // Hapus dulu semua FieldAmenities yang ada
    await prisma.fieldAmenities.deleteMany({
      where: {
        fieldId: id,
      },
    });

    // Update field dengan data baru
    await prisma.field.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        image,
        pricePerHour,
        capacity,
        address,
        // Pastikan type yang dikirim sesuai dengan Enum SportType di Prisma
        type: type as SportType,
        FieldAmenities: {
          createMany: {
            data: validatedAmenities.map((item) => ({
              amenitiesId: item,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to update field:", error);
    return { message: "Failed to update field." };
  }

  // Revalidate agar data terbaru muncul di halaman ini
  revalidatePath("/admin/field");

  redirect("/admin/field");
};

// --- ACTION: DELETE FIELD ---
export const deleteField = async (id: string) => {
  try {
    await prisma.field.delete({
      where: {
        id: id,
      },
    });

    // Revalidate agar data terbaru muncul di halaman ini
    revalidatePath("/admin/field");
    return { message: "Field deleted successfully." };
  } catch (error) {
    console.error("Failed to delete field:", error);
    return { message: "Failed to delete field." };
  }
};

// --- ACTION: SEND MESSAGE ---
export const sendMessage = async (prevState: unknown, formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = ContactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.message.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        subject: validatedFields.data.subject,
        message: validatedFields.data.message,
      },
    });

    return { message: "Message sent successfully!" };
  } catch (error) {
    console.error("PRISMA ERROR:", error); // Log error biar ketahuan di terminal
    return { message: "Failed to send message" };
  }
};
