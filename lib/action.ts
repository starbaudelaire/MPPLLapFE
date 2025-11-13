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

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
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
      data: {
        name,
        description,
        image,
        price,
        capacity,
        RoomAmenties: {
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
};
