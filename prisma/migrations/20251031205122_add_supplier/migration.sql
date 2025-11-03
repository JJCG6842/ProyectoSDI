-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);
