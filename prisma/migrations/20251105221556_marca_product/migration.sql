/*
  Warnings:

  - You are about to drop the column `marca` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Products" DROP COLUMN "marca",
ADD COLUMN     "marcaId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "public"."Marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;
