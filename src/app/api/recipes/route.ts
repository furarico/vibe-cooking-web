import { withAppCheck } from '@/lib/middleware/app-check';
import { sampleRecipes } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

// GET /api/recipes - レシピ一覧を取得
async function handleGet() {
  try {
    // RecipesGet200Response 形式で返す
    return NextResponse.json({
      recipes: sampleRecipes,
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
