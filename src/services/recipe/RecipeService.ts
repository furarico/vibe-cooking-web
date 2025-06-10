import { Recipe } from '@/lib/api';
import { IRecipeRepository } from '@/repositories/interfaces/IRecipeRepository';

export class RecipeService {
  constructor(private recipeRepository: IRecipeRepository) {}

  async getAllRecipes(): Promise<EnrichedRecipe[]> {
    const recipes = await this.recipeRepository.findAll();
    return recipes.map(recipe => this.enrichRecipeData(recipe));
  }

  async getRecipeById(id: string): Promise<EnrichedRecipe | null> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) return null;
    return this.enrichRecipeData(recipe);
  }

  private enrichRecipeData(recipe: Recipe): EnrichedRecipe {
    const prepTime = recipe.prepTime || 0;
    const cookTime = recipe.cookTime || 0;
    const totalTime = prepTime + cookTime;

    return {
      ...recipe,
      totalTime,
      formattedTime: this.formatTime(totalTime),
      difficultyLevel: this.calculateDifficulty(totalTime, recipe.instructions?.length || 0)
    };
  }

  private formatTime(minutes: number): string {
    if (minutes === 0) return '時間不明';
    if (minutes < 60) return `${minutes}分`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
  }

  private calculateDifficulty(totalTime: number, stepCount: number): 'easy' | 'medium' | 'hard' {
    if (totalTime <= 30 && stepCount <= 5) return 'easy';
    if (totalTime <= 60 && stepCount <= 10) return 'medium';
    return 'hard';
  }

  searchRecipes(recipes: EnrichedRecipe[], query: string): EnrichedRecipe[] {
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(recipe =>
      recipe.title?.toLowerCase().includes(lowercaseQuery) ||
      recipe.description?.toLowerCase().includes(lowercaseQuery) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  filterByDifficulty(recipes: EnrichedRecipe[], difficulty: 'easy' | 'medium' | 'hard'): EnrichedRecipe[] {
    return recipes.filter(recipe => recipe.difficultyLevel === difficulty);
  }
}