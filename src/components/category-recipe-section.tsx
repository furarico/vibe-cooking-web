import { RecipeCardList } from '@/components/ui/recipe-card-list';
import { Recipe } from '@/lib/api-client';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface CategoryRecipeSectionProps {
  category: Category;
  recipes: Recipe[];
}

export function CategoryRecipeSection({
  category,
  recipes,
}: CategoryRecipeSectionProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <Link href={`/recipes?category=${category.name}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          {category.name}
        </h2>
      </Link>
      <RecipeCardList recipes={recipes} />
    </div>
  );
}
