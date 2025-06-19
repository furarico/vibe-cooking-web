import { IVibeRecipeRepository } from '@/client/repositories/interfaces/i-vibe-recipe-repository';
import { VibeRecipe } from '@/lib/api-client';

export class VibeRecipeService {
  constructor(private vibeRecipeRepository: IVibeRecipeRepository) {}

  async createVibeRecipe(recipeIds: string[]): Promise<VibeRecipe> {
    return await this.vibeRecipeRepository.create(recipeIds);
  }
}
