/*
  Warnings:

  - Added the required column `tipoentrada` to the `Entrance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoEntrada" AS ENUM ('Reparado', 'Compra', 'Proveedor', 'Recuperado');

-- AlterTable
ALTER TABLE "public"."Entrance" ADD COLUMN     "clienteId" TEXT,
ADD COLUMN     "tipoentrada" "public"."TipoEntrada" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
