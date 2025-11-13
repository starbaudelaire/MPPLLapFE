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
});
