/*
  Warnings:

  - You are about to drop the `Entrance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_storeId_fkey";

-- AlterTable
ALTER TABLE "public"."Products" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."Entrance";

-- DropTable
DROP TABLE "public"."Inventory";

-- DropTable
DROP TABLE "public"."Store";
