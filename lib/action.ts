// lib/action.ts

"use server"; // <-- Tambahin "use server" di atas

import { FieldSchema } from "@/lib/zod"; // <-- Ganti RoomSchema jadi FieldSchema
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { ContactSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";

// Ganti nama fungsi dan parameternya
export const saveField = async (
  image: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Image is Required." };

  // Sesuaikan sama field baru
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
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
      data: {
        name,
        description,
        image,
        pricePerHour, // <-- Ganti
        capacity,
        address, // <-- Tambah
        type, // <-- Tambah
        FieldAmenities: {
          // <-- Ganti RoomAmenties
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
    return { message: "Failed to create field." }; // <-- Kasih error message
  }
  redirect("/admin/field"); // <-- Ganti redirect
};
export const sendMessage = async (prevState: unknown, formData: FormData) => {
  const validatedFields = ContactSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

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
  } catch (error) {
    return { message: "Failed to send message" };
  }

  return { message: "Message sent successfully!" };
};
