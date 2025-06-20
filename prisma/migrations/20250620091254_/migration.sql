/*
  Warnings:

  - Made the column `prepTime` on table `recipes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cookTime` on table `recipes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `servings` on table `recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipes" ALTER COLUMN "prepTime" SET NOT NULL,
ALTER COLUMN "prepTime" SET DEFAULT 0,
ALTER COLUMN "cookTime" SET NOT NULL,
ALTER COLUMN "cookTime" SET DEFAULT 0,
ALTER COLUMN "servings" SET NOT NULL,
ALTER COLUMN "servings" SET DEFAULT 0;
