"use server";

import { auth } from "@/auth";
import { FieldSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
// Import dari data.ts buat dipake di jembatan bawah
import { getBookedHours as fetchBookedHoursData } from "./data";

// ==========================================
// SECTION 1: ADMIN CRUD FIELD
// ==========================================

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
          create: amenities?.map((amenityId) => ({ amenitiesId: amenityId })),
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

export const deleteField = async (id: string) => {
  try {
    await prisma.field.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete field:", error);
    return { message: "Database Error: Failed to Delete Field." };
  }
  revalidatePath("/admin/field");
};

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
        FieldAmenities: {
          deleteMany: {},
          create: amenities?.map((amenityId) => ({ amenitiesId: amenityId })),
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
// SECTION 2: BOOKING ENGINE
// ==========================================

async function checkAvailability(
  fieldId: string,
  startDate: Date,
  endDate: Date
) {
  const expiredTime = new Date(Date.now() - 15 * 60 * 1000);

  const existingReservation = await prisma.reservation.findFirst({
    where: {
      fieldId: fieldId,
      AND: [
        { startDate: { lt: endDate } },
        { endDate: { gt: startDate } },
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
    include: { Payment: true },
  });

  return !existingReservation;
}

// Helper Parsing WIB
const parseWIB = (str: string) => {
  if (!str) return null;
  const parts = str.split("T");
  if (parts.length < 2) return null;

  const datePart = parts[0];
  const timePart = parts[1];

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (isNaN(year) || isNaN(hour)) return null;

  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0));
};

export const createReservation = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Login dulu bos!" };
  const userId = session.user.id;

  const fieldId = formData.get("fieldId") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const totalAmount = Number(formData.get("price"));

  const startDate = parseWIB(startDateStr);
  const endDate = parseWIB(endDateStr);

  if (
    !startDate ||
    !endDate ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    return { error: "Format tanggal ngaco nih! Coba refresh." };
  }

  const isAvailable = await checkAvailability(fieldId, startDate, endDate);

  if (!isAvailable) {
    return { error: "Yah, telat! Jam segitu udah dibooking orang lain bro." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: { userId, fieldId, startDate, endDate, price: totalAmount },
      });

      await tx.payment.create({
        data: {
          amount: totalAmount,
          status: "UNPAID",
          reservationId: reservation.id,
          method: "QARIS_DUMMY",
        },
      });
    });
  } catch (error) {
    console.error("Booking Failed:", error);
    return { error: "Sistem error nih, gagal booking." };
  }

  revalidatePath("/field");
  redirect(`/myreservation`);
};

// ==========================================
// SECTION 3: ADMIN DASHBOARD ACTIONS
// ==========================================

export const updateReservationStatus = async (formData: FormData) => {
  const reservationId = formData.get("reservationId") as string;
  const newStatus = formData.get("status") as string;

  if (!reservationId || !newStatus) return;

  try {
    await prisma.payment.update({
      where: { reservationId: reservationId },
      data: { status: newStatus },
    });
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Gagal update status:", error);
  }
};

// ==========================================
// SECTION 4: CLIENT DATA FETCHERS (BRIDGE)
// ==========================================
export const getBookedHours = async (fieldId: string, dateStr: string) => {
  return await fetchBookedHoursData(fieldId, dateStr);
};

// ==========================================
// SECTION 5: REVIEW SYSTEM (NEW FIX)
// ==========================================

export const createReview = async (formData: FormData) => {
  // 1. Debugging: Cek apakah function kepanggil
  console.log("🚀 createReview dipanggil!");

  const session = await auth();
  if (!session?.user?.id) {
    console.log("❌ Error: User gak ada session");
    return { error: "Sesi habis, login lagi gih." };
  }

  const reservationId = formData.get("reservationId") as string;
  const fieldId = formData.get("fieldId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  // 2. Debugging: Cek data yang masuk
  console.log("📦 Data Review:", { reservationId, fieldId, rating, comment });

  if (!rating || !comment) return { error: "Bintang & Komen wajib diisi!" };
  if (!reservationId || !fieldId) return { error: "Data ID tidak valid (Corrupt)." };

  try {
    // 3. Validasi Booking
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) return { error: "Booking tidak ditemukan." };
    if (reservation.userId !== session.user.id) return { error: "Bukan bookingan lo!" };

    // 4. Simpan ke Database
    await prisma.review.create({
      data: {
        userId: session.user.id,
        fieldId: fieldId,
        reservationId: reservationId,
        rating: rating,
        comment: comment,
      },
    });

    console.log("✅ Review sukses masuk DB!");

  } catch (error) {
    console.error("🔥 Error Prisma:", error);
    return { error: "Gagal simpan ke database." };
  }

  // 5. Refresh Halaman (Tanpa Redirect)
  revalidatePath("/myreservation");
  revalidatePath(`/field/${fieldId}`);
  
  return { success: true };
};