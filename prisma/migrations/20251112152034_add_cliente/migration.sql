-- AlterTable
ALTER TABLE "public"."Salida" ADD COLUMN     "clienteId" TEXT;

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" TEXT NOT NULL,
    "dni" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Salida" ADD CONSTRAINT "Salida_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
