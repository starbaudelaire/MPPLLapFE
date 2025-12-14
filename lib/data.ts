import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ==========================================
// SECTION 1: CUSTOMER DATA (Dev 3)
// ==========================================

// 1. Ambil SATU lapangan (untuk Halaman Detail)
export const getFieldById = async (id: string) => {
  try {
    const field = await prisma.field.findUnique({
      where: { id },
      include: {
        FieldAmenities: {
          include: { Amenities: true },
        },
      },
    });
    return field;
  } catch (error) {
    console.error("Error fetching field:", error);
    return null;
  }
};

// 2. Ambil BANYAK lapangan (untuk Homepage + Filter)
export const getAllFields = async (query?: string, type?: string) => {
  try {
    const fields = await prisma.field.findMany({
      where: {
        AND: [
          // Filter nama/lokasi jika ada search query
          query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { address: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
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

// 3. Ambil Booking User (untuk Dashboard User)
export const getUserReservations = async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: session.user.id },
      include: {
        Field: true,
        Payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return reservations;
  } catch (error) {
    console.error("Error user reservations:", error);
    return [];
  }
};

// ==========================================
// SECTION 2: ADMIN DASHBOARD DATA (Dev 4)
// ==========================================

// 4. Hitung Pendapatan Hari Ini (PAID only)
export const getTodayRevenue = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set ke jam 00:00 hari ini

  try {
    const result = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        createdAt: {
          gte: today, // Dari jam 00:00 hari ini ke atas
        },
      },
    });
    return result._sum.amount || 0;
  } catch (error) {
    return 0;
  }
};

// 5. Total Booking (FIXED NAME: getTotalBookings -> getTotalBooking)
export const getTotalBooking = async () => {
  try {
    const count = await prisma.reservation.count();
    return count;
  } catch (error) {
    return 0;
  }
};

// 6. Lapangan Aktif (FIXED NAME: getActiveFields -> getTotalActiveFields)
export const getTotalActiveFields = async () => {
  try {
    const count = await prisma.field.count();
    return count;
  } catch (error) {
    return 0;
  }
};

// 7. Ambil SEMUA Reservasi (Buat Tabel Admin)
export const getAllReservations = async () => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        User: true, // Biar tau siapa yang booking
        Field: true, // Biar tau lapangan apa
        Payment: true, // Biar tau status bayar
      },
      orderBy: { createdAt: "desc" },
    });
    return reservations;
  } catch (error) {
    console.error("Error admin reservations:", error);
    return [];
  }
};
