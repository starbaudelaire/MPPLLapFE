// lib/action.ts

"use server";

import { FieldSchema } from "@/lib/zod"; 
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; // <-- Nambah ini buat refresh halaman
import { prisma } from "./prisma";

// ==========================================
// SECTION 1: ADMIN ACTIONS (Save Field)
// ==========================================

export const saveField = async (
  image: string,
  prevState: unknown,
  formData: FormData
) => {
  if (!image) return { message: "Image is Required." };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    capacity: formData.get("capacity"),
    pricePerHour: formData.get("pricePerHour"),
    amenities: formData.getAll("amenities"),
    image: image,
    address: formData.get("address"),
    type: formData.get("type"),
  };

  const validateFields = FieldSchema.safeParse(rawData);
  if (!validateFields.success) {
    return { error: validateFields.error.flatten().fieldErrors };
  }

  const {
    name,
    description,
    pricePerHour,
    capacity,
    amenities,
    address,
    type,
  } = validateFields.data;

  try {
    await prisma.field.create({
      data: {
        name,
        description,
        image,
        pricePerHour,
        capacity,
        address,
        type,
        FieldAmenities: {
          createMany: {
            data: amenities.map((item) => ({
              amenitiesId: item,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return { message: "Failed to create field." };
  }
  redirect("/admin/field");
};


// ==========================================
// SECTION 2: HELPER FUNCTIONS (Logic Dapur)
// ==========================================

// Helper 1: Cek jadwal bentrok
// lib/action.ts (Update bagian Helper)

// UPDATE FUNCTION INI AJA:
async function checkAvailability(fieldId: string, startDate: Date, endDate: Date) {
  // Batas waktu pembayaran: 15 menit yang lalu
  // Kalau reservasi dibuat sebelum jam ini & belum bayar, dianggap angus/expired
  const expiredTime = new Date(Date.now() - 15 * 60 * 1000); 

  const existingReservation = await prisma.reservation.findFirst({
    where: {
      fieldId: fieldId,
      AND: [
        // 1. Cek Tabrakan Waktu (Sama kayak yang lama)
        { startDate: { lt: endDate } },
        { endDate: { gt: startDate } },
        
        // 2. Cek Status Pembayaran (Ini logic barunya!)
        {
          OR: [
            // Kalo udah LUNAS, fix bentrok (gak bisa diganggu)
            { Payment: { status: "PAID" } },
            
            // Kalo masih UNPAID, cuma dianggap bentrok kalau:
            // "Dibuatnya BELUM 15 menit yang lalu" (masih dikasih waktu bayar)
            { 
              AND: [
                { Payment: { status: "UNPAID" } },
                { createdAt: { gt: expiredTime } } 
              ]
            }
          ]
        }
      ]
    },
    include: {
      Payment: true // Wajib include biar bisa baca statusnya
    }
  });

  // Kalo ketemu reservasi yang valid (Paid / Unpaid on-time), return false (Penuh)
  // Kalo gak ketemu (atau adanya cuma sampah unpaid basi), return true (Available)
  return !existingReservation; 
}

// Helper 2: Bikin Kode Invoice Unik
function generateInvoiceCode() {
  const date = new Date();
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  // Format: INV-20251130-1234
  return `INV-${date.toISOString().slice(0, 10).replace(/-/g, "")}-${random}`;
}


// ==========================================
// SECTION 3: USER ACTIONS (Booking Logic)
// ==========================================

// ==========================================
// SECTION 3: USER ACTIONS (Booking Logic)
// ==========================================

export const createReservation = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const fieldId = formData.get("fieldId") as string;
  const startDateStr = formData.get("startDate") as string; 
  const endDateStr = formData.get("endDate") as string;
  const totalAmount = Number(formData.get("price")); 

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // 1. Cek Availability
  const isAvailable = await checkAvailability(fieldId, startDate, endDate);
  
  if (!isAvailable) {
    return { error: "Yah, telat! Jam segitu udah dibooking orang lain bro." };
  }

  // const invoiceCode = generateInvoiceCode(); // <-- Gak butuh ini buat redirect

  let newReservationId = "";

  try {
    // 2. Transaksi Database
    // Kita tampung hasilnya ke variabel 'result'
    const result = await prisma.$transaction(async (tx) => {
      // A. Bikin Reservasi
      const reservation = await tx.reservation.create({
        data: {
          userId,
          fieldId,
          startDate,
          endDate,
          price: totalAmount,
        },
      });

      // B. Bikin Payment
      await tx.payment.create({
        data: {
          amount: totalAmount,
          status: "UNPAID",
          reservationId: reservation.id,
          method: "QARIS_DUMMY", 
        },
      });

      // PENTING: Return data reservasi biar bisa dipake di luar transaksi
      return reservation;
    });

    // Simpen ID-nya buat redirect
    newReservationId = result.id;
    console.log(`Booking Sukses! ID: ${newReservationId}`);
    
  } catch (error) {
    console.error("Booking Failed:", error);
    return { error: "Sistem error nih, gagal booking. Coba refresh yak." };
  }

  // 3. Redirect pake ID (Biar Dev 3 gampang fetch datanya)
  revalidatePath("/field"); 
  redirect(`/booking/success?id=${newReservationId}`); 
};