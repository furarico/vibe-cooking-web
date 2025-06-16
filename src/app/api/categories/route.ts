import { withAppCheck } from '@/lib/middleware/app-check';
import { createDIContainer } from '@/server/di/container';
import { NextResponse } from 'next/server';

// GET /api/categories - カテゴリ一覧を取得
async function handleGet() {
  try {
    const container = createDIContainer();
    const categoryService = container.categoryService;
    const categories = await categoryService.getAllCategories();

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// AppCheck 検証付きのGETハンドラー
export const GET = withAppCheck(handleGet);
