import { DefaultApi } from '@/lib/api';
import { RecipeRepository } from '@/repositories/implementations/RecipeRepository';
import { RecipeService } from '@/services/recipe/RecipeService';

export interface DIContainer {
  recipeService: RecipeService;
}

export const createDIContainer = (): DIContainer => {
  // API Client の作成
  const apiClient = new DefaultApi();

  // Repository の作成
  const recipeRepository = new RecipeRepository(apiClient);

  // Service の作成
  const recipeService = new RecipeService(recipeRepository);

  return {
    recipeService
  };
};