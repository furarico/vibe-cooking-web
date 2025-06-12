import {
  IRecipeRepository,
  RecipeFilters,
  RecipeWithDetails,
} from '../repositories/interfaces/i-recipe-repository';

export interface IRecipeService {
  getAllRecipes(): Promise<RecipeWithDetails[]>;
  getAllRecipesWithFilters(
    filters: RecipeFilters
  ): Promise<RecipeWithDetails[]>;
  getRecipeById(id: string): Promise<RecipeWithDetails>;
}

export class RecipeService implements IRecipeService {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

  async getAllRecipes(): Promise<RecipeWithDetails[]> {
    return this.recipeRepository.findAllSummary();
  }

  async getAllRecipesWithFilters(
    filters: RecipeFilters
  ): Promise<RecipeWithDetails[]> {
    return this.recipeRepository.findAllSummaryWithFilters(filters);
  }

  async getRecipeById(id: string): Promise<RecipeWithDetails> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    return recipe;
  }
}
