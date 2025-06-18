import prisma from '@/lib/database';
import { GeminiClient } from '@/lib/gemini-client';
import { CategoryRepository } from '../repositories/implementations/category-repository';
import { RecipeRepository } from '../repositories/implementations/recipe-repository';
import { VibeRecipeRepository } from '../repositories/implementations/vibe-recipe-repository';
import { CategoryService } from '../services/category-service';
import { RecipeService } from '../services/recipe-service';
import { VibeRecipeService } from '../services/vibe-recipe-service';

export interface DIContainer {
  recipeService: RecipeService;
  categoryService: CategoryService;
  vibeRecipeService: VibeRecipeService;
}

export const createDIContainer = (): DIContainer => {
  const recipeRepository = new RecipeRepository(prisma);
  const categoryRepository = new CategoryRepository(prisma);
  const vibeRecipeRepository = new VibeRecipeRepository(prisma);
  const geminiClient = new GeminiClient();

  const recipeService = new RecipeService(recipeRepository);
  const categoryService = new CategoryService(categoryRepository);
  const vibeRecipeService = new VibeRecipeService(
    vibeRecipeRepository,
    geminiClient
  );

  return {
    recipeService,
    categoryService,
    vibeRecipeService,
  };
};
