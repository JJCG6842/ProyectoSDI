/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dni]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_nombre_key" ON "public"."Users"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_dni_key" ON "public"."Users"("dni");
