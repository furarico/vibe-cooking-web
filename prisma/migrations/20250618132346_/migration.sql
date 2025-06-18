/*
  Warnings:

  - The primary key for the `vibe_instructions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `vibe_instructions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vibe_instructions" DROP CONSTRAINT "vibe_instructions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "vibe_instructions_pkey" PRIMARY KEY ("instructionId");
