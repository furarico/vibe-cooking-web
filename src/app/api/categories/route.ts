import { withAppCheck } from '@/lib/middleware/app-check';
import { ServerContainer } from '@/server/di/container';
import { NextResponse } from 'next/server';

// GET /api/categories - カテゴリ一覧を取得
async function handleGet() {
  try {
    const categoryService = ServerContainer.getInstance().categoryService;
    const categories = await categoryService.getAllCategories();

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error('カテゴリ一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// AppCheck 検証付きのGETハンドラー
export const GET = withAppCheck(handleGet);
