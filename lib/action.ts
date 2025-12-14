"use server";

import { FieldSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma"; // Kita standarkan importnya
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ==========================================
// SECTION 1: ADMIN ACTIONS (CRUD by Dev 2)
// ==========================================

// --- 1. SAVE FIELD (CREATE) ---
export const saveField = async (_prevState: unknown, formData: FormData) => {
  const amenitiesIds = formData.getAll("amenities") as string[];

  // Logic Dev 2: Handle data form & amenities
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    capacity: formData.get("capacity"),
    pricePerHour: formData.get("pricePerHour"),
    type: formData.get("type"),
    image: formData.get("image"), // Dev 2 pake FormData langsung
    amenities: amenitiesIds,
  };

  const validatedFields = FieldSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Field.",
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
            amenitiesId: amenityId,
          })),
        },
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

// --- 3. UPDATE FIELD ---
export const updateField = async (
  id: string,
  _prevState: unknown,
  formData: FormData
) => {
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

// ==========================================
// SECTION 2: BOOKING LOGIC (Engine by Dev 1)
// ==========================================

// Helper 1: Cek jadwal bentrok
async function checkAvailability(
  fieldId: string,
  startDate: Date,
  endDate: Date
) {
  // Batas waktu pembayaran: 15 menit yang lalu
  const expiredTime = new Date(Date.now() - 15 * 60 * 1000);

  const existingReservation = await prisma.reservation.findFirst({
    where: {
      fieldId: fieldId,
      AND: [
        // 1. Cek Tabrakan Waktu
        { startDate: { lt: endDate } },
        { endDate: { gt: startDate } },

        // 2. Cek Status Pembayaran
        {
          OR: [
            { Payment: { status: "PAID" } },
            {
              AND: [
                { Payment: { status: "UNPAID" } },
                { createdAt: { gt: expiredTime } },
              ],
            },
          ],
        },
      ],
    },
    include: {
      Payment: true,
    },
  });

  return !existingReservation;
}

// Helper 2: Bikin Kode Invoice Unik (Optional)
function generateInvoiceCode() {
  const date = new Date();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${date.toISOString().slice(0, 10).replace(/-/g, "")}-${random}`;
}

// ACTION: Create Reservation
export const createReservation = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const fieldId = formData.get("fieldId") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const totalAmount = Number(formData.get("price"));

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // 1. Cek Availability
  const isAvailable = await checkAvailability(fieldId, startDate, endDate);

  if (!isAvailable) {
    return { error: "Yah, telat! Jam segitu udah dibooking orang lain bro." };
  }

  let newReservationId = "";

  try {
    // 2. Transaksi Database
    const result = await prisma.$transaction(async (tx) => {
      // A. Bikin Reservasi
      const reservation = await tx.reservation.create({
        data: {
          userId,
          fieldId,
          startDate,
          endDate,
          price: totalAmount,
        },
      });

      // B. Bikin Payment
      await tx.payment.create({
        data: {
          amount: totalAmount,
          status: "UNPAID",
          reservationId: reservation.id,
          method: "QARIS_DUMMY",
        },
      });

      return reservation;
    });

    newReservationId = result.id;
    console.log(`Booking Sukses! ID: ${newReservationId}`);
  } catch (error) {
    console.error("Booking Failed:", error);
    return { error: "Sistem error nih, gagal booking. Coba refresh yak." };
  }

  revalidatePath("/field");
  redirect(`/booking/success?id=${newReservationId}`);
};
