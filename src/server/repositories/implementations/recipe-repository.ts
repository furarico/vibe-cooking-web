import { PrismaClient } from '@prisma/client';
import {
  IRecipeRepository,
  RecipeWithDetails,
} from '../interfaces/i-recipe-repository';

export class RecipeRepository implements IRecipeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<RecipeWithDetails[]> {
    return this.prisma.recipe.findMany({
      include: {
        ingredients: {
          orderBy: { id: 'asc' },
        },
        instructions: {
          orderBy: { step: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<RecipeWithDetails | null> {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          orderBy: { id: 'asc' },
        },
        instructions: {
          orderBy: { step: 'asc' },
        },
      },
    });
  }
}
