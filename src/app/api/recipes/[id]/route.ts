import { withAppCheck } from '@/lib/middleware/app-check';
import { createDIContainer } from '@/server/di/container';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/recipes/[id] - 特定IDのレシピ詳細を取得
async function handleGet(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const container = createDIContainer();
    const recipeService = container.recipeService;
    const recipe = await recipeService.getRecipeById(id);

    if (!recipe) {
      return NextResponse.json(
        { error: 'レシピが見つかりません' },
        { status: 404 }
      );
    }

    // Recipe 形式で返す
    return NextResponse.json(recipe);
  } catch {
    return NextResponse.json(
      { error: 'レシピ詳細の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// AppCheck 検証付きのGETハンドラー
export const GET = withAppCheck(handleGet);
