"use server";

import { auth } from "@/auth";
import { FieldSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
// SECTION 2: BOOKING ENGINE & PAYMENT
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

  const datePart = parts[0];
  const timePart = parts[1];

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (isNaN(year) || isNaN(hour)) return null;

  // Convert WIB (UTC+7) ke UTC Native
  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0));
};

export const createReservation = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "Login dulu bos!" };
  const userId = session.user.id;

  const fieldId = formData.get("fieldId") as string;
  const startDateStr = formData.get("startDate") as string;
  
  // [PENTING] Baca durasi jam yang dikirim dari BookingCard
  const hours = Number(formData.get("hours")) || 1; 
  
  const fieldPrice = Number(formData.get("price"));

  const startDate = parseWIB(startDateStr);
  
  if (!startDate || isNaN(startDate.getTime())) {
    return { error: "Format tanggal ngaco nih! Coba refresh." };
  }

  // Hitung EndDate di server (Start + Durasi)
  const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);

  const isAvailable = await checkAvailability(fieldId, startDate, endDate);

  if (!isAvailable) {
    return { error: "Yah, telat! Jam segitu udah dibooking orang lain bro." };
  }

  // --- LOGIC HARGA & KODE UNIK ---
  const appFee = Math.floor(fieldPrice * 0.10);
  const uniqueCode = Math.floor(Math.random() * 999) + 1;
  const totalAmount = fieldPrice + appFee + uniqueCode;

  let reservationId = "";

  try {
    await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.create({
        data: { 
          userId, 
          fieldId, 
          startDate, 
          endDate, 
          price: fieldPrice 
        },
      });

      reservationId = reservation.id;

      await tx.payment.create({
        data: {
          amount: totalAmount, 
          status: "UNPAID",
          reservationId: reservation.id,
          method: null, 
        },
      });
    });
  } catch (error) {
    console.error("Booking Failed:", error);
    return { error: "Sistem error nih, gagal booking." };
  }

  revalidatePath("/field");
  redirect(`/booking/payment/${reservationId}`);
};

export const confirmPayment = async (formData: FormData) => {
  const reservationId = formData.get("reservationId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;

  if (!reservationId || !paymentMethod) {
    return { error: "Pilih metode pembayaran dulu bro!" };
  }

  try {
    await prisma.payment.update({
      where: { reservationId },
      data: { 
        method: paymentMethod,
      },
    });
  } catch (error) {
    console.error("Confirm Payment Failed:", error);
    return { error: "Gagal konfirmasi pembayaran." };
  }

  revalidatePath("/myreservation");
  redirect("/booking/success?id=" + reservationId);
};

export const cancelReservation = async (reservationId: string) => {
  if (!reservationId) return;

  try {
    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    revalidatePath("/field"); 
  } catch (error) {
    console.error("Gagal cancel booking:", error);
  }

  redirect("/");
};

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
// SECTION 4: CLIENT DATA FETCHERS
// ==========================================

export const getBookedHours = async (fieldId: string, dateStr: string) => {
  const expiredTime = new Date(Date.now() - 15 * 60 * 1000);
  
  const reservations = await prisma.reservation.findMany({
    where: {
      fieldId: fieldId,
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
    select: { startDate: true, endDate: true },
  });

  const bookedSlots: string[] = [];
  const HOUR_MS = 60 * 60 * 1000;

  reservations.forEach((res) => {
    let currentMs = res.startDate.getTime();
    const endMs = res.endDate.getTime();

    // Loop per jam sampai kurang dari end time
    while (currentMs < endMs) {
      // Konversi UTC ke WIB (+7 Jam) buat dapetin string jam yg bener
      const wibDate = new Date(currentMs + 7 * HOUR_MS);
      
      const resDateStr = wibDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const resTimeStr = wibDate.toISOString().split("T")[1].substring(0, 5); // HH:mm

      if (resDateStr === dateStr) {
        bookedSlots.push(resTimeStr);
      }

      currentMs += HOUR_MS; // Tambah 1 jam
    }
  });

  return Array.from(new Set(bookedSlots));
};

// ==========================================
// SECTION 5: REVENUE & ANALYTICS
// ==========================================

export const getRevenueData = async () => {
  // Ambil semua lapangan beserta reservasi yang SUDAH BAYAR (PAID)
  const fields = await prisma.field.findMany({
    include: {
      Reservation: {
        where: { Payment: { status: "PAID" } }, // Cuma itung yang udah lunas
        include: { Payment: true },
      },
    },
  });

  let totalAppRevenue = 0; // Buat nampung Fee + Kode Unik
  
  const fieldRevenues = fields.map((field) => {
    let fieldIncome = 0;

    field.Reservation.forEach((res) => {
      // 1. Tambahin duit jatah lapangan
      fieldIncome += res.price;

      // 2. Tambahin duit jatah App (Total Transfer - Harga Lapangan)
      if (res.Payment) {
        const appShare = res.Payment.amount - res.price;
        totalAppRevenue += appShare;
      }
    });

    return {
      id: field.id,
      name: field.name,
      image: field.image,
      totalRevenue: fieldIncome,
      bookingCount: field.Reservation.length,
    };
  });

  return {
    fieldRevenues,
    totalAppRevenue,
  };
};

export const getFieldRevenueDetail = async (fieldId: string) => {
  const field = await prisma.field.findUnique({
    where: { id: fieldId },
  });

  if (!field) return null;

  const reservations = await prisma.reservation.findMany({
    where: { 
      fieldId: fieldId,
      Payment: { status: "PAID" } 
    },
    include: { 
      User: true, 
      Payment: true 
    },
    orderBy: { startDate: "desc" },
  });

  return { field, reservations };
};

export const getAppRevenueHistory = async () => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        Payment: { status: "PAID" }, // Kita cuma mau yang udah cair alias PAID
      },
      include: {
        User: true,
        Field: true,
        Payment: true,
      },
      orderBy: { createdAt: "desc" }, // Dari yang paling fresh
    });

    // Kita mapping datanya biar enak dikonsumsi di frontend
    const history = reservations.map((res) => {
      const totalPaid = res.Payment?.amount || 0;
      const fieldPrice = res.price;
      
      // Ini logic "cuan" aplikasi lo: Total Transfer - Jatah Lapangan
      const appRevenue = totalPaid - fieldPrice; 

      return {
        id: res.id,
        bookingCode: res.id.slice(-5).toUpperCase(), // Biar ada kode booking pendek
        user: res.User.name || "User Tanpa Nama",
        userEmail: res.User.email,
        field: res.Field.name,
        date: res.startDate,
        appRevenue: appRevenue, // <--- Ini duit jatah elo
      };
    });

    return history;
  } catch (error) {
    console.error("Gagal ambil history revenue app:", error);
    return [];
  }
};

// ==========================================
// SECTION 6: REVIEW SYSTEM (NEW ADDITION)
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