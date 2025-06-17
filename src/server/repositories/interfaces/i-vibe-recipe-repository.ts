import { VibeRecipe } from '@prisma/client';

export interface IVibeRecipeRepository {
  findByRecipeIds(recipeIds: string[]): Promise<VibeRecipe | null>;
  create(
    recipeIds: string[],
    instructions: Array<{ instructionId: string; step: number }>
  ): Promise<VibeRecipe>;
  getInstructionsByRecipeIds(
    recipeIds: string[]
  ): Promise<Array<{ id: string; description: string }>>;
}
