"use server";

import { auth } from "@/auth";
import { FieldSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getBookedHours as fetchBookedHoursData } from "./data";

// ==========================================
// 1. ADMIN - CRUD FIELD
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
    return { message: "Database Error: Failed to Create Field." };
  }

  revalidatePath("/admin/field");
  redirect("/admin/field");
};

export const deleteField = async (id: string) => {
  try {
    await prisma.field.delete({ where: { id } });
  } catch (error) {
    return { message: "Database Error: Failed to Delete Field." };
  }
  revalidatePath("/admin/field");
};

export const updateField = async (
  id: string,
  _prevState: unknown,
  formData: FormData
) => {
  // Logic update sederhana
  const amenitiesIds = formData.getAll("amenities") as string[];
  // (Implementasi update detail bisa ditambahkan di sini sesuai kebutuhan)
  revalidatePath("/admin/field");
  redirect("/admin/field");
};

// ==========================================
// 2. BOOKING ENGINE
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

const parseWIB = (str: string) => {
  if (!str) return null;
  const parts = str.split("T");
  if (parts.length < 2) return null;
  const [year, month, day] = parts[0].split("-").map(Number);
  const [hour, minute] = parts[1].split(":").map(Number);
  if (isNaN(year) || isNaN(hour)) return null;
  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0));
};

export const createReservation = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Login required" };
  const userId = session.user.id;

  const fieldId = formData.get("fieldId") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const totalAmount = Number(formData.get("price"));

  const startDate = parseWIB(startDateStr);
  const endDate = parseWIB(endDateStr);
  if (!startDate || !endDate) return { error: "Invalid Date" };

  const isAvailable = await checkAvailability(fieldId, startDate, endDate);
  if (!isAvailable) return { error: "Booked already" };

  let reservationId = "";
  try {
    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: { userId, fieldId, startDate, endDate, price: totalAmount },
      });
      await tx.payment.create({
        data: {
          amount: totalAmount,
          status: "UNPAID",
          reservationId: reservation.id,
        },
      });
      return reservation;
    });
    reservationId = result.id;
  } catch (error) {
    return { error: "Booking Failed" };
  }

  // Redirect ke halaman pembayaran
  redirect(`/booking/payment/${reservationId}`);
};

// ==========================================
// 3. PAYMENT & USER ACTIONS (YANG HILANG TADI)
// ==========================================

export const confirmPayment = async (reservationId: string) => {
  try {
    await prisma.payment.update({
      where: { reservationId },
      data: { status: "PAID", method: "QRIS" },
    });
  } catch (error) {
    console.error("Payment Error", error);
  }
  revalidatePath("/myreservation");
  redirect("/booking/success");
};

export const cancelReservation = async (reservationId: string) => {
  try {
    await prisma.reservation.delete({ where: { id: reservationId } });
  } catch (error) {
    console.error("Cancel Error", error);
  }
  revalidatePath("/");
  redirect("/");
};

// ==========================================
// 4. ADMIN REVENUE (YANG HILANG TADI)
// ==========================================

export const getRevenueData = async () => {
  // Ambil semua lapangan beserta reservasi yg sudah bayar
  const fields = await prisma.field.findMany({
    include: {
      Reservations: {
        where: { Payment: { status: "PAID" } },
        include: { Payment: true },
      },
    },
  });

  // Hitung revenue per lapangan
  const revenueData = fields.map((field) => {
    const totalRevenue = field.Reservations.reduce(
      (acc, curr) => acc + curr.price,
      0
    );
    return {
      fieldId: field.id,
      fieldName: field.name,
      totalRevenue,
      totalBookings: field.Reservations.length,
    };
  });

  return revenueData;
};

export const getAppRevenueHistory = async () => {
  const payments = await prisma.payment.findMany({
    where: { status: "PAID" },
    include: { Reservation: { include: { User: true, Field: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return payments;
};

export const getFieldRevenueDetail = async (fieldId: string) => {
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
    include: {
      Reservations: {
        where: { Payment: { status: "PAID" } },
        include: { User: true, Payment: true },
        orderBy: { startDate: "desc" },
      },
    },
  });
  return field;
};

// ==========================================
// 5. REVIEW SYSTEM
// ==========================================

export const createReview = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Login required" };

  const fieldId = formData.get("fieldId") as string;
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;

  try {
    await prisma.review.create({
      data: { userId: session.user.id, fieldId, rating, comment },
    });
    revalidatePath(`/field/${fieldId}`);
    return { success: true };
  } catch (error) {
    return { error: "Review failed" };
  }
};

// ==========================================
// 6. BRIDGE (HELPER)
// ==========================================
export const getBookedHours = async (fieldId: string, dateStr: string) => {
  return await fetchBookedHoursData(fieldId, dateStr);
};

// ==========================================
// 7. ADMIN DASHBOARD ACTIONS (TAMBAHAN)
// ==========================================

// lib/action.ts (Bagian paling bawah)

export const updateReservationStatus = async (formData: FormData) => {
  const reservationId = formData.get("reservationId") as string;
  const status = formData.get("status") as any;

  // HAPUS return object, ganti jadi return kosong atau throw
  if (!reservationId || !status) {
    console.error("Update Status Gagal: Data tidak lengkap");
    return;
  }

  try {
    await prisma.payment.update({
      where: { reservationId },
      data: { status },
    });
  } catch (error) {
    console.error("Update Status Error", error);
    // HAPUS return { message: ... }
    return;
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/revenue");
};
