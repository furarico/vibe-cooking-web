import { DefaultApi } from '@/lib/api-client';
import { RecipeRepository } from '@/client/repositories/implementations/recipe-repository';
import { RecipeService } from '@/client/services/recipe/recipe-service';
import { prisma } from '@/lib/database';

export interface DIContainer {
  prisma: typeof prisma;
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
    prisma,
    recipeService,
  };
};
