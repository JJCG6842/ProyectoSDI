/*
  Warnings:

  - You are about to alter the column `ruc` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Supplier" ALTER COLUMN "ruc" SET DATA TYPE INTEGER;
