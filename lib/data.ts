// lib/data.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
// ... imports lain

// 1. Ambil SATU lapangan (untuk Halaman Detail)
export const getFieldById = async (id: string) => {
  try {
    const field = await prisma.field.findUnique({
      where: { id },
      include: { FieldAmenities: { include: { Amenities: true } } },
    });
    return field;
  } catch (error) {
    return null;
  }
};

<<<<<<< HEAD
// ... function getAmenities yang udah ada biarin aja ...
export const getTodayRevenue = async () => {
  // Opsional: Cek session kalo mau protect banget
  // const session = await auth();
  // if (!session || session.user.role !== "admin") return 0; 

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const result = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "PAID", // Inget, pastiin statusnya match sama DB lo
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return result._sum.amount || 0;
  } catch (error) {
    console.log("Error fetching revenue:", error);
    return 0; // Return 0 kalo error biar UI gak crash
  }
};

// lib/data.ts

// ... import & function sebelumnya (getAmenities, getTodayRevenue) ...

export const getTotalBooking = async () => {
  try {
    // Kita hitung reservasi yang pembayarannya SUKSES (PAID)
    const count = await prisma.reservation.count({
      where: {
        Payment: {
          status: "PAID", 
        },
      },
    });
    return count;
  } catch (error) {
    console.log("Error fetching total booking:", error);
    return 0;
  }
};

export const getTotalActiveFields = async () => {
  try {
    // Hitung total lapangan yang lo punya
    const count = await prisma.field.count();
    return count;
  } catch (error) {
    console.log("Error fetching total fields:", error);
    return 0;
  }
};

// lib/data.ts

// ... function yang udah ada (getTodayRevenue, dll) biarin aja ...

export const getAllReservations = async () => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        User: {
          select: { name: true, email: true }, // Ambil nama & email user aja
        },
        Field: {
          select: { name: true }, // Ambil nama lapangan
        },
        Payment: {
          select: { status: true }, // Ambil status pembayaran
        },
      },
      orderBy: {
        createdAt: "desc", // Yang paling baru booking muncul paling atas
      },
    });
    return reservations;
  } catch (error) {
    console.log("Error fetching reservations:", error);
=======
// 2. Ambil BANYAK lapangan (untuk Homepage + Filter)
export const getAllFields = async (query?: string, type?: string) => {
  try {
    const fields = await prisma.field.findMany({
      where: {
        AND: [
          // Filter nama/lokasi jika ada search query
          query ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { address: { contains: query, mode: "insensitive" } },
            ],
          } : {},
          // Filter tipe olahraga
          type ? { type: type as any } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return fields;
  } catch (error) {
    console.error("Error fetching fields:", error);
    return [];
  }
};

// 3. Ambil Booking User (untuk Dashboard)
export const getUserReservations = async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: session.user.id },
      include: {
        Field: true, // Join ke Field biar dapet nama lapangan & gambar
        Payment: true, // Join ke Payment biar tau status bayar
      },
      orderBy: { createdAt: "desc" },
    });
    return reservations;
  } catch (error) {
>>>>>>> origin/feature/customer-ui
    return [];
  }
};