/*
  Warnings:

  - You are about to drop the column `description` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Store" DROP COLUMN "description",
DROP COLUMN "location";
