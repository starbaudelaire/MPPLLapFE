<<<<<<< HEAD
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
=======
//lanjutin sebelumnya
import { object, string, array, coerce } from "zod";

//paling atas
export const RoomSchema = object({
  name: string().min(1, { message: "Name is required." }),
  description: string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  capacity: coerce
    .number()
    .gt(0, { message: "Capacity must be greater than 0." }),
  price: coerce.number().gt(0, { message: "Price must be greater than 0." }),
  amenities: array(string()).nonempty({
    message: "At least one amenity must be selected.",
  }),
});

// --- BARU DITAMBAHKAN ---
// Schema untuk validasi contact form
export const ContactSchema = object({
  name: string().min(1, { message: "Name is required." }),
  email: string().email({ message: "Invalid email address." }),
  subject: string().min(1, { message: "Subject is required." }),
  message: string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
>>>>>>> 6b95ac595be896b665f0ca7ad6defc0fdd406e70
});
