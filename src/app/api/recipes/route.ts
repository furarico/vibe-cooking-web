import { withAppCheck } from '@/lib/middleware/app-check';
import { ServerContainer } from '@/server/di/container';
import { RecipeFilters } from '@/server/repositories/interfaces/i-recipe-repository';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/recipes - レシピ一覧を取得（フィルター対応）
async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // クエリパラメータからフィルター条件を抽出
    const filters: RecipeFilters = {};

    const q = searchParams.get('q');
    if (q) filters.q = q;

    const tag = searchParams.get('tag');
    if (tag) filters.tag = tag;

    const category = searchParams.get('category');
    if (category) filters.category = category;

    const categoryId = searchParams.get('categoryId');
    if (categoryId) filters.categoryId = categoryId;

    const recipeService = ServerContainer.getInstance().recipeService;

    // フィルター条件があるかチェック
    const hasFilters = Object.keys(filters).length > 0;
    const recipes = hasFilters
      ? await recipeService.getAllRecipesWithFilters(filters)
      : await recipeService.getAllRecipes();

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

// AppCheck 検証付きのGETハンドラー
export const GET = withAppCheck(handleGet);
