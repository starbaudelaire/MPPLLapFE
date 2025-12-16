// app/api/payment/notification/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Definisikan tipe untuk Enum PaymentStatus biar aman (Opsional, tapi Good Practice)
type PaymentStatus = "UNPAID" | "PAID" | "CANCELLED";

export async function POST(request: Request) {
  // 1. Baca data yang dikirim sama Payment Gateway (Webhook)
  const body = await request.json();
  
  // Midtrans/Gateway biasanya kirim data kayak gini
  const { reservationId, transactionStatus, paymentType } = body;

  // Validasi bentar
  if (!reservationId) {
    return NextResponse.json({ message: "Invalid Data: No Reservation ID" }, { status: 400 });
  }

  // 2. Mapping Status: Bahasa Gateway -> Bahasa Database Kita
  // Default status
  let dbStatus: PaymentStatus = "UNPAID";
  
  // Kalo statusnya 'settlement' (lunas) atau 'capture' (kartu kredit sukses)
  if (transactionStatus === "settlement" || transactionStatus === "capture") {
    dbStatus = "PAID";
  } 
  // Kalo gagal/cancel/expire
  else if (transactionStatus === "expire" || transactionStatus === "cancel" || transactionStatus === "deny") {
    dbStatus = "CANCELLED"; // <--- ✅ FIX: "FAILED" diganti jadi "CANCELLED" sesuai Schema Prisma
  }

  try {
    // 3. Update Status di Database
    // Kita cari Payment yang punya reservationId tersebut
    await prisma.payment.update({
      where: { reservationId: reservationId }, 
      data: {
        status: dbStatus, // Sekarang aman, nilainya pasti UNPAID, PAID, atau CANCELLED
        method: paymentType || "bank_transfer", // Simpen juga dia bayar pake apa
      },
    });

    console.log(`Payment Updated: ${reservationId} -> ${dbStatus}`);
    
    // Wajib return 200 OK biar Gateway tau kita udah terima infonya
    return NextResponse.json({ message: "Payment status updated", status: "OK" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}