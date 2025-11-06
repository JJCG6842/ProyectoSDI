-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entrance" DROP CONSTRAINT "Entrance_subcategoryId_fkey";

-- CreateTable
CREATE TABLE "public"."Marca" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Marca" ADD CONSTRAINT "Marca_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
