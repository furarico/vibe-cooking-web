/*
  Warnings:

  - You are about to drop the column `createdAt` on the `vibe_recipes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `vibe_recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vibe_recipes" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
