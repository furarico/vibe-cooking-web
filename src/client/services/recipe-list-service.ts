import {
  IRecipeRepository,
  RecipeListFilters,
} from '@/client/repositories/interfaces/i-recipe-repository';
import { Recipe } from '@/lib/api-client';

export class RecipeListService {
  constructor(private recipeRepository: IRecipeRepository) {}

  async getRecipes(filters?: RecipeListFilters): Promise<Recipe[]> {
    return await this.recipeRepository.findWithFilters(filters);
  }
}
