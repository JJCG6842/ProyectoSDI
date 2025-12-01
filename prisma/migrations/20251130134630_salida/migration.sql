/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Salida` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `Salida` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Salida` table. All the data in the column will be lost.
  - You are about to drop the column `tiposalida` on the `Salida` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `SalidaDetalle` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `SalidaDetalle` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Salida` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Salida" DROP CONSTRAINT "Salida_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Salida" DROP CONSTRAINT "Salida_supplierId_fkey";

-- AlterTable
ALTER TABLE "public"."Salida" DROP COLUMN "clienteId",
DROP COLUMN "supplierId",
DROP COLUMN "tipo",
DROP COLUMN "tiposalida",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."SalidaDetalle" DROP COLUMN "price",
DROP COLUMN "total";

-- DropEnum
DROP TYPE "public"."TipoSalida";

-- AddForeignKey
ALTER TABLE "public"."Salida" ADD CONSTRAINT "Salida_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
