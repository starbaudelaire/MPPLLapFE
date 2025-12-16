import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ==========================================
// SECTION 1: CUSTOMER DATA
// ==========================================

// 1. Ambil SATU lapangan (untuk Halaman Detail / Edit)
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
          // Filter Nama
          query ? { name: { contains: query, mode: "insensitive" } } : {},
          // Filter Lokasi
          location
            ? { address: { contains: location, mode: "insensitive" } }
            : {},
          // Filter Tipe
          type && type !== "all" ? { type: type as any } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      // Include Rating buat di Card
      include: {
        Reviews: {
          select: { rating: true },
        },
      },
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
// SECTION 2: ADMIN DASHBOARD DATA (YANG TADI HILANG)
// ==========================================

// 4. Hitung Pendapatan Hari Ini
export const getTodayRevenue = async () => {
  const now = new Date();
  const offsetWIB = 7 * 60 * 60 * 1000;
  const nowWIB = new Date(now.getTime() + offsetWIB);
  nowWIB.setUTCHours(0, 0, 0, 0);
  const startOfDayUTC = new Date(nowWIB.getTime() - offsetWIB);

  try {
    const result = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        createdAt: {
          gte: startOfDayUTC,
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
        User: true,
        Field: true,
        Payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return reservations;
  } catch (error) {
    console.error("Error admin reservations:", error);
    return [];
  }
};

// ==========================================
// SECTION 3: BOOKING HELPERS (FIXED LOOP LOGIC)
// ==========================================

export const getBookedHours = async (fieldId: string, dateStr: string) => {
  if (!dateStr || !fieldId) return [];

  const [year, month, day] = dateStr.split("-").map(Number);
  // Start: Jam 00:00 WIB
  const startOfDay = new Date(Date.UTC(year, month - 1, day, -7, 0, 0));
  // End: Jam 23:59 WIB
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 16, 59, 59));

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        fieldId: fieldId,
        // Cari yang overlap dengan hari ini
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay },
        OR: [
          { Payment: { status: "PAID" } },
          { Payment: { status: "UNPAID" } },
        ],
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    const bookedHours: string[] = [];

    reservations.forEach((res) => {
      // Convert ke WIB
      let current = new Date(res.startDate.getTime() + 7 * 60 * 60 * 1000);
      const end = new Date(res.endDate.getTime() + 7 * 60 * 60 * 1000);

      // Loop per jam dari Start sampai End
      while (current < end) {
        const currentYear = current.getUTCFullYear();
        const currentMonth = current.getUTCMonth() + 1;
        const currentDay = current.getUTCDate();

        // Pastikan jamnya masih di tanggal yang dipilih (biar gak bocor ke besok/kemarin)
        if (
          currentYear === year &&
          currentMonth === month &&
          currentDay === day
        ) {
          const hour = current.getUTCHours();
          const hourStr = `${hour.toString().padStart(2, "0")}:00`;

          if (!bookedHours.includes(hourStr)) {
            bookedHours.push(hourStr);
          }
        }
        // Tambah 1 jam
        current.setUTCHours(current.getUTCHours() + 1);
      }
    });

    return bookedHours;
  } catch (error) {
    console.error("Gagal ambil jadwal booked:", error);
    return [];
  }
};

// ==========================================
// SECTION 4: REVENUE BY DATE (NEW FEATURE)
// ==========================================

//
// Timpa fungsi getRevenueByDate yang lama dengan yang ini:

export const getRevenueByDate = async (dateStr: string) => {
  // 1. Setup Date Range (WIB Logic)
  const targetDate = new Date(dateStr);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Adjust ke UTC bila perlu (Server Time)
  const offset = 7 * 60 * 60 * 1000;
  const startWIB = new Date(startOfDay.getTime() - offset);
  const endWIB = new Date(endOfDay.getTime() - offset);

  try {
    // 2. Tarik Data Transaksi PAID Hari Itu
    const payments = await prisma.payment.findMany({
      where: {
        status: "PAID",
        updatedAt: {
          // Pake waktu pembayaran
          gte: startWIB,
          lte: endWIB,
        },
      },
      include: {
        Reservation: {
          select: {
            price: true, // Harga Asli Lapangan
            fieldId: true,
            Field: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // 3. Pisahin Duit Kita vs Duit Owner
    let platformRevenue = 0;
    let ownerRevenue = 0;
    const fieldStats: Record<string, any> = {};

    payments.forEach((p) => {
      const totalBayar = p.amount; // Total yang user transfer (+ kode unik)
      const hargaLapangan = p.Reservation.price; // Harga asli lapangan

      // Duit Kita = Total Transfer - Harga Asli
      const cuanKita = totalBayar - hargaLapangan;

      platformRevenue += cuanKita;
      ownerRevenue += hargaLapangan;

      // Grouping per Lapangan (Buat list di bawah)
      const fId = p.Reservation.fieldId;
      if (!fieldStats[fId]) {
        fieldStats[fId] = {
          id: fId,
          name: p.Reservation.Field.name,
          image: p.Reservation.Field.image || "/card-lapangan.jpg",
          totalOwnerRevenue: 0, // Pendapatan bersih lapangan
          bookingCount: 0,
        };
      }
      fieldStats[fId].totalOwnerRevenue += hargaLapangan;
      fieldStats[fId].bookingCount += 1;
    });

    // Convert Object ke Array & Sort
    const fieldRevenues = Object.values(fieldStats).sort(
      (a: any, b: any) => b.totalOwnerRevenue - a.totalOwnerRevenue
    );

    return {
      platformRevenue, // Duit Kita
      ownerRevenue, // Duit Lapangan
      totalCombined: platformRevenue + ownerRevenue,
      fieldRevenues,
    };
  } catch (error) {
    console.error("Error revenue breakdown:", error);
    return {
      platformRevenue: 0,
      ownerRevenue: 0,
      totalCombined: 0,
      fieldRevenues: [],
    };
  }
};
// Tambahin ini di lib/data.ts

// ... (code yang udah ada)

// ==========================================
// ==========================================
// SECTION 8: AMENITIES DATA
// ==========================================

export const getAllAmenities = async () => {
  try {
    const amenities = await prisma.amenities.findMany();
    return amenities;
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }
};
