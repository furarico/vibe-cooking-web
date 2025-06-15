import { useRecipesByCategoryPresenter } from '@/client/presenters/use-recipes-by-category-presenter';
import Loading from '@/components/ui/loading';
import { RecipeCardList } from '@/components/ui/recipe-card-list';
import { Category } from '@/lib/api-client';
import Link from 'next/link';
import { Suspense } from 'react';

export function CategoryRecipeSection({ category }: { category: Category }) {
  const { recipes, loading } = useRecipesByCategoryPresenter(category.id);

  if (recipes.length === 0 && !loading) {
    return <></>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="mb-8">
        <Link href={`/recipes?category=${category.name}`}>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {category.name}
          </h2>
        </Link>
        {loading ? <Loading /> : <RecipeCardList recipes={recipes} />}
      </div>
    </Suspense>
  );
}
