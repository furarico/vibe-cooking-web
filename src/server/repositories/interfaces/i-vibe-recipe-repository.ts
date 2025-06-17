import { VibeInstruction, VibeRecipe } from '@prisma/client';

// vibeInstructionsを含む拡張型を定義
type VibeRecipeWithInstructions = VibeRecipe & {
  vibeInstructions: VibeInstruction[];
};

export interface IVibeRecipeRepository {
  findByRecipeIds(
    recipeIds: string[]
  ): Promise<VibeRecipeWithInstructions | null>;
  create(
    recipeIds: string[],
    instructions: Array<{ instructionId: string; step: number }>
  ): Promise<VibeRecipeWithInstructions>;
  getInstructionsByRecipeIds(
    recipeIds: string[]
  ): Promise<Array<{ id: string; description: string }>>;
}
