import { DefaultApi } from '@/lib/api';
import { RecipeRepository } from '@/repositories/implementations/RecipeRepository';
import { IRecipeRepository } from '@/repositories/interfaces/IRecipeRepository';

export interface DIContainer {
  recipeRepository: IRecipeRepository;
}

export const createDIContainer = (): DIContainer => {
  // API Client の作成
  const apiClient = new DefaultApi();

  // Repository の作成
  const recipeRepository = new RecipeRepository(apiClient);

  return {
    recipeRepository,
  };
};
