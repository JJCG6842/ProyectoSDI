/*
  Warnings:

  - Changed the type of `ruc` on the `Supplier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Supplier" DROP COLUMN "ruc",
ADD COLUMN     "ruc" BIGINT NOT NULL;
