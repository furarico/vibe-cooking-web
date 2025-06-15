import { IRecipeRepository } from '@/client/repositories/interfaces/i-recipe-repository';
import { Recipe } from '@/lib/api-client';

export class RecipeService {
  constructor(private recipeRepository: IRecipeRepository) {}

  async getAllRecipes(): Promise<Recipe[]> {
    return await this.recipeRepository.findAll();
  }

  async getRecipesByCategoryId(categoryId: string): Promise<Recipe[]> {
    return await this.recipeRepository.findByCategoryId(categoryId);
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    return await this.recipeRepository.findById(id);
  }
}
