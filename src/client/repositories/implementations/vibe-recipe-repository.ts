import { DefaultApi, VibeRecipe } from '@/lib/api-client';
import { IVibeRecipeRepository } from '../interfaces/i-vibe-recipe-repository';

export class VibeRecipeRepository implements IVibeRecipeRepository {
  constructor(private apiClient: DefaultApi) {}

  async create(recipeIds: string[]): Promise<VibeRecipe> {
    try {
      return await this.apiClient.vibeRecipePost({ recipeIds });
    } catch (error) {
      throw error;
    }
  }
}
