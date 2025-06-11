import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // サンプルレシピデータ
  const recipe1 = await prisma.recipe.create({
    data: {
      title: 'チキンカレー',
      description: '本格的なスパイスを使った美味しいチキンカレーです',
      prepTime: 20,
      cookTime: 40,
      servings: 4,
      tags: ['カレー', 'チキン', '辛い'],
      ingredients: {
        create: [
          { name: 'チキン', amount: 400, unit: 'g' },
          { name: '玉ねぎ', amount: 2, unit: '個' },
          { name: 'トマト缶', amount: 1, unit: '缶' },
          { name: 'ココナッツミルク', amount: 400, unit: 'ml' },
          { name: 'カレー粉', amount: 2, unit: '大さじ' },
          { name: 'ガラムマサラ', amount: 1, unit: '小さじ' },
          { name: 'ショウガ', amount: 1, unit: 'かけ', notes: 'みじん切り' },
          { name: 'ニンニク', amount: 2, unit: 'かけ', notes: 'みじん切り' },
        ],
      },
      instructions: {
        create: [
          {
            step: 1,
            title: '野菜を切る',
            description:
              '玉ねぎを薄切りにし、ショウガとニンニクをみじん切りにする',
            estimatedTime: 10,
          },
          {
            step: 2,
            title: 'チキンを切る',
            description: 'チキンを一口大に切る',
            estimatedTime: 5,
          },
          {
            step: 3,
            title: 'チキンを炒める',
            description: 'フライパンに油を熱し、チキンを炒めて取り出す',
            estimatedTime: 8,
          },
          {
            step: 4,
            title: '野菜を炒める',
            description: '同じフライパンで玉ねぎ、ショウガ、ニンニクを炒める',
            estimatedTime: 7,
          },
          {
            step: 5,
            title: 'スパイスを加える',
            description: 'カレー粉とガラムマサラを加えて香りを出す',
            estimatedTime: 2,
          },
          {
            step: 6,
            title: 'カレーを煮込む',
            description:
              'トマト缶とココナッツミルクを加え、チキンを戻して煮込む',
            estimatedTime: 20,
          },
        ],
      },
    },
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      title: 'パスタアラビアータ',
      description: 'ピリ辛トマトソースのシンプルなパスタです',
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      tags: ['パスタ', '辛い', 'イタリアン'],
      ingredients: {
        create: [
          { name: 'スパゲッティ', amount: 200, unit: 'g' },
          { name: 'トマト缶', amount: 1, unit: '缶' },
          { name: 'ニンニク', amount: 3, unit: 'かけ', notes: 'スライス' },
          { name: '鷹の爪', amount: 2, unit: '本' },
          { name: 'オリーブオイル', amount: 3, unit: '大さじ' },
          {
            name: 'パルメザンチーズ',
            amount: 30,
            unit: 'g',
            notes: '削ったもの',
          },
          { name: 'パセリ', amount: 1, unit: '束', notes: 'みじん切り' },
        ],
      },
      instructions: {
        create: [
          {
            step: 1,
            title: 'パスタを茹でる',
            description: 'パスタを茹でる（袋の表示時間より1分短く）',
            estimatedTime: 8,
          },
          {
            step: 2,
            title: 'きのこを炒める',
            description:
              'フライパンにオリーブオイル、ニンニク、鷹の爪を入れて弱火で加熱',
            estimatedTime: 3,
          },
          {
            step: 3,
            title: 'トマト缶を加えて煮詰める',
            description: 'トマト缶を加えて中火で煮詰める',
            estimatedTime: 5,
          },
          {
            step: 4,
            title: 'パスタを合わせる',
            description: '茹で上がったパスタとパスタの茹で汁を加えて混ぜる',
            estimatedTime: 2,
          },
          {
            step: 5,
            title: 'パルメザンチーズとパセリを振りかけて完成',
            description: 'パルメザンチーズとパセリを振りかけて完成',
            estimatedTime: 1,
          },
        ],
      },
    },
  });

  console.log(`Created recipes: ${recipe1.title}, ${recipe2.title}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
