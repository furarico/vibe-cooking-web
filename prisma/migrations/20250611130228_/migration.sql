/*
  Warnings:

  - Made the column `description` on table `recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "unit" SET DEFAULT '',
ALTER COLUMN "notes" SET DEFAULT '';

-- AlterTable
ALTER TABLE "instructions" ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "step" SET DEFAULT 0,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "categoryId" TEXT,
ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
