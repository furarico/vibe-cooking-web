import { useRecipesByCategoryPresenter } from '@/client/presenters/use-recipes-by-category-presenter';
import { Loading } from '@/components/ui/loading';
import { RecipeCardList } from '@/components/ui/recipe-card-list';
import { Category } from '@/lib/api-client';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from './ui/button';

export function CategoryRecipeSection({ category }: { category: Category }) {
  const { recipes, loading } = useRecipesByCategoryPresenter(category.id);

  if (recipes.length === 0 && !loading) {
    return <></>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="mt-8 mb-4 flex flex-row justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
        <Button variant="link" asChild>
          <Link href={`/recipes?category=${category.name}`}>もっと見る</Link>
        </Button>
      </div>
      {loading ? <Loading /> : <RecipeCardList recipes={recipes} />}
    </Suspense>
  );
}
