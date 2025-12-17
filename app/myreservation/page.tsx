import { auth } from "@/auth";
import { getUserReservations } from "@/lib/data";
import { redirect } from "next/navigation";
import HeaderSection from "@/components/header-section";
import MyReservationList from "@/components/my-reservation-list"; // Import komponen baru

export default async function MyReservationPage() {
  // 1. Cek Auth di Server
  const session = await auth();
  if (!session) redirect("/signin");

  // 2. Ambil Data (Aman karena ini Server Component)
  const rawReservations = await getUserReservations();

  // 3. Sanitasi Data (PENTING!)
  // Prisma balikin object Date, tapi Client Component minta String/JSON.
  // Kita konversi dulu biar ga error "Serialization Error".
  const reservations = JSON.parse(JSON.stringify(rawReservations));

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection
        title="Schedules & Bookings"
        subTitle="Keep track of your upcoming and past reservations in one place."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 4. Oper data ke Client Component */}
        <MyReservationList reservations={reservations} />
      </div>
    </div>
  );
}
