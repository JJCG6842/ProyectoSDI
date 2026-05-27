/*
  Warnings:

  - A unique constraint covering the columns `[guiaId]` on the table `Entrance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial]` on the table `SerialNumber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."GuiaEstado" AS ENUM ('PENDIENTE', 'RECIBIDO', 'CANCELADO');

-- AlterTable
ALTER TABLE "public"."Entrance" ADD COLUMN     "guiaId" TEXT;

-- CreateTable
CREATE TABLE "public"."GuiaRemision" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "public"."GuiaEstado" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuiaRemision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GuiaRemisionDetalle" (
    "id" TEXT NOT NULL,
    "guiaId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GuiaRemisionDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GuiaSerial" (
    "id" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "detalleId" TEXT NOT NULL,

    CONSTRAINT "GuiaSerial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuiaRemision_numero_key" ON "public"."GuiaRemision"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "GuiaSerial_serial_key" ON "public"."GuiaSerial"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "Entrance_guiaId_key" ON "public"."Entrance"("guiaId");

-- CreateIndex
CREATE UNIQUE INDEX "SerialNumber_serial_key" ON "public"."SerialNumber"("serial");

-- AddForeignKey
ALTER TABLE "public"."GuiaRemision" ADD CONSTRAINT "GuiaRemision_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuiaRemisionDetalle" ADD CONSTRAINT "GuiaRemisionDetalle_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "public"."GuiaRemision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuiaRemisionDetalle" ADD CONSTRAINT "GuiaRemisionDetalle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GuiaSerial" ADD CONSTRAINT "GuiaSerial_detalleId_fkey" FOREIGN KEY ("detalleId") REFERENCES "public"."GuiaRemisionDetalle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "public"."GuiaRemision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
