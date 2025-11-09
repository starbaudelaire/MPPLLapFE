import { object, string, array, coerce, nativeEnum } from "zod";
import { SportType } from "@/app/generated/prisma/client"; // <-- Impor Enumnya

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
