<<<<<<< HEAD
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
=======

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70

export const getAmenities = async () => {
  // Lo ga perlu session di sini, data amenities itu publik
  //   const session = await auth();
  //   if (!session || !session.user) {
  //     throw new Error("Unauthorized Access");
  //   }
  try {
    const result = await prisma.amenities.findMany();
    return result;
  } catch (error) {
    console.log(error);
  }
};

// --- BARU DITAMBAHIN (MISI 2) ---
// Fungsi buat ngambil SEMUA lapangan
export const getFields = async () => {
  try {
    const fields = await prisma.field.findMany({
      // Urutkan berdasarkan kapan dibuat, yang baru di atas
      orderBy: {
        createdAt: "desc",
      },
    });
    return fields;
  } catch (error) {
    console.log(error);
    return []; // Kembalikan array kosong kalo error
  }
};
