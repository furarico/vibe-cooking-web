import { VibeRecipe } from '@/lib/api-client';

export interface IVibeRecipeRepository {
  create(recipeIds: string[]): Promise<VibeRecipe>;
}
