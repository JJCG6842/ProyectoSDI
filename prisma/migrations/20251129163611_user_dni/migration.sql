/*
  Warnings:

  - Added the required column `dni` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "dni" INTEGER NOT NULL;
