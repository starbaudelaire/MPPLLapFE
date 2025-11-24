import { object, string, array, coerce, nativeEnum } from "zod";
import { SportType } from "@prisma/client"; // ✅ AMBIL DARI NODE_MODULES // <-- Impor Enumnya
import { z } from "zod";

export const FieldSchema = object({
  name: string().min(1),
  description: string().min(50),
  capacity: coerce.number().gt(0), // Ganti ke coerce
  pricePerHour: coerce.number().gt(0), // <-- ganti jadi pricePerHour
  image: string().min(1), // <-- Validasi image (ngga perlu URL)
  address: string().min(5), // <-- tambah
  type: nativeEnum(SportType), // <-- tambah
  amenities: array(string()).nonempty(), // <-- amenities dari repo lama
});

export const ContactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is too short"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
