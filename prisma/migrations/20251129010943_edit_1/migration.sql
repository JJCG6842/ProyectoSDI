/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Entrance` table. All the data in the column will be lost.
  - You are about to drop the column `tipoentrada` on the `Entrance` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Products` table. All the data in the column will be lost.
  - Added the required column `address` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ruc` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_clienteId_fkey";

-- AlterTable
ALTER TABLE "public"."Entrance" DROP COLUMN "clienteId",
DROP COLUMN "tipoentrada";

-- AlterTable
ALTER TABLE "public"."Products" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "public"."Supplier" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "ruc" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."TipoEntrada";
