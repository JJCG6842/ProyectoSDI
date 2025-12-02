-- AlterTable
ALTER TABLE "public"."Salida" ADD COLUMN     "destinoId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Salida" ADD CONSTRAINT "Salida_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
