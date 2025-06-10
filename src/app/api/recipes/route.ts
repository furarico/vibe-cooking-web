import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/recipes - レシピ一覧を取得
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true,
        instructions: {
          orderBy: { step: 'asc' },
        },
      },
    });

    // RecipesGet200Response 形式で返す
    return NextResponse.json({
      recipes,
    });
  } catch (error) {
    console.error('レシピ一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'レシピの取得に失敗しました' },
      { status: 500 }
    );
  }
}
