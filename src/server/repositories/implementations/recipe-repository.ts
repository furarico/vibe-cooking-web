import { PrismaClient } from '@prisma/client';
import {
  IRecipeRepository,
  RecipeFilters,
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
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllSummary(): Promise<RecipeWithDetails[]> {
    const recipes = await this.prisma.recipe.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return recipes.map(recipe => ({
      ...recipe,
      ingredients: [],
      instructions: [],
    }));
  }

  async findAllSummaryWithFilters(
    filters: RecipeFilters
  ): Promise<RecipeWithDetails[]> {
    const whereConditions: Record<string, unknown> = {};

    // テキスト検索（q）- レシピタイトル、説明、材料名、手順で検索
    if (filters.q) {
      whereConditions.OR = [
        {
          title: {
            contains: filters.q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filters.q,
            mode: 'insensitive',
          },
        },
        {
          ingredients: {
            some: {
              name: {
                contains: filters.q,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          instructions: {
            some: {
              OR: [
                {
                  title: {
                    contains: filters.q,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: filters.q,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        },
      ];
    }

    // タグフィルター（tag）- カンマ区切りの複数タグをAND条件で検索
    if (filters.tag) {
      const tags = filters.tag.split(',').map(tag => tag.trim());
      whereConditions.tags = {
        hasEvery: tags,
      };
    }

    // カテゴリIDフィルター
    if (filters.categoryId) {
      whereConditions.categoryId = filters.categoryId;
    }

    // カテゴリ名フィルター
    if (filters.category) {
      whereConditions.category = {
        name: {
          equals: filters.category,
          mode: 'insensitive',
        },
      };
    }

    const recipes = await this.prisma.recipe.findMany({
      where: whereConditions,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return recipes.map(recipe => ({
      ...recipe,
      ingredients: [],
      instructions: [],
    }));
  }

  async findById(id: string): Promise<RecipeWithDetails | null> {
    return await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          orderBy: { id: 'asc' },
        },
        instructions: {
          orderBy: { step: 'asc' },
        },
        category: true,
      },
    });
  }
}
