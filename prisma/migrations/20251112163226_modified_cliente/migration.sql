/*
  Warnings:

  - You are about to alter the column `dni` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Changed the type of `phone` on the `Cliente` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Cliente" ALTER COLUMN "dni" SET DATA TYPE INTEGER,
DROP COLUMN "phone",
ADD COLUMN     "phone" INTEGER NOT NULL;
