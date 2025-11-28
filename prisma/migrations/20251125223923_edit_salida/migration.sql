/*
  Warnings:

  - Added the required column `tiposalida` to the `Salida` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoSalida" AS ENUM ('Mantenimiento', 'Baja', 'Perdida_robo', 'Venta', 'Devolucion');

-- AlterTable
ALTER TABLE "public"."Salida" ADD COLUMN     "tiposalida" "public"."TipoSalida" NOT NULL;
