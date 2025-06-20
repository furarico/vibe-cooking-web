import { components } from '../../types/api';
import {
  IRecipeRepository,
  RecipeFilters,
  RecipeWithDetails,
} from '../repositories/interfaces/i-recipe-repository';

// OpenAPI スキーマの Recipe 型
type APIRecipe = components['schemas']['Recipe'];

export interface IRecipeService {
  getAllRecipes(): Promise<APIRecipe[]>;
  getAllRecipesWithFilters(filters: RecipeFilters): Promise<APIRecipe[]>;
  getRecipeById(id: string): Promise<APIRecipe>;
}

export class RecipeService implements IRecipeService {
  constructor(private readonly recipeRepository: IRecipeRepository) {}

  async getAllRecipes(): Promise<APIRecipe[]> {
    const recipes = await this.recipeRepository.findAllSummary();
    return recipes.map(recipe => this.convertToAPIRecipe(recipe));
  }

  async getAllRecipesWithFilters(filters: RecipeFilters): Promise<APIRecipe[]> {
    const recipes =
      await this.recipeRepository.findAllSummaryWithFilters(filters);
    return recipes.map(recipe => this.convertToAPIRecipe(recipe));
  }

  async getRecipeById(id: string): Promise<APIRecipe> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    return this.convertToAPIRecipe(recipe);
  }

  private convertToAPIRecipe(recipe: RecipeWithDetails): APIRecipe {
    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      category: {
        id: recipe.category.id,
        name: recipe.category.name,
      },
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients.map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        notes: ingredient.notes || undefined,
      })),
      instructions: recipe.instructions.map(instruction => ({
        id: instruction.id,
        recipeId: instruction.recipeId,
        step: instruction.step,
        title: instruction.title,
        description: instruction.description,
        imageUrl: instruction.imageUrl || undefined,
        audioUrl: instruction.audioUrl || undefined,
        estimatedTime: instruction.estimatedTime || undefined,
      })),
      imageUrl: recipe.imageUrl || undefined,
      tags: recipe.tags,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
    };
  }
}
