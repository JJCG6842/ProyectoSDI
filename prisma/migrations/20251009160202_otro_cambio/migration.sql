/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `SKU` on the `Products` table. All the data in the column will be lost.
  - Added the required column `model` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partnumber` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "public"."Products" DROP CONSTRAINT "Products_pkey",
DROP COLUMN "SKU",
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "partnumber" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Products_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Products_id_seq";
