/*
  Warnings:

  - You are about to drop the column `productId` on the `Entrance` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Entrance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Entrance" DROP COLUMN "productId",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "public"."EntranceDetalle" (
    "id" TEXT NOT NULL,
    "entranceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EntranceDetalle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EntranceDetalle" ADD CONSTRAINT "EntranceDetalle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntranceDetalle" ADD CONSTRAINT "EntranceDetalle_entranceId_fkey" FOREIGN KEY ("entranceId") REFERENCES "public"."Entrance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
