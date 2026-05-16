/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ruc]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "public"."Cliente";

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "public"."Products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_ruc_key" ON "public"."Supplier"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "public"."Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_phone_key" ON "public"."Supplier"("phone");
