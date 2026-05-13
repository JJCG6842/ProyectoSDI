-- CreateTable
CREATE TABLE "public"."SerialNumber" (
    "id" TEXT NOT NULL,
    "serial" TEXT NOT NULL,
    "detalleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SerialNumber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SerialNumber" ADD CONSTRAINT "SerialNumber_detalleId_fkey" FOREIGN KEY ("detalleId") REFERENCES "public"."EntranceDetalle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
