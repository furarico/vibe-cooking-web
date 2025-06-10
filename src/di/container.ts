import { DefaultApi } from '@/lib/api';
import { RecipeRepository } from '@/repositories/implementations/RecipeRepository';
import { IRecipeRepository } from '@/repositories/interfaces/IRecipeRepository';
import { RecipeService } from '@/services/recipe/RecipeService';

export interface DIContainer {
  recipeRepository: IRecipeRepository;
  recipeService: RecipeService;
}

export const createDIContainer = (): DIContainer => {
  // API Client の作成
  const apiClient = new DefaultApi();

  // Repository の作成
  const recipeRepository = new RecipeRepository(apiClient);

  // Service の作成（Repository を使用）
  const recipeService = new RecipeService(recipeRepository);

  return {
    recipeRepository,
    recipeService,
  };
};
