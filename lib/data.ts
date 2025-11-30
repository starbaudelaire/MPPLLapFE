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
    return [];
  }
};