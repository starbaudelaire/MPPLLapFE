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
export const getAllFields = async (
  query?: string,
  location?: string,
  type?: string
) => {
  try {
    const fields = await prisma.field.findMany({
      where: {
        AND: [
          // 1. Filter Nama Lapangan (Query Utama)
          query
            ? {
                name: { contains: query, mode: "insensitive" },
              }
            : {},

          // 2. Filter Lokasi (Cari teks di dalam alamat)
          location
            ? {
                address: { contains: location, mode: "insensitive" },
              }
            : {},

          // 3. Filter Tipe Olahraga (Harus persis, misal "FUTSAL")
          type && type !== "all"
            ? {
                type: type as any,
              }
            : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { Reviews: true },
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
        Review: true,
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

// 4. Hitung Pendapatan Hari Ini (FIXED WIB VERSION)
export const getTodayRevenue = async () => {
  // Trik: Kita geser waktu server (UTC) ke WIB dulu buat nentuin "Hari ini tanggal berapa"
  const now = new Date();
  const offsetWIB = 7 * 60 * 60 * 1000; // 7 Jam dalam milisecond

  // Ini waktu "sekarang" seolah-olah kita di Jakarta
  const nowWIB = new Date(now.getTime() + offsetWIB);

  // Set jam 00:00:00 WIB
  nowWIB.setUTCHours(0, 0, 0, 0);

  // Balikin lagi ke UTC biar query DB-nya bener
  // Jadi kalo di Indo tgl 15 jam 00:00, di DB kita cari data mulai tgl 14 jam 17:00 UTC
  const startOfDayUTC = new Date(nowWIB.getTime() - offsetWIB);

  try {
    const result = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        createdAt: {
          gte: startOfDayUTC, // <-- Pake waktu yang udah dikoreksi
        },
      },
    });
    return result._sum.amount || 0;
  } catch (error) {
    return 0;
  }
};

// 5. Total Booking
export const getTotalBooking = async () => {
  try {
    const count = await prisma.reservation.count();
    return count;
  } catch (error) {
    return 0;
  }
};

// 6. Lapangan Aktif
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

// lib/data.ts

// ... (Kodingan atas biarin sama)

// ==========================================
// SECTION 3: BOOKING HELPERS (NEW)
// ==========================================

export const getBookedHours = async (fieldId: string, dateStr: string) => {
  if (!dateStr || !fieldId) return [];

  // 1. Tentukan Range Jam 00:00 - 23:59 WIB pada tanggal tersebut
  const [year, month, day] = dateStr.split("-").map(Number);

  // Start: Jam 00:00 WIB (UTC-7)
  const startOfDay = new Date(Date.UTC(year, month - 1, day, -7, 0, 0));

  // End: Jam 23:59 WIB (UTC-7 besoknya dikit)
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 16, 59, 59));

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        fieldId: fieldId,
        startDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        OR: [
          { Payment: { status: "PAID" } }, // Yang udah bayar
          { Payment: { status: "UNPAID" } }, // Yang booking tapi belum bayar (masih nunggu)
        ],
      },
      select: {
        startDate: true,
      },
    });

    // 2. Ambil jam-nya aja dari data reservasi
    // Kita convert balik ke jam WIB (Human Readable) buat dikirim ke Frontend
    const bookedHours = reservations.map((res) => {
      // res.startDate itu UTC. Kita ubah ke string jam WIB.
      // Contoh: UTC 03:00 -> WIB 10:00
      const dateInWIB = new Date(res.startDate.getTime() + 7 * 60 * 60 * 1000);
      const hour = dateInWIB.getUTCHours();
      // Format jadi "08:00", "10:00"
      return `${hour.toString().padStart(2, "0")}:00`;
    });

    return bookedHours;
  } catch (error) {
    console.error("Gagal ambil jadwal booked:", error);
    return [];
  }
};
