/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Marca` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Subcategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Marca" DROP CONSTRAINT "Marca_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Marca" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "public"."Subcategory" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "public"."_CategoryToSubcategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToSubcategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_CategoryToMarca" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToMarca_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToSubcategory_B_index" ON "public"."_CategoryToSubcategory"("B");

-- CreateIndex
CREATE INDEX "_CategoryToMarca_B_index" ON "public"."_CategoryToMarca"("B");

-- AddForeignKey
ALTER TABLE "public"."_CategoryToSubcategory" ADD CONSTRAINT "_CategoryToSubcategory_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToSubcategory" ADD CONSTRAINT "_CategoryToSubcategory_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToMarca" ADD CONSTRAINT "_CategoryToMarca_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryToMarca" ADD CONSTRAINT "_CategoryToMarca_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Marca"("id") ON DELETE CASCADE ON UPDATE CASCADE;
