// prisma/seed.ts

// ⚠️ NOTE: Kalau error "Cannot find module", sesuaikan path import ini
// ke lokasi custom output prisma lo: "../app/generated/prisma"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding amenities...");

  // List fasilitas umum lapangan olahraga
  const amenitiesData = [
    { name: "WiFi Gratis" },
    { name: "Parkir Luas" },
    { name: "Toilet Bersih" },
    { name: "Kamar Ganti" },
    { name: "Mushola" },
    { name: "Kantin / Warung" },
    { name: "Tribun Penonton" },
    { name: "Locker Room" },
    { name: "Sewa Sepatu/Rompi" },
    { name: "CCTV 24 Jam" },
    { name: "Lampu Penerangan LED" },
    { name: "Air Mineral Gratis" },
  ];

  for (const item of amenitiesData) {
    // Cek dulu apakah amenity ini udah ada?
    const existing = await prisma.amenities.findFirst({
      where: { name: item.name },
    });

    // Kalau belum ada, baru create
    if (!existing) {
      await prisma.amenities.create({
        data: item,
      });
      console.log(`✅ Created amenity: ${item.name}`);
    } else {
      console.log(`⏭️  Skipped (Already exists): ${item.name}`);
    }
  }

  console.log("🏁 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
