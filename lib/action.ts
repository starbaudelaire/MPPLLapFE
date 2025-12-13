"use server";

import { FieldSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- 1. SAVE FIELD (CREATE) ---
export const saveField = async (_prevState: unknown, formData: FormData) => {
  const amenitiesIds = formData.getAll("amenities") as string[];
  
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    capacity: formData.get("capacity"),
    pricePerHour: formData.get("pricePerHour"),
    type: formData.get("type"),
    image: formData.get("image"),
    amenities: amenitiesIds,
  };

  const validatedFields = FieldSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Field.",
    };
  }

  const { name, description, address, capacity, pricePerHour, type, image, amenities } = validatedFields.data;

  try {
    await prisma.field.create({
      data: {
        name,
        description,
        address,
        capacity,
        pricePerHour,
        type,
        image,
        FieldAmenities: {
            create: amenities?.map((amenityId) => ({
                amenitiesId: amenityId
            }))
        }
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Create Field." };
  }

  revalidatePath("/admin/field");
  redirect("/admin/field");
};

// --- 2. DELETE FIELD ---
export const deleteField = async (id: string) => {
  try {
    await prisma.field.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete field:", error);
    return { message: "Database Error: Failed to Delete Field." };
  }
  revalidatePath("/admin/field");
};

// --- 3. UPDATE FIELD (BARU!) ---
export const updateField = async (id: string, _prevState: unknown, formData: FormData) => {
  const amenitiesIds = formData.getAll("amenities") as string[];

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    capacity: formData.get("capacity"),
    pricePerHour: formData.get("pricePerHour"),
    type: formData.get("type"),
    image: formData.get("image"),
    amenities: amenitiesIds,
  };

  const validatedFields = FieldSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Field.",
    };
  }

  const {
    name,
    description,
    address,
    capacity,
    pricePerHour,
    type,
    image,
    amenities,
  } = validatedFields.data;

  try {
    await prisma.field.update({
      where: { id },
      data: {
        name,
        description,
        address,
        capacity,
        pricePerHour,
        type,
        image,
        // Reset fasilitas: Hapus semua relasi lama, tambah yang baru
        FieldAmenities: {
          deleteMany: {}, 
          create: amenities?.map((amenityId) => ({
            amenitiesId: amenityId,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Update Field." };
  }

  revalidatePath("/admin/field");
  redirect("/admin/field");
};