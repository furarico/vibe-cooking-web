import { withAppCheck } from '@/lib/middleware/app-check';
import { NextResponse } from 'next/server';

// GET /api/recipes - レシピ一覧を取得
async function handleGet() {
  try {
    // 材料と手順は空配列でモックデータを返す
    const recipes = [
      {
        id: 1,
        title: 'チキンカレー',
        description: 'スパイシーで美味しいチキンカレー',
        prepTime: 20,
        cookTime: 30,
        servings: 4,
        ingredients: [],
        instructions: [],
        tags: ['カレー', 'スパイシー'],
        imageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'パスタ',
        description: 'シンプルで美味しいパスタ',
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        ingredients: [],
        instructions: [],
        tags: ['パスタ', 'イタリアン'],
        imageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

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
