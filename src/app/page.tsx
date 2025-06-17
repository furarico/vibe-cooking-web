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
        {savedCount > 0 && (
          <Button asChild variant="outline" className="w-full">
            <Link
              href="/candidates"
              className="flex items-center justify-between"
            >
              <SelectCount count={savedCount} />
              <span>Vibe Cooking リスト</span>
            </Link>
          </Button>
        )}
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
