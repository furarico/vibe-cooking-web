'use client';

import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryRecipeSection } from '@/components/category-recipe-section';
import { Loading } from '@/components/ui/loading';
import { NoContent } from '@/components/ui/no-content';
import { Suspense } from 'react';

export default function Page() {
  const { state } = useCategoryPresenter();

  if (state.loading) {
    return <Loading />;
  }

  if (state.categories.length === 0) {
    return <NoContent text="レシピが見つかりません" />;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        {state.categories.map(category => {
          return (
            <CategoryRecipeSection key={category.id} category={category} />
          );
        })}
      </Suspense>
    </>
  );
}
