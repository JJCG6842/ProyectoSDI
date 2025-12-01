-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Salida" DROP CONSTRAINT "Salida_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Salida" ADD CONSTRAINT "Salida_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
