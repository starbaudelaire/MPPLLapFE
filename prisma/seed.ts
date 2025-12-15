import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Isi Amenities dummy
  const amenities = [
    { name: "Toilet" },
    { name: "Kantin" },
    { name: "Parkir Luas" },
    { name: "Ruang Ganti" },
    { name: "Mushola" },
    { name: "Pencahayaan" },
    { name: "Tribun Penonton" },
  ];

  for (const amenity of amenities) {
    await prisma.amenities.create({
      data: amenity,
    });
  }

  console.log("Dummy amenities inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
