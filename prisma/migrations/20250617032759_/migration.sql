-- CreateTable
CREATE TABLE "vibe_recipes" (
    "id" TEXT NOT NULL,
    "recipeIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vibe_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vibe_instructions" (
    "id" TEXT NOT NULL,
    "instructionId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "vibeRecipeId" TEXT NOT NULL,

    CONSTRAINT "vibe_instructions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vibe_instructions" ADD CONSTRAINT "vibe_instructions_vibeRecipeId_fkey" FOREIGN KEY ("vibeRecipeId") REFERENCES "vibe_recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
