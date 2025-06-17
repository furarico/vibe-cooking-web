'use client';

import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryRecipeSection } from '@/components/category-recipe-section';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { SelectCount } from '@/components/ui/select-count';
import { getSavedRecipesCount } from '@/lib/local-storage';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

export default function Page() {
  const { categories, loading } = useCategoryPresenter();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    // コンポーネントマウント時とフォーカス時に保存数を更新
    const updateSavedCount = () => {
      setSavedCount(getSavedRecipesCount());
    };

    updateSavedCount();

    // ページがフォーカスされたときに保存数を更新（他のページから戻ってきたとき）
    const handleFocus = () => {
      updateSavedCount();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-6">
        <Button
          asChild
          variant="ghost"
          className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200"
        >
          <Link
            href="/candidates"
            className="flex items-center justify-between"
          >
            <SelectCount count={savedCount} />
            <span>選択中のレシピを表示</span>
          </Link>
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
