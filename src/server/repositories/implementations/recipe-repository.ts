import { PrismaClient } from '@prisma/client';
import {
  IRecipeRepository,
  RecipeWithDetails,
  CreateRecipeInput,
  UpdateRecipeInput,
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

  async create(data: CreateRecipeInput): Promise<RecipeWithDetails> {
    return this.prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        imageUrl: data.imageUrl,
        tags: data.tags || [],
        ingredients: {
          create: data.ingredients,
        },
        instructions: {
          create: data.instructions,
        },
      },
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

  async update(
    id: string,
    data: UpdateRecipeInput
  ): Promise<RecipeWithDetails> {
    return this.prisma.$transaction(async prisma => {
      // まず既存のレシピを更新
      await prisma.recipe.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
          imageUrl: data.imageUrl,
          tags: data.tags,
        },
      });

      // 材料の更新
      if (data.ingredients) {
        // 既存の材料を削除
        await prisma.ingredient.deleteMany({
          where: { recipeId: id },
        });

        // 新しい材料を作成
        if (data.ingredients.length > 0) {
          await prisma.ingredient.createMany({
            data: data.ingredients.map(ingredient => ({
              recipeId: id,
              name: ingredient.name!,
              amount: ingredient.amount!,
              unit: ingredient.unit!,
              notes: ingredient.notes,
            })),
          });
        }
      }

      // 手順の更新
      if (data.instructions) {
        // 既存の手順を削除
        await prisma.instruction.deleteMany({
          where: { recipeId: id },
        });

        // 新しい手順を作成
        if (data.instructions.length > 0) {
          await prisma.instruction.createMany({
            data: data.instructions.map(instruction => ({
              recipeId: id,
              step: instruction.step!,
              description: instruction.description!,
              imageUrl: instruction.imageUrl,
              estimatedTime: instruction.estimatedTime,
            })),
          });
        }
      }

      // 更新されたレシピを再取得
      return prisma.recipe.findUnique({
        where: { id },
        include: {
          ingredients: {
            orderBy: { id: 'asc' },
          },
          instructions: {
            orderBy: { step: 'asc' },
          },
        },
      }) as Promise<RecipeWithDetails>;
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recipe.delete({
      where: { id },
    });
  }
}

