import { Ingredients } from '@/components/ui/ingredients';
import { RecipeDetailHeader } from '@/components/ui/recipe-detail-header';
import { TimeCard } from '@/components/ui/time-card';

export default function Page() {
  // サンプルデータ
  const sampleIngredients = [
    { name: '鶏もも肉', amount: '300', unit: 'g', note: '' },
    { name: '玉ねぎ', amount: '1', unit: '個', note: '中サイズ' },
    { name: '人参', amount: '1', unit: '本', note: '' },
    { name: 'じゃがいも', amount: '2', unit: '個', note: '' },
    { name: 'カレールー', amount: '1/2', unit: '箱', note: '' },
    { name: '水', amount: '400', unit: 'ml', note: '' },
  ];

  return (
    <div className="w-full max-w-[600px] mx-auto min-h-screen">
      <div className="flex flex-col gap-8">
        <div className="items-center justify-center">
          <RecipeDetailHeader
            title="kantacky"
            description="ore"
            tags={['tag1', 'tag2', 'tag3']}
          />
        </div>
        {/* 調理時間カード */}
        <div className="flex flex-row items-center justify-center gap-2">
          <TimeCard title="準備時間" label="30分" />
          <TimeCard title="調理時間" label="30分" />
          <TimeCard title="人前" label="4人前" />
        </div>

        {/* 材料リスト */}
        <Ingredients ingredients={sampleIngredients} />
      </div>
    </div>
  );
}
