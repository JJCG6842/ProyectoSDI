-- CreateTable
CREATE TABLE "public"."Entrance" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrance" ADD CONSTRAINT "Entrance_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
