/*
  Warnings:

  - You are about to drop the column `roomId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoomAmenties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fieldId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('FUTSAL', 'BASKETBALL', 'BADMINTON', 'MINI_SOCCER', 'TENNIS');

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAmenties" DROP CONSTRAINT "RoomAmenties_amenitiesId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAmenties" DROP CONSTRAINT "RoomAmenties_roomId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "roomId",
ADD COLUMN     "fieldId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Room";

-- DropTable
DROP TABLE "RoomAmenties";

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pricePerHour" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "type" "SportType" NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldAmenities" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "amenitiesId" TEXT NOT NULL,

    CONSTRAINT "FieldAmenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reply" TEXT,
    "reservationId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_reservationId_key" ON "Review"("reservationId");

-- AddForeignKey
ALTER TABLE "FieldAmenities" ADD CONSTRAINT "FieldAmenities_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldAmenities" ADD CONSTRAINT "FieldAmenities_amenitiesId_fkey" FOREIGN KEY ("amenitiesId") REFERENCES "Amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
