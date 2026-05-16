/*
  Warnings:

  - You are about to drop the column `price` on the `EntranceDetalle` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `EntranceDetalle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."EntranceDetalle" DROP COLUMN "price",
DROP COLUMN "total";
