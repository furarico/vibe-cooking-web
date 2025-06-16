import prisma from '@/lib/database';
import { CategoryRepository } from '../repositories/implementations/category-repository';
import { RecipeRepository } from '../repositories/implementations/recipe-repository';
import { CategoryService } from '../services/category-service';
import { RecipeService } from '../services/recipe-service';

export interface DIContainer {
  recipeService: RecipeService;
  categoryService: CategoryService;
}

export const createDIContainer = (): DIContainer => {
  const recipeRepository = new RecipeRepository(prisma);
  const categoryRepository = new CategoryRepository(prisma);

  const recipeService = new RecipeService(recipeRepository);
  const categoryService = new CategoryService(categoryRepository);

  return {
    recipeService,
    categoryService,
  };
};
