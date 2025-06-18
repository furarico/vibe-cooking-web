import { RecipeCard } from '@/components/ui/recipe-card';
import { Recipe } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RecipeCardListProps {
  recipes: Recipe[];
  className?: string;
}

export function RecipeCardList({ recipes, className }: RecipeCardListProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className={cn('overflow-x-scroll scrollbar-hide', className)}>
      <div className="flex gap-4 pb-4">
        {recipes.map(recipe => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="flex-shrink-0"
          >
            <RecipeCard
              title={recipe.title ?? ''}
              description={recipe.description ?? ''}
              tags={recipe.tags ?? []}
              cookingTime={(recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)}
              imageUrl={
                recipe.imageUrl && recipe.imageUrl.length > 0
                  ? recipe.imageUrl
                  : (process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL ?? '')
              }
              imageAlt={recipe.title ?? ''}
              className="cursor-pointer h-full"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
