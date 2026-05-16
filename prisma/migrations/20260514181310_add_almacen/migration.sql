/*
  Warnings:

  - You are about to drop the column `storeId` on the `Products` table. All the data in the column will be lost.
  - Added the required column `almacenId` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Products" DROP COLUMN "storeId",
ADD COLUMN     "almacenId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Almacen" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_almacenId_fkey" FOREIGN KEY ("almacenId") REFERENCES "public"."Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
