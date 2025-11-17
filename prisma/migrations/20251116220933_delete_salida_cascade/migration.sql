-- DropForeignKey
ALTER TABLE "public"."SalidaDetalle" DROP CONSTRAINT "SalidaDetalle_salidaId_fkey";

-- AddForeignKey
ALTER TABLE "public"."SalidaDetalle" ADD CONSTRAINT "SalidaDetalle_salidaId_fkey" FOREIGN KEY ("salidaId") REFERENCES "public"."Salida"("id") ON DELETE CASCADE ON UPDATE CASCADE;
