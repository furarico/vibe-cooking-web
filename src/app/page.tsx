'use client';

import { CategoryRecipeSection } from '@/app/category-recipe-section';
import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { Loading } from '@/components/tools/loading';
import { NoContent } from '@/components/tools/no-content';
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
