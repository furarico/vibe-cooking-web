import { PrismaClient, VibeInstruction, VibeRecipe } from '@prisma/client';
import { IVibeRecipeRepository } from '../interfaces/i-vibe-recipe-repository';

// vibeInstructionsを含む拡張型を定義
type VibeRecipeWithInstructions = VibeRecipe & {
  vibeInstructions: VibeInstruction[];
};

export class VibeRecipeRepository implements IVibeRecipeRepository {
  constructor(private prisma: PrismaClient) {}

  async findByRecipeIds(
    recipeIds: string[]
  ): Promise<VibeRecipeWithInstructions | null> {
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
    instructions: Array<{
      instructionId: string;
      step: number;
      recipeId: string;
    }>
  ): Promise<VibeRecipeWithInstructions> {
    return await this.prisma.vibeRecipe.create({
      data: {
        recipeIds,
        vibeInstructions: {
          create: instructions.map(({ instructionId, step, recipeId }) => ({
            instructionId,
            step,
            recipeId,
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
  ): Promise<Array<{ id: string; description: string; recipeId: string }>> {
    const instructions = await this.prisma.instruction.findMany({
      where: {
        recipeId: {
          in: recipeIds,
        },
      },
      select: {
        id: true,
        description: true,
        recipeId: true,
      },
    });

    return instructions;
  }
}
