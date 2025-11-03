-- AlterTable
ALTER TABLE "public"."Products" ADD COLUMN     "storeId" TEXT;

-- CreateTable
CREATE TABLE "public"."Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
