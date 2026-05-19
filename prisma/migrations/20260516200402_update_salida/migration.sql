/*
  Warnings:

  - You are about to drop the column `destinoId` on the `Salida` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Salida" DROP CONSTRAINT "Salida_destinoId_fkey";

-- AlterTable
ALTER TABLE "public"."Salida" DROP COLUMN "destinoId";
