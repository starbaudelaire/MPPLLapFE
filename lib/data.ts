// lib/data.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getAmenities = async () => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized Access");
  }
  try {
    // Ganti 'amenity' jadi 'amenities' sesuai schema
    const result = await prisma.amenities.findMany();
    return result;
  } catch (error) {
    console.log(error);
  }
};

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
    return [];
  }
};