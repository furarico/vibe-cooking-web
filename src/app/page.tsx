'use client';

import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryRecipeSection } from '@/components/category-recipe-section';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Page() {
  const { categories, loading } = useCategoryPresenter();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* addページへの遷移ボタン */}
      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200"
        >
          <Link href="/recipes/add">保存済みレシピ一覧</Link>
        </Button>
      </div>

      <Suspense fallback={<Loading />}>
        {categories.map(category => {
          return (
            <CategoryRecipeSection key={category.id} category={category} />
          );
        })}
      </Suspense>
    </>
  );
}
