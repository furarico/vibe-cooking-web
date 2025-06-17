import { PrismaClient, VibeRecipe } from '@prisma/client';
import { IVibeRecipeRepository } from '../interfaces/i-vibe-recipe-repository';

export class VibeRecipeRepository implements IVibeRecipeRepository {
  constructor(private prisma: PrismaClient) {}

  async findByRecipeIds(recipeIds: string[]): Promise<VibeRecipe | null> {
    // recipeIdsの配列が完全に一致するVibeRecipeを検索
    const sortedRecipeIds = [...recipeIds].sort();

    const vibeRecipes = await this.prisma.vibeRecipe.findMany({
      include: {
        vibeInstructions: true,
      },
    });

    // クライアントサイドで配列の比較を行う
    const matchedVibeRecipe = vibeRecipes.find(vibeRecipe => {
      const sortedVibeRecipeIds = [...vibeRecipe.recipeIds].sort();
      return (
        sortedVibeRecipeIds.length === sortedRecipeIds.length &&
        sortedVibeRecipeIds.every((id, index) => id === sortedRecipeIds[index])
      );
    });

    return matchedVibeRecipe || null;
  }

  async create(
    recipeIds: string[],
    instructions: Array<{ instructionId: string; step: number }>
  ): Promise<VibeRecipe> {
    return await this.prisma.vibeRecipe.create({
      data: {
        recipeIds,
        vibeInstructions: {
          create: instructions.map(({ instructionId, step }) => ({
            instructionId,
            step,
          })),
        },
      },
      include: {
        vibeInstructions: true,
      },
    });
  }

  async getInstructionsByRecipeIds(
    recipeIds: string[]
  ): Promise<Array<{ id: string; description: string }>> {
    const instructions = await this.prisma.instruction.findMany({
      where: {
        recipeId: {
          in: recipeIds,
        },
      },
      select: {
        id: true,
        description: true,
      },
    });

    return instructions;
  }
}
