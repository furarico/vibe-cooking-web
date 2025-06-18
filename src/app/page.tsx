'use client';

import { useCategoryPresenter } from '@/client/presenters/use-category-presenter';
import { CategoryRecipeSection } from '@/components/category-recipe-section';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { SelectCount } from '@/components/ui/select-count';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Page() {
  const { state } = useCategoryPresenter();

  if (state.loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-6">
        {state.vibeCookingRecipeIds.length > 0 && (
          <Button asChild variant="outline" className="w-full">
            <Link
              href="/candidates"
              className="flex items-center justify-between"
            >
              <SelectCount count={state.vibeCookingRecipeIds.length} />
              <span>Vibe Cooking リスト</span>
            </Link>
          </Button>
        )}
      </div>

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
