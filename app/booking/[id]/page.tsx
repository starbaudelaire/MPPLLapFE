import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PaymentForm from "./payment-form"; 

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  
  if (!session) redirect("/signin");

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      Field: true,
      Payment: true,
    },
  });

  if (!reservation || !reservation.Payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-500">Data booking gak ketemu bro.</h1>
      </div>
    );
  }

  const { Field, Payment, price } = reservation;
  
  // Logic Breakdown Angka
  const fieldPrice = price; // Harga asli dari table Reservation
  const totalAmount = Payment.amount; // Harga Total dari table Payment (udah + fee + kode)
  const appFee = Math.floor(fieldPrice * 0.10); // Hitung ulang fee 10%
  
  // Sisanya adalah Kode Unik
  const uniqueCode = totalAmount - fieldPrice - appFee;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Selesaikan Pembayaran
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Kiri: Detail Booking (SAMA AJA KAYAK SEBELUMNYA) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rincian Booking</h2>
              <div className="flex gap-4 mb-4">
                <img 
                  src={Field.image} 
                  alt={Field.name} 
                  className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{Field.name}</h3>
                  <p className="text-sm text-gray-500">{Field.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500">Tanggal</p>
                  <p className="font-medium text-gray-900">
                    {reservation.startDate.toLocaleDateString("id-ID", { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Jam</p>
                  <p className="font-medium text-gray-900">
                    {reservation.startDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} - 
                    {reservation.endDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                </div>
              </div>
            </div>

            <PaymentForm reservationId={reservation.id} totalAmount={totalAmount} />
          </div>

          {/* Kolom Kanan: Summary Harga (UPDATED ADA KODE UNIK) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Tagihan</h3>
              
              <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Sewa Lapangan</span>
                  <span>Rp {fieldPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>App Fee (10%)</span>
                  <span>Rp {appFee.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  <span>Kode Unik</span>
                  <span>+ Rp {uniqueCode}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Total Bayar</span>
                {/* Tambahin whitespace-nowrap biar Rp nya gak turun */}
                <span className="font-bold text-xl text-[#f64e42] whitespace-nowrap">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
                         
              <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-100">
                ⚠️ Mohon transfer <b>TEPAT</b> sampai 3 digit terakhir agar pembayaran anda dapat terverifikasi.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}