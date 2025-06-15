'use client';

import { useCategoryPresenter } from '@/client/presenters/hooks/use-category-presenter';
import { CategoryRecipeSection } from '@/components/category-recipe-section';
import Loading from '@/components/ui/loading';
import { Suspense } from 'react';

export default function Page() {
  const { categories, loading } = useCategoryPresenter();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
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
