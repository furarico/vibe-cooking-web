import { Recipe } from '@/lib/api';
import { IRecipeRepository } from '@/repositories/interfaces/i-recipe-repository';

export class RecipeService {
  constructor(private recipeRepository: IRecipeRepository) {}

  async getAllRecipes(): Promise<Recipe[]> {
    return await this.recipeRepository.findAll();
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    return await this.recipeRepository.findById(id);
  }

  searchRecipes(recipes: Recipe[], query: string): Recipe[] {
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(
      recipe =>
        recipe.title?.toLowerCase().includes(lowercaseQuery) ||
        recipe.description?.toLowerCase().includes(lowercaseQuery) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  filterByServings(recipes: Recipe[], minServings: number): Recipe[] {
    return recipes.filter(recipe => (recipe.servings || 0) >= minServings);
  }

  filterByMaxTime(recipes: Recipe[], maxTime: number): Recipe[] {
    return recipes.filter(recipe => {
      const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
      return totalTime <= maxTime;
    });
  }
}
