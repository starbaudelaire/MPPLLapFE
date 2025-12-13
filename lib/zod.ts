// lib/zod.ts
import { object, string, array, coerce, nativeEnum } from "zod";
import { SportType } from "@/app/generated/prisma/client"; //

export const FieldSchema = object({
  name: string().min(1, "Name is required"),
  description: string().min(10, "Description must be at least 10 characters"),
  address: string().min(5, "Address is required"),
  capacity: coerce.number().min(1, "Capacity must be at least 1"),
  pricePerHour: coerce.number().min(0, "Price must be positive"),
  type: nativeEnum(SportType, {
    message: "Please select a sport type" 
  }),
  image: string().min(1, "Image is required"), // Ini URL gambar dari Vercel Blob
  amenities: array(string()).optional(), // Array of ID amenities
});