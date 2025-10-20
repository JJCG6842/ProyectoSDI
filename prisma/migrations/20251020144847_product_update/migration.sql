/*
  Warnings:

  - Added the required column `quantity` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('Instock', 'Outstock');

-- AlterTable
ALTER TABLE "public"."Products" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "status" "public"."ProductStatus" NOT NULL;
