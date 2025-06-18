'use client';

import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryRecipeSection } from '@/components/category-recipe-section';
import { Loading } from '@/components/ui/loading';
import { Suspense } from 'react';

export default function Page() {
  const { state } = useCategoryPresenter();

  if (state.loading) {
    return <Loading />;
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
