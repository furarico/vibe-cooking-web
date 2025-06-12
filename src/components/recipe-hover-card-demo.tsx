import { RecipeHoverCard } from '@/components/ui/recipe-hover-card';

export function RecipeHoverCardDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <RecipeHoverCard
        title="料理名"
        description="料理補足情報テキストテキストテキストテキストテキストテキストテキスト"
        tags={['#rice', '#okinawa', '#tomato']}
        cookingTime="30min"
        imageUrl="/images/recipe-image.png"
        imageAlt="料理の画像"
      />
    </div>
  );
}
