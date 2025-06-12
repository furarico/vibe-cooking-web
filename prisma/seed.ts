import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // カテゴリを作成
  const category1 = await prisma.category.create({
    data: { name: '魚料理' }, // サーモンのハーブ焼き、鯖の味噌煮など
  });
  const category2 = await prisma.category.create({
    data: { name: '肉料理' }, // チキンカレー、豚の生姜焼き、ハンバーグ、唐揚げ、オムライス、カツ丼、親子丼など
  });
  const category3 = await prisma.category.create({
    data: { name: 'パスタ・麺類' }, // パスタアラビアータ、和風きのこパスタなど
  });
  const category4 = await prisma.category.create({
    data: { name: 'サラダ' }, // クラシックシーザーサラダ、アボカドとエビのサラダなど
  });
  const category5 = await prisma.category.create({
    data: { name: '中華料理' }, // 麻婆豆腐、エビチリ、餃子など
  });
  const category6 = await prisma.category.create({
    data: { name: '煮込み料理' }, // ロールキャベツ、ポトフ、肉じゃが、筑前煮など
  });
  const category7 = await prisma.category.create({
    data: { name: '朝食・デザート' }, // フレンチトーストなど
  });
  const category8 = await prisma.category.create({
    data: { name: '揚げ物' }, // 天ぷらなど
  });
  const category9 = await prisma.category.create({
    data: { name: 'ご飯もの・丼物' }, // ちらし寿司、カツ丼、親子丼、パエリアなど
  });
  const category10 = await prisma.category.create({
    data: { name: '汁物・スープ' }, // 豚汁、ミネストローネなど
  });
  const category11 = await prisma.category.create({
    data: { name: '炒め物' }, // 野菜炒めなど
  });
  const category12 = await prisma.category.create({
    data: { name: '副菜' }, // きんぴらごぼう、ほうれん草のおひたしなど
  });
  const category13 = await prisma.category.create({
    data: { name: '多国籍料理' }, // パエリアなど
  });

  // サンプルレシピデータ
const recipe1 = await prisma.recipe.create({
  data: {
    title: 'チキンカレー',
    description: '本格的なスパイスを使った美味しいチキンカレーです',
    categoryId: category2.id,
    prepTime: 20,
    cookTime: 40,
    servings: 4,
    tags: ['カレー', 'チキン', '辛い'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', // 肉料理
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
          description: '玉ねぎを薄切りにし、ショウガとニンニクをみじん切りにする',
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
          description: 'トマト缶とココナッツミルクを加え、チキンを戻して煮込む',
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
    categoryId: category3.id,
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ['パスタ', '辛い', 'イタリアン'],
    imageUrl: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=500', // パスタ・麺類
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

const recipe3 = await prisma.recipe.create({
  data: {
    title: 'サーモンのハーブ焼き',
    description: 'ローズマリーとレモンが香る、シンプルでヘルシーなサーモン料理',
    categoryId: category1.id, // 魚料理カテゴリを想定
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    tags: ['魚', 'ヘルシー', '洋風'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500', // 魚料理
    ingredients: {
      create: [
        { name: '生鮭切り身', amount: 2, unit: '切れ' },
        { name: 'ローズマリー', amount: 2, unit: '枝', notes: '生' },
        { name: 'レモン', amount: 0.5, unit: '個' },
        { name: 'オリーブオイル', amount: 1, unit: '大さじ' },
        { name: '塩', amount: 0.5, unit: '小さじ' },
        { name: '黒こしょう', amount: 0.25, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下準備',
          description: 'サーモンの水気を拭き取り、塩こしょうを振る。レモンは薄切りにする。',
          estimatedTime: 5,
        },
        {
          step: 2,
          title: '焼く',
          description: 'フライパンにオリーブオイルを熱し、サーモンとローズマリー、レモンを並べて焼く。',
          estimatedTime: 10,
        },
        {
          step: 3,
          title: '火を通す',
          description: 'サーモンに火が通るまで両面を焼き、レモンを絞って完成。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe4 = await prisma.recipe.create({
  data: {
    title: '和風きのこパスタ',
    description: '醤油とバターで味付けした、きのこの旨味が詰まった和風パスタ',
    categoryId: category3.id, // パスタカテゴリを想定
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ['パスタ', '和風', 'きのこ'],
    imageUrl: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=500', // パスタ・麺類
    ingredients: {
      create: [
        { name: 'スパゲッティ', amount: 200, unit: 'g' },
        { name: 'しめじ', amount: 100, unit: 'g' },
        { name: 'まいたけ', amount: 100, unit: 'g' },
        { name: 'エリンギ', amount: 1, unit: '本' },
        { name: '醤油', amount: 2, unit: '大さじ' },
        { name: 'バター', amount: 10, unit: 'g' },
        { name: 'にんにく', amount: 1, unit: 'かけ', notes: 'みじん切り' },
        { name: '大葉', amount: 5, unit: '枚', notes: '千切り' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'パスタを茹でる',
          description: '表示時間通りにパスタを茹でる。',
          estimatedTime: 8,
        },
        {
          step: 2,
          title: 'きのこを炒める',
          description: 'フライパンにバターとにんにくを熱し、きのこを炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '味付け',
          description: '醤油を加えてきのこに絡める。',
          estimatedTime: 1,
        },
        {
          step: 4,
          title: 'パスタと合わせる',
          description: '茹で上がったパスタときのこを混ぜ合わせ、大葉を乗せて完成。',
          estimatedTime: 1,
        },
      ],
    },
  },
});

const recipe5 = await prisma.recipe.create({
  data: {
    title: 'クラシックシーザーサラダ',
    description: '自家製ドレッシングで作る、定番のシーザーサラダ',
    categoryId: category4.id, // サラダカテゴリを想定
    prepTime: 15,
    cookTime: 0, // 加熱調理なし
    servings: 2,
    tags: ['サラダ', 'ヘルシー', '洋風'],
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', // サラダ
    ingredients: {
      create: [
        { name: 'ロメインレタス', amount: 1, unit: '個' },
        { name: 'クルトン', amount: 30, unit: 'g' },
        { name: 'パルミジャーノ・レッジャーノ', amount: 30, unit: 'g', notes: '削る' },
        { name: '卵黄', amount: 1, unit: '個' },
        { name: 'レモン汁', amount: 1, unit: '大さじ' },
        { name: 'おろしにんにく', amount: 0.5, unit: '小さじ' },
        { name: 'ディジョンマスタード', amount: 0.5, unit: '小さじ' },
        { name: 'アンチョビペースト', amount: 0.5, unit: '小さじ' },
        { name: 'オリーブオイル', amount: 3, unit: '大さじ' },
        { name: '塩', amount: 0.25, unit: '小さじ' },
        { name: '黒こしょう', amount: 0.25, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'レタスの準備',
          description: 'ロメインレタスを食べやすい大きさにちぎり、水気をよく切る。',
          estimatedTime: 5,
        },
        {
          step: 2,
          title: 'ドレッシングを作る',
          description: '卵黄、レモン汁、にんにく、マスタード、アンチョビペーストを混ぜ、少しずつオリーブオイルを加えながら乳化させる。塩こしょうで味を調える。',
          estimatedTime: 7,
        },
        {
          step: 3,
          title: '盛り付け',
          description: 'レタスとドレッシングを和え、クルトンと削ったパルミジャーノ・レッジャーノを散らして完成。',
          estimatedTime: 3,
        },
      ],
    },
  },
});

const recipe6 = await prisma.recipe.create({
  data: {
    title: '豚の生姜焼き',
    description: 'ご飯が進む、定番の和食。甘辛いタレが食欲をそそります。',
    categoryId: category2.id, // 肉料理カテゴリを想定
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ['和食', '豚肉', 'ご飯が進む'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', // 肉料理
    ingredients: {
      create: [
        { name: '豚ロース薄切り肉', amount: 250, unit: 'g' },
        { name: '玉ねぎ', amount: 0.5, unit: '個', notes: '薄切り' },
        { name: '生姜', amount: 1, unit: 'かけ', notes: 'すりおろし' },
        { name: '醤油', amount: 2, unit: '大さじ' },
        { name: 'みりん', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 1, unit: '大さじ' },
        { name: '砂糖', amount: 0.5, unit: '大さじ' },
        { name: 'サラダ油', amount: 1, unit: '大さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'タレを作る',
          description: '醤油、みりん、酒、砂糖、すりおろし生姜を混ぜ合わせる。',
          estimatedTime: 3,
        },
        {
          step: 2,
          title: '肉を焼く',
          description: 'フライパンにサラダ油を熱し、豚肉を炒める。色が変わったら玉ねぎも加えて炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: 'タレを絡める',
          description: '肉と玉ねぎに火が通ったら、タレを加えて全体に絡める。',
          estimatedTime: 2,
        },
      ],
    },
  },
});

const recipe7 = await prisma.recipe.create({
  data: {
    title: '麻婆豆腐',
    description: 'ピリ辛でご飯が進む、中華の定番料理。',
    categoryId: category5.id, // 中華料理カテゴリを想定
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    tags: ['中華', '豆腐', '辛い'],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500', // 中華料理
    ingredients: {
      create: [
        { name: '豚ひき肉', amount: 150, unit: 'g' },
        { name: '豆腐', amount: 1, unit: '丁', notes: '木綿' },
        { name: '長ねぎ', amount: 0.5, unit: '本', notes: 'みじん切り' },
        { name: '生姜', amount: 1, unit: 'かけ', notes: 'みじん切り' },
        { name: 'にんにく', amount: 1, unit: 'かけ', notes: 'みじん切り' },
        { name: '豆板醤', amount: 1, unit: '大さじ' },
        { name: '甜麺醤', amount: 1, unit: '大さじ' },
        { name: '鶏ガラスープ', amount: 200, unit: 'ml' },
        { name: '醤油', amount: 1, unit: '大さじ' },
        { name: '酒', amount: 1, unit: '大さじ' },
        { name: '片栗粉', amount: 1, unit: '大さじ' },
        { name: '水', amount: 2, unit: '大さじ', notes: '水溶き片栗粉用' },
        { name: 'ごま油', amount: 1, unit: '小さじ' },
        { name: '花椒', amount: 0.5, unit: '小さじ', notes: 'お好みで' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下準備',
          description: '豆腐は1.5cm角に切る。長ねぎ、生姜、にんにくはみじん切りにする。水溶き片栗粉を作る。',
          estimatedTime: 5,
        },
        {
          step: 2,
          title: '具材を炒める',
          description: 'フライパンにごま油を熱し、ひき肉、生姜、にんにく、豆板醤を炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '煮込む',
          description: '甜麺醤、鶏ガラスープ、醤油、酒を加えて煮立たせる。豆腐を加えて優しく煮込む。',
          estimatedTime: 3,
        },
        {
          step: 4,
          title: '仕上げ',
          description: '水溶き片栗粉でとろみをつけ、長ねぎを加えて混ぜる。お好みで花椒を振る。',
          estimatedTime: 2,
        },
      ],
    },
  },
});

const recipe8 = await prisma.recipe.create({
  data: {
    title: 'エビチリ',
    description: 'ぷりぷりのエビと甘辛いチリソースが絶妙な組み合わせ。',
    categoryId: category5.id, // 中華料理カテゴリを想定
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    tags: ['中華', 'エビ', '辛い'],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500', // 中華料理
    ingredients: {
      create: [
        { name: 'むきエビ', amount: 200, unit: 'g' },
        { name: '長ねぎ', amount: 0.5, unit: '本', notes: 'みじん切り' },
        { name: '生姜', amount: 1, unit: 'かけ', notes: 'みじん切り' },
        { name: 'にんにく', amount: 1, unit: 'かけ', notes: 'みじん切り' },
        { name: '豆板醤', amount: 1, unit: '大さじ' },
        { name: 'ケチャップ', amount: 3, unit: '大さじ' },
        { name: '鶏ガラスープ', amount: 100, unit: 'ml' },
        { name: '酒', amount: 1, unit: '大さじ' },
        { name: '砂糖', amount: 1, unit: '小さじ' },
        { name: '酢', amount: 0.5, unit: '小さじ' },
        { name: '片栗粉', amount: 0.5, unit: '大さじ' },
        { name: '水', amount: 1, unit: '大さじ', notes: '水溶き片栗粉用' },
        { name: 'ごま油', amount: 1, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'エビの下処理',
          description: 'エビの背わたを取り、片栗粉と酒少々（分量外）で揉み込み、水で洗い流して水気を拭き取る。',
          estimatedTime: 5,
        },
        {
          step: 2,
          title: '具材を炒める',
          description: 'フライパンにごま油を熱し、生姜、にんにく、豆板醤を炒め、香りが立ったら長ねぎを加えて炒める。',
          estimatedTime: 3,
        },
        {
          step: 3,
          title: 'ソースを作る',
          description: 'ケチャップ、鶏ガラスープ、酒、砂糖、酢を加えて煮立たせる。',
          estimatedTime: 3,
        },
        {
          step: 4,
          title: 'エビを加える',
          description: 'エビを加えて色が変わるまで炒める。水溶き片栗粉でとろみをつける。',
          estimatedTime: 4,
        },
      ],
    },
  },
});

const recipe9 = await prisma.recipe.create({
  data: {
    title: '餃子',
    description: '手作りの皮とジューシーな餡が美味しい、定番の中華料理。',
    categoryId: category5.id, // 中華料理カテゴリを想定
    prepTime: 30,
    cookTime: 15,
    servings: 3,
    tags: ['中華', '豚肉', '手作り'],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500', // 中華料理
    ingredients: {
      create: [
        { name: '豚ひき肉', amount: 200, unit: 'g' },
        { name: 'キャベツ', amount: 200, unit: 'g', notes: 'みじん切り' },
        { name: 'ニラ', amount: 50, unit: 'g', notes: 'みじん切り' },
        { name: '生姜', amount: 1, unit: 'かけ', notes: 'すりおろし' },
        { name: 'にんにく', amount: 1, unit: 'かけ', notes: 'すりおろし' },
        { name: '醤油', amount: 1, unit: '大さじ' },
        { name: '酒', amount: 1, unit: '大さじ' },
        { name: 'ごま油', amount: 1, unit: '小さじ' },
        { name: '塩', amount: 0.5, unit: '小さじ' },
        { name: '餃子の皮', amount: 30, unit: '枚' },
        { name: 'サラダ油', amount: 1, unit: '大さじ' },
        { name: '水', amount: 100, unit: 'ml', notes: '蒸し焼き用' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '餡を作る',
          description: 'ひき肉、キャベツ、ニラ、生姜、にんにく、醤油、酒、ごま油、塩をボウルに入れてよく混ぜる。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '餃子を包む',
          description: '餃子の皮に餡を乗せて包む。',
          estimatedTime: 15,
        },
        {
          step: 3,
          title: '餃子を焼く',
          description: 'フライパンにサラダ油を熱し、餃子を並べて焼き色がつくまで焼く。水を加えて蓋をし、蒸し焼きにする。',
          estimatedTime: 10,
        },
        {
          step: 4,
          title: '仕上げ',
          description: '水分が飛んだら蓋を取り、カリッと焼き上げる。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe10 = await prisma.recipe.create({
  data: {
    title: 'ロールキャベツ',
    description: 'じっくり煮込んだ優しい味わいのロールキャベツ。',
    categoryId: category6.id, // 煮込み料理カテゴリを想定
    prepTime: 25,
    cookTime: 40,
    servings: 4,
    tags: ['洋食', '煮込み', '野菜たっぷり'],
    imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500', // 煮込み料理
    ingredients: {
      create: [
        { name: 'キャベツの葉', amount: 8, unit: '枚' },
        { name: '豚ひき肉', amount: 200, unit: 'g' },
        { name: '玉ねぎ', amount: 0.5, unit: '個', notes: 'みじん切り' },
        { name: 'パン粉', amount: 30, unit: 'g' },
        { name: '牛乳', amount: 50, unit: 'ml' },
        { name: '卵', amount: 1, unit: '個' },
        { name: 'コンソメキューブ', amount: 2, unit: '個' },
        { name: '水', amount: 800, unit: 'ml' },
        { name: '塩', amount: 0.5, unit: '小さじ' },
        { name: 'こしょう', amount: 0.25, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'キャベツの下処理',
          description: 'キャベツの葉を茹でて芯を削ぎ落とす。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '餡を作る',
          description: 'ひき肉、玉ねぎ、パン粉、牛乳、卵、塩、こしょうを混ぜ合わせる。',
          estimatedTime: 10,
        },
        {
          step: 3,
          title: 'ロールキャベツを巻く',
          description: 'キャベツの葉に餡を乗せて巻き、楊枝で止める。',
          estimatedTime: 15,
        },
        {
          step: 4,
          title: '煮込む',
          description: '鍋にロールキャベツを並べ、水とコンソメを加えて弱火でじっくり煮込む。',
          estimatedTime: 40,
        },
      ],
    },
  },
});

const recipe11 = await prisma.recipe.create({
  data: {
    title: 'ポトフ',
    description: '野菜と肉の旨味が溶け込んだ、栄養満点の煮込み料理。',
    categoryId: category6.id, // 煮込み料理カテゴリを想定
    prepTime: 20,
    cookTime: 60,
    servings: 4,
    tags: ['洋食', '煮込み', '野菜たっぷり'],
    imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500', // 煮込み料理
    ingredients: {
      create: [
        { name: '豚バラブロック肉', amount: 300, unit: 'g' },
        { name: 'じゃがいも', amount: 2, unit: '個' },
        { name: 'にんじん', amount: 1, unit: '本' },
        { name: '玉ねぎ', amount: 1, unit: '個' },
        { name: 'キャベツ', amount: 0.25, unit: '個' },
        { name: 'ソーセージ', amount: 4, unit: '本' },
        { name: '固形コンソメ', amount: 2, unit: '個' },
        { name: '水', amount: 1000, unit: 'ml' },
        { name: 'ローリエ', amount: 1, unit: '枚' },
        { name: '塩', amount: 1, unit: '小さじ' },
        { name: 'こしょう', amount: 0.5, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '野菜と肉を切る',
          description: 'じゃがいも、にんじん、玉ねぎ、キャベツ、豚肉を大きめに切る。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '煮込む',
          description: '鍋にすべての材料と水、コンソメ、ローリエを入れ、アクを取りながら弱火で煮込む。',
          estimatedTime: 60,
        },
        {
          step: 3,
          title: '味を調える',
          description: '野菜と肉が柔らかくなったら、塩こしょうで味を調える。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe12 = await prisma.recipe.create({
  data: {
    title: 'フレンチトースト',
    description: 'ふわふわとろける、朝食にぴったりの甘いトースト。',
    categoryId: category7.id, // 朝食・デザートカテゴリを想定
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ['朝食', 'デザート', '甘い'],
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500', // 朝食・デザート
    ingredients: {
      create: [
        { name: '食パン（厚切り）', amount: 2, unit: '枚' },
        { name: '卵', amount: 2, unit: '個' },
        { name: '牛乳', amount: 100, unit: 'ml' },
        { name: '砂糖', amount: 2, unit: '大さじ' },
        { name: 'バター', amount: 10, unit: 'g' },
        { name: 'メープルシロップ', amount: 1, unit: '大さじ', notes: 'お好みで' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '卵液を作る',
          description: '卵、牛乳、砂糖を混ぜ合わせる。',
          estimatedTime: 3,
        },
        {
          step: 2,
          title: 'パンを浸す',
          description: '食パンを卵液に浸し、両面をしっかり吸わせる。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '焼く',
          description: 'フライパンにバターを熱し、パンを両面きつね色になるまで焼く。',
          estimatedTime: 7,
        },
        {
          step: 4,
          title: '盛り付け',
          description: 'お好みでメープルシロップをかけて完成。',
          estimatedTime: 1,
        },
      ],
    },
  },
});

const recipe13 = await prisma.recipe.create({
  data: {
    title: 'オムライス',
    description: 'とろとろ卵とケチャップライスが絶妙な、みんな大好きなオムライス。',
    categoryId: category2.id, // 肉料理カテゴリを想定
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    tags: ['洋食', '卵', '子供向け'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', // 肉料理
    ingredients: {
      create: [
        { name: 'ごはん', amount: 300, unit: 'g' },
        { name: '鶏もも肉', amount: 100, unit: 'g', notes: '1cm角に切る' },
        { name: '玉ねぎ', amount: 0.25, unit: '個', notes: 'みじん切り' },
        { name: 'マッシュルーム', amount: 3, unit: '個', notes: 'スライス' },
        { name: 'ケチャップ', amount: 50, unit: 'g' },
        { name: 'バター', amount: 10, unit: 'g' },
        { name: '卵', amount: 4, unit: '個' },
        { name: '牛乳', amount: 20, unit: 'ml' },
        { name: '塩', amount: 0.25, unit: '小さじ' },
        { name: 'こしょう', amount: 0.1, unit: '小さじ' },
        { name: 'サラダ油', amount: 1, unit: '大さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'ケチャップライスを作る',
          description: 'フライパンにサラダ油を熱し、鶏肉、玉ねぎ、マッシュルームを炒める。ごはんを加えて炒め、ケチャップ、塩こしょうで味を調える。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '卵を焼く',
          description: '別のフライパンにバターを熱し、溶き卵に牛乳と塩こしょうを加えたものを流し入れ、半熟に焼く。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '盛り付け',
          description: 'ケチャップライスを皿に盛り、卵を乗せる。お好みでケチャップをかける。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe14 = await prisma.recipe.create({
  data: {
    title: 'ハンバーグ',
    description: 'ジューシーな手作りハンバーグ。デミグラスソースや和風ソースで。',
    categoryId: category2.id, // 肉料理カテゴリを想定
    prepTime: 20,
    cookTime: 20,
    servings: 3,
    tags: ['洋食', '肉', '手作り'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', // 肉料理
    ingredients: {
      create: [
        { name: '合いびき肉', amount: 300, unit: 'g' },
        { name: '玉ねぎ', amount: 0.5, unit: '個', notes: 'みじん切り' },
        { name: '卵', amount: 1, unit: '個' },
        { name: 'パン粉', amount: 30, unit: 'g' },
        { name: '牛乳', amount: 50, unit: 'ml' },
        { name: 'ナツメグ', amount: 0.1, unit: '小さじ' },
        { name: '塩', amount: 0.5, unit: '小さじ' },
        { name: 'こしょう', amount: 0.25, unit: '小さじ' },
        { name: 'サラダ油', amount: 1, unit: '大さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下準備',
          description: '玉ねぎはみじん切りにして炒め、粗熱を取る。パン粉は牛乳に浸しておく。',
          estimatedTime: 7,
        },
        {
          step: 2,
          title: '種を作る',
          description: '合いびき肉、炒めた玉ねぎ、卵、浸したパン粉、ナツメグ、塩こしょうをボウルに入れ、粘りが出るまでよく混ぜる。',
          estimatedTime: 8,
        },
        {
          step: 3,
          title: '成形して焼く',
          description: '種を小判型に成形し、中央をくぼませる。フライパンにサラダ油を熱し、両面を焼き、蓋をして蒸し焼きにする。',
          estimatedTime: 15,
        },
      ],
    },
  },
});

const recipe15 = await prisma.recipe.create({
  data: {
    title: 'カレーライス',
    description: '日本の国民食。市販のルーで手軽に作れます。',
    categoryId: category2.id, // 肉料理カテゴリを想定 (具材による)
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    tags: ['和食', 'カレー', '定番'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', // 肉料理
    ingredients: {
      create: [
        { name: '豚肉（カレー用）', amount: 200, unit: 'g' },
        { name: 'じゃがいも', amount: 2, unit: '個' },
        { name: 'にんじん', amount: 1, unit: '本' },
        { name: '玉ねぎ', amount: 1, unit: '個' },
        { name: 'カレールー', amount: 100, unit: 'g' },
        { name: '水', amount: 600, unit: 'ml' },
        { name: 'サラダ油', amount: 1, unit: '大さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '具材を切る',
          description: '豚肉、じゃがいも、にんじん、玉ねぎを食べやすい大きさに切る。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '炒める',
          description: '鍋にサラダ油を熱し、豚肉、玉ねぎ、にんじん、じゃがいもの順に炒める。',
          estimatedTime: 10,
        },
        {
          step: 3,
          title: '煮込む',
          description: '水を加えて煮立たせ、アクを取りながら具材が柔らかくなるまで煮込む。',
          estimatedTime: 15,
        },
        {
          step: 4,
          title: 'ルーを加える',
          description: '一度火を止め、カレールーを溶かし入れる。再び弱火でとろみがつくまで煮込む。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe16 = await prisma.recipe.create({
  data: {
    title: '唐揚げ',
    description: '外はカリッと、中はジューシーな鶏の唐揚げ。',
    categoryId: category8.id, // 揚げ物カテゴリを想定
    prepTime: 20,
    cookTime: 10,
    servings: 2,
    tags: ['和食', '鶏肉', '揚げ物'],
    imageUrl: 'https://images.unsplash.com/photo-1491884592576-38221bd4314a?w=500', // 揚げ物
    ingredients: {
      create: [
        { name: '鶏もも肉', amount: 300, unit: 'g' },
        { name: '醤油', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 1, unit: '大さじ' },
        { name: 'おろしにんにく', amount: 1, unit: '小さじ' },
        { name: 'おろし生姜', amount: 1, unit: '小さじ' },
        { name: '片栗粉', amount: 3, unit: '大さじ' },
        { name: '揚げ油', amount: 500, unit: 'ml' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下味をつける',
          description: '鶏もも肉を一口大に切り、醤油、酒、おろしにんにく、おろし生姜をもみ込み、15分ほど置く。',
          estimatedTime: 15,
        },
        {
          step: 2,
          title: '衣をつける',
          description: '鶏肉に片栗粉をまぶす。',
          estimatedTime: 2,
        },
        {
          step: 3,
          title: '揚げる',
          description: '揚げ油を170℃に熱し、鶏肉を二度揚げする。',
          estimatedTime: 8,
        },
      ],
    },
  },
});

const recipe17 = await prisma.recipe.create({
  data: {
    title: '鯖の味噌煮',
    description: 'ご飯によく合う、甘辛い味噌だれで煮込んだ鯖。',
    categoryId: category1.id, // 魚料理カテゴリを想定
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    tags: ['和食', '魚', '煮物'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500', // 魚料理
    ingredients: {
      create: [
        { name: '鯖の切り身', amount: 2, unit: '切れ' },
        { name: '味噌', amount: 3, unit: '大さじ' },
        { name: 'みりん', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 2, unit: '大さじ' },
        { name: '砂糖', amount: 1, unit: '大さじ' },
        { name: '水', amount: 100, unit: 'ml' },
        { name: '生姜', amount: 1, unit: 'かけ', notes: '薄切り' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下処理',
          description: '鯖の切り身に熱湯をかけて臭みを取り、水気を拭き取る。',
          estimatedTime: 3,
        },
        {
          step: 2,
          title: '煮汁を作る',
          description: '鍋に味噌、みりん、酒、砂糖、水を混ぜ合わせる。生姜を加えて煮立たせる。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '煮込む',
          description: '鯖を煮汁に入れ、落とし蓋をして弱火で煮込む。',
          estimatedTime: 15,
        },
      ],
    },
  },
});

const recipe18 = await prisma.recipe.create({
  data: {
    title: '天ぷら',
    description: '旬の食材を揚げた、日本の代表的な料理。',
    categoryId: category8.id, // 揚げ物カテゴリを想定
    prepTime: 20,
    cookTime: 15,
    servings: 2,
    tags: ['和食', '揚げ物', '野菜'],
    imageUrl: 'https://images.unsplash.com/photo-1491884592576-38221bd4314a?w=500', // 揚げ物
    ingredients: {
      create: [
        { name: 'えび', amount: 6, unit: '尾' },
        { name: 'なす', amount: 1, unit: '本' },
        { name: 'しいたけ', amount: 4, unit: '個' },
        { name: 'ピーマン', amount: 1, unit: '個' },
        { name: '天ぷら粉', amount: 100, unit: 'g' },
        { name: '冷水', amount: 160, unit: 'ml' },
        { name: '揚げ油', amount: 500, unit: 'ml' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下準備',
          description: 'えびは背わたを取り、なす、しいたけ、ピーマンは食べやすい大きさに切る。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '衣を作る',
          description: '天ぷら粉と冷水を混ぜ合わせる。',
          estimatedTime: 3,
        },
        {
          step: 3,
          title: '揚げる',
          description: '揚げ油を170℃に熱し、具材を衣にくぐらせて揚げる。',
          estimatedTime: 12,
        },
      ],
    },
  },
});

const recipe19 = await prisma.recipe.create({
  data: {
    title: '肉じゃが',
    description: '家庭料理の定番。ほっとする甘辛い味わい。',
    categoryId: category6.id, // 煮込み料理カテゴリを想定
    prepTime: 15,
    cookTime: 25,
    servings: 3,
    tags: ['和食', '煮物', '家庭料理'],
    imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500', // 煮込み料理
    ingredients: {
      create: [
        { name: '牛薄切り肉', amount: 200, unit: 'g' },
        { name: 'じゃがいも', amount: 2, unit: '個' },
        { name: 'にんじん', amount: 1, unit: '本' },
        { name: '玉ねぎ', amount: 1, unit: '個' },
        { name: 'しらたき', amount: 100, unit: 'g' },
        { name: '絹さや', amount: 5, unit: '枚', notes: '飾り用' },
        { name: 'だし汁', amount: 300, unit: 'ml' },
        { name: '醤油', amount: 3, unit: '大さじ' },
        { name: 'みりん', amount: 3, unit: '大さじ' },
        { name: '砂糖', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 2, unit: '大さじ' },
        { name: 'サラダ油', amount: 1, unit: '大さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '具材を切る',
          description: 'じゃがいも、にんじん、玉ねぎを乱切りにする。牛肉は食べやすい大きさに切る。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '炒める',
          description: '鍋にサラダ油を熱し、牛肉を炒める。色が変わったら野菜も加えて炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '煮込む',
          description: 'だし汁、醤油、みりん、砂糖、酒を加えて煮立たせ、アクを取りながら煮込む。',
          estimatedTime: 20,
        },
        {
          step: 4,
          title: '仕上げ',
          description: 'じゃがいもが柔らかくなったら、絹さやを加えて彩りよく仕上げる。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe20 = await prisma.recipe.create({
  data: {
    title: '筑前煮',
    description: '根菜と鶏肉をじっくり煮込んだ、おふくろの味。',
    categoryId: category6.id, // 煮込み料理カテゴリを想定
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    tags: ['和食', '煮物', '根菜'],
    imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500', // 煮込み料理
    ingredients: {
      create: [
        { name: '鶏もも肉', amount: 200, unit: 'g' },
        { name: 'ごぼう', amount: 1, unit: '本' },
        { name: 'れんこん', amount: 100, unit: 'g' },
        { name: 'にんじん', amount: 1, unit: '本' },
        { name: 'こんにゃく', amount: 100, unit: 'g' },
        { name: '干ししいたけ', amount: 4, unit: '枚' },
        { name: 'だし汁', amount: 400, unit: 'ml' },
        { name: '醤油', amount: 3, unit: '大さじ' },
        { name: 'みりん', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 2, unit: '大さじ' },
        { name: '砂糖', amount: 1, unit: '大さじ' },
        { name: 'ごま油', amount: 1, unit: '大さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '具材の下処理',
          description: '鶏肉は一口大に、ごぼう、れんこん、にんじんは乱切りに。こんにゃくは手でちぎる。干ししいたけは戻しておく。',
          estimatedTime: 15,
        },
        {
          step: 2,
          title: '炒める',
          description: '鍋にごま油を熱し、鶏肉を炒める。色が変わったら野菜とこんにゃくを加えて炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '煮込む',
          description: 'だし汁、醤油、みりん、酒、砂糖を加えて煮立たせ、アクを取りながら煮込む。',
          estimatedTime: 25,
        },
      ],
    },
  },
});

const recipe21 = await prisma.recipe.create({
  data: {
    title: 'ちらし寿司',
    description: '華やかで彩り豊かな、お祝い事にもぴったりのちらし寿司。',
    categoryId: category9.id, // ご飯ものカテゴリを想定
    prepTime: 20,
    cookTime: 10, // 寿司飯の準備時間
    servings: 4,
    tags: ['和食', 'ご飯もの', 'お祝い'],
    imageUrl: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=500', // ご飯もの・丼物
    ingredients: {
      create: [
        { name: '米', amount: 2, unit: '合' },
        { name: 'A. 酢', amount: 4, unit: '大さじ' },
        { name: 'A. 砂糖', amount: 2, unit: '大さじ' },
        { name: 'A. 塩', amount: 1, unit: '小さじ' },
        { name: 'まぐろ（刺身用）', amount: 100, unit: 'g' },
        { name: 'サーモン（刺身用）', amount: 100, unit: 'g' },
        { name: '卵', amount: 2, unit: '個', notes: '錦糸卵用' },
        { name: 'きゅうり', amount: 0.5, unit: '本', notes: '千切り' },
        { name: 'カニカマ', amount: 4, unit: '本' },
        { name: 'いくら', amount: 30, unit: 'g' },
        { name: '刻みのり', amount: 5, unit: 'g' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '寿司飯を作る',
          description: '炊いたご飯にAを混ぜ合わせ、うちわで扇ぎながら冷ます。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '具材の準備',
          description: 'まぐろ、サーモンは薄切りにする。卵は錦糸卵にする。きゅうりは千切り、カニカマはほぐす。',
          estimatedTime: 10,
        },
        {
          step: 3,
          title: '盛り付け',
          description: '寿司飯を器に盛り、用意した具材を彩りよく乗せる。いくらと刻みのりを散らす。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe22 = await prisma.recipe.create({
  data: {
    title: '豚汁',
    description: '具だくさんで栄養満点。寒い日に嬉しい体が温まる汁物。',
    categoryId: category10.id, // 汁物カテゴリを想定
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    tags: ['和食', '汁物', '野菜たっぷり'],
    imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=500', // 汁物・スープ
    ingredients: {
      create: [
        { name: '豚こま切れ肉', amount: 150, unit: 'g' },
        { name: '大根', amount: 100, unit: 'g' },
        { name: 'にんじん', amount: 0.5, unit: '本' },
        { name: 'ごぼう', amount: 0.5, unit: '本' },
        { name: '里芋', amount: 2, unit: '個' },
        { name: 'こんにゃく', amount: 50, unit: 'g' },
        { name: '油揚げ', amount: 0.5, unit: '枚' },
        { name: 'だし汁', amount: 800, unit: 'ml' },
        { name: '味噌', amount: 3, unit: '大さじ' },
        { name: 'ごま油', amount: 1, unit: '大さじ' },
        { name: '小ねぎ', amount: 2, unit: '本', notes: '小口切り' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '具材を切る',
          description: '大根、にんじん、ごぼう、里芋は乱切りに。こんにゃくは手でちぎる。油揚げは短冊切り。豚肉は食べやすい大きさに切る。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '炒める',
          description: '鍋にごま油を熱し、豚肉を炒める。色が変わったら野菜、こんにゃく、油揚げを加えて炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '煮込む',
          description: 'だし汁を加えて煮立たせ、アクを取りながら具材が柔らかくなるまで煮込む。',
          estimatedTime: 15,
        },
        {
          step: 4,
          title: '味噌を溶く',
          description: '火を止めて味噌を溶き入れる。再び弱火で温め、器に盛り小ねぎを散らす。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe23 = await prisma.recipe.create({
  data: {
    title: '野菜炒め',
    description: 'シャキシャキとした食感が美味しい、手軽に作れる野菜炒め。',
    categoryId: category11.id, // 炒め物カテゴリを想定
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ['中華', '野菜', '時短'],
    imageUrl: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=500', // 炒め物
    ingredients: {
      create: [
        { name: 'キャベツ', amount: 200, unit: 'g' },
        { name: 'もやし', amount: 1, unit: '袋' },
        { name: '豚こま切れ肉', amount: 100, unit: 'g' },
        { name: 'ピーマン', amount: 1, unit: '個' },
        { name: 'にんじん', amount: 0.5, unit: '本' },
        { name: 'ごま油', amount: 1, unit: '大さじ' },
        { name: 'A. 醤油', amount: 2, unit: '大さじ' },
        { name: 'A. オイスターソース', amount: 1, unit: '大さじ' },
        { name: 'A. 酒', amount: 1, unit: '大さじ' },
        { name: 'A. 砂糖', amount: 0.5, unit: '小さじ' },
        { name: 'A. 鶏ガラスープの素', amount: 0.5, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下準備',
          description: 'キャベツ、ピーマン、にんじんが食べやすい大きさに切る。豚肉は一口大に切る。Aを混ぜ合わせておく。',
          estimatedTime: 7,
        },
        {
          step: 2,
          title: '炒める',
          description: 'フライパンにごま油を熱し、豚肉を炒める。色が変わったら、にんじん、キャベツ、ピーマン、もやしの順に加えて炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '味付け',
          description: 'Aを加えて全体に絡める。',
          estimatedTime: 3,
        },
      ],
    },
  },
});

const recipe24 = await prisma.recipe.create({
  data: {
    title: 'きんぴらごぼう',
    description: 'ごぼうの風味とシャキシャキ食感が美味しい、ご飯が進む和食の副菜。',
    categoryId: category12.id, // 副菜カテゴリを想定
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    tags: ['和食', '副菜', '根菜'],
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500', // 副菜
    ingredients: {
      create: [
        { name: 'ごぼう', amount: 1, unit: '本' },
        { name: 'にんじん', amount: 0.5, unit: '本' },
        { name: 'ごま油', amount: 1, unit: '大さじ' },
        { name: '醤油', amount: 2, unit: '大さじ' },
        { name: 'みりん', amount: 2, unit: '大さじ' },
        { name: '酒', amount: 1, unit: '大さじ' },
        { name: '砂糖', amount: 1, unit: '大さじ' },
        { name: '鷹の爪（輪切り）', amount: 0.5, unit: '本', notes: 'お好みで' },
        { name: 'いりごま', amount: 1, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'ごぼうの下処理',
          description: 'ごぼう、にんじんがささがきにし、ごぼうは水にさらしてアクを抜く。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '炒める',
          description: 'フライパンにごま油と鷹の爪を熱し、ごぼうとにんじんを炒める。',
          estimatedTime: 7,
        },
        {
          step: 3,
          title: '味付け',
          description: '醤油、みりん、酒、砂糖を加えて汁気がなくなるまで炒め煮にする。いりごまを振って完成。',
          estimatedTime: 8,
        },
      ],
    },
  },
});

const recipe25 = await prisma.recipe.create({
  data: {
    title: 'ほうれん草のおひたし',
    description: '出汁の効いた優しい味わい。和食の箸休めに。',
    categoryId: category12.id, // 副菜カテゴリを想定
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    tags: ['和食', '副菜', '野菜'],
    imageUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500', // 副菜
    ingredients: {
      create: [
        { name: 'ほうれん草', amount: 1, unit: '束' },
        { name: 'だし汁', amount: 100, unit: 'ml' },
        { name: '醤油', amount: 1, unit: '大さじ' },
        { name: 'みりん', amount: 0.5, unit: '大さじ' },
        { name: 'かつお節', amount: 2, unit: 'g', notes: 'お好みで' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'ほうれん草を茹でる',
          description: 'ほうれん草をさっと茹で、冷水にとり、水気をしっかり絞る。',
          estimatedTime: 3,
        },
        {
          step: 2,
          title: '調味料を混ぜる',
          description: 'だし汁、醤油、みりんを混ぜ合わせる。',
          estimatedTime: 1,
        },
        {
          step: 3,
          title: '浸す',
          description: 'ほうれん草を食べやすい長さに切り、調味料に浸す。お好みでかつお節をかける。',
          estimatedTime: 1,
        },
      ],
    },
  },
});

const recipe26 = await prisma.recipe.create({
  data: {
    title: 'アボカドとエビのサラダ',
    description: 'クリーミーなアボカドとぷりぷりのエビが美味しい、彩り豊かなサラダ。',
    categoryId: category4.id, // サラダカテゴリを想定
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    tags: ['サラダ', 'ヘルシー', 'おしゃれ'],
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', // サラダ
    ingredients: {
      create: [
        { name: 'アボカド', amount: 1, unit: '個' },
        { name: 'むきエビ', amount: 100, unit: 'g' },
        { name: 'レタス', amount: 50, unit: 'g' },
        { name: 'ミニトマト', amount: 4, unit: '個' },
        { name: 'マヨネーズ', amount: 2, unit: '大さじ' },
        { name: 'レモン汁', amount: 1, unit: '小さじ' },
        { name: '塩', amount: 0.25, unit: '小さじ' },
        { name: '黒こしょう', amount: 0.1, unit: '小さじ' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '具材の準備',
          description: 'エビは茹でておく。アボカドは角切りにし、レモン汁をかける。レタスは食べやすい大きさにちぎる。ミニトマトは半分に切る。',
          estimatedTime: 7,
        },
        {
          step: 2,
          title: '和える',
          description: 'ボウルにエビ、アボカド、マヨネーズ、塩こしょうを加えて混ぜ合わせる。',
          estimatedTime: 3,
        },
        {
          step: 3,
          title: '盛り付け',
          description: 'レタスを敷いた皿に和えた具材を乗せ、ミニトマトを添える。',
          estimatedTime: 2,
        },
      ],
    },
  },
});

const recipe27 = await prisma.recipe.create({
  data: {
    title: 'ミネストローネ',
    description: '野菜たっぷりのトマトベーススープ。栄養満点で体が温まります。',
    categoryId: category10.id, // 汁物カテゴリを想定
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    tags: ['洋食', 'スープ', '野菜たっぷり'],
    imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=500', // 汁物・スープ
    ingredients: {
      create: [
        { name: 'ベーコン', amount: 50, unit: 'g', notes: '1cm幅に切る' },
        { name: '玉ねぎ', amount: 0.5, unit: '個', notes: 'みじん切り' },
        { name: 'にんじん', amount: 0.5, unit: '本', notes: '1cm角切り' },
        { name: 'じゃがいも', amount: 1, unit: '個', notes: '1cm角切り' },
        { name: 'セロリ', amount: 0.5, unit: '本', notes: '1cm角切り' },
        { name: 'キャベツ', amount: 50, unit: 'g', notes: 'ざく切り' },
        { name: 'トマト缶（カット）', amount: 1, unit: '缶' },
        { name: '水', amount: 400, unit: 'ml' },
        { name: '固形コンソメ', amount: 1, unit: '個' },
        { name: 'オリーブオイル', amount: 1, unit: '大さじ' },
        { name: '塩', amount: 0.5, unit: '小さじ' },
        { name: 'こしょう', amount: 0.25, unit: '小さじ' },
        { name: 'パセリ', amount: 1, unit: '枝', notes: 'みじん切り、飾り用' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '具材を切る',
          description: 'すべての野菜とベーコンを食べやすい大きさに切る。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '炒める',
          description: '鍋にオリーブオイルを熱し、ベーコン、玉ねぎ、にんじん、じゃがいも、セロリの順に炒める。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '煮込む',
          description: 'トマト缶、水、コンソメ、キャベツを加えて煮立たせ、アクを取りながら野菜が柔らかくなるまで煮込む。',
          estimatedTime: 25,
        },
        {
          step: 4,
          title: '味を調える',
          description: '塩こしょうで味を調え、器に盛りパセリを散らす。',
          estimatedTime: 5,
        },
      ],
    },
  },
});

const recipe28 = await prisma.recipe.create({
  data: {
    title: 'カツ丼',
    description: '揚げたてサクサクのカツを卵でとじた、ボリューム満点の一品。',
    categoryId: category9.id, // ご飯ものカテゴリを想定
    prepTime: 15,
    cookTime: 20,
    servings: 1,
    tags: ['和食', '揚げ物', 'ご飯もの'],
    imageUrl: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=500', // ご飯もの・丼物
    ingredients: {
      create: [
        { name: '豚ロース肉（とんかつ用）', amount: 150, unit: 'g' },
        { name: '卵', amount: 2, unit: '個' },
        {
          name: '玉ねぎ',
          amount: 0.25,
          unit: '個',
          notes: '薄切り',
        },
        { name: 'A. だし汁', amount: 100, unit: 'ml' },
        { name: 'A. 醤油', amount: 2, unit: '大さじ' },
        { name: 'A. みりん', amount: 2, unit: '大さじ' },
        { name: 'A. 砂糖', amount: 1, unit: '大さじ' },
        { name: 'ご飯', amount: 200, unit: 'g' },
        { name: 'パン粉', amount: 50, unit: 'g' },
        { name: '小麦粉', amount: 20, unit: 'g' },
        { name: '揚げ油', amount: 100, unit: 'ml' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: 'とんかつを揚げる',
          description: '豚肉に塩こしょう（分量外）を振り、小麦粉、卵、パン粉の順につけ、170℃の油で揚げる。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '煮汁で煮る',
          description: 'フライパンにAと玉ねぎを入れて煮立たせる。揚がったとんかつを乗せて煮る。',
          estimatedTime: 5,
        },
        {
          step: 3,
          title: '卵でとじる',
          description: '溶き卵を回し入れ、蓋をして半熟になるまで火を通す。',
          estimatedTime: 3,
        },
        {
          step: 4,
          title: '盛り付け',
          description: 'ご飯を丼に盛り、カツを乗せて完成。',
          estimatedTime: 2,
        },
      ],
    },
  },
});

const recipe29 = await prisma.recipe.create({
  data: {
    title: '親子丼',
    description: '鶏肉と卵の優しい味わい。手軽に作れる丼物。',
    categoryId: category9.id, // ご飯ものカテゴリを想定
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    tags: ['和食', '鶏肉', 'ご飯もの'],
    imageUrl: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=500', // ご飯もの・丼物
    ingredients: {
      create: [
        { name: '鶏もも肉', amount: 100, unit: 'g' },
        {
          name: '玉ねぎ',
          amount: 0.25,
          unit: '個',
          notes: '薄切り',
        },
        { name: '卵', amount: 2, unit: '個' },
        { name: 'A. だし汁', amount: 100, unit: 'ml' },
        { name: 'A. 醤油', amount: 2, unit: '大さじ' },
        { name: 'A. みりん', amount: 2, unit: '大さじ' },
        { name: 'A. 砂糖', amount: 1, unit: '大さじ' },
        { name: 'ご飯', amount: 200, unit: 'g' },
        { name: '三つ葉', amount: 1, unit: '本', notes: '飾り用' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '具材を切る',
          description: '鶏もも肉は一口大に、玉ねぎは薄切りにする。',
          estimatedTime: 5,
        },
        {
          step: 2,
          title: '煮る',
          description: 'フライパンにAと玉ねぎ、鶏肉を入れて煮る。',
          estimatedTime: 7,
        },
        {
          step: 3,
          title: '卵でとじる',
          description: '鶏肉に火が通ったら、溶き卵を回し入れ、半熟になるまで火を通す。',
          estimatedTime: 3,
        },
        {
          step: 4,
          title: '盛り付け',
          description: 'ご飯を丼に盛り、具材を乗せて三つ葉を散らす。',
          estimatedTime: 2,
        },
      ],
    },
  },
});

const recipe30 = await prisma.recipe.create({
  data: {
    title: 'パエリア',
    description: '魚介の旨味が凝縮された、スペインの代表的な炊き込みご飯。',
    categoryId: category13.id, // ご飯もの（多国籍）カテゴリを想定
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    tags: ['スペイン料理', '魚介', 'パーティー'],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500', // 多国籍料理
    ingredients: {
      create: [
        { name: '米（洗わない）', amount: 2, unit: '合' },
        { name: '有頭エビ', amount: 8, unit: '尾' },
        { name: 'アサリ', amount: 200, unit: 'g' },
        { name: 'イカ', amount: 100, unit: 'g', notes: '輪切り' },
        { name: '鶏もも肉', amount: 100, unit: 'g', notes: '一口大' },
        { name: '玉ねぎ', amount: 0.5, unit: '個', notes: 'みじん切り' },
        { name: 'パプリカ（赤・黄）', amount: 0.5, unit: '個ずつ', notes: '細切り' },
        { name: 'にんにく', amount: 1, unit: 'かけ', notes: 'みじん切り' },
        { name: 'サフラン', amount: 5, unit: '' },
        { name: '白ワイン', amount: 50, unit: 'ml' },
        { name: '水', amount: 400, unit: 'ml' },
        { name: '固形コンソメ', amount: 1, unit: '個' },
        { name: 'オリーブオイル', amount: 2, unit: '大さじ' },
        { name: '塩', amount: 1, unit: '小さじ' },
        { name: 'こしょう', amount: 0.5, unit: '小さじ' },
        { name: 'レモン', amount: 0.5, unit: '個', notes: '飾り用' },
        { name: 'パセリ', amount: 1, unit: '枝', notes: 'みじん切り、飾り用' },
      ],
    },
    instructions: {
      create: [
        {
          step: 1,
          title: '下準備',
          description: 'サフランは水（分量外）に浸しておく。アサリは砂抜きする。鶏肉、イカ、野菜を切る。',
          estimatedTime: 10,
        },
        {
          step: 2,
          title: '具材を炒める',
          description: 'パエリア鍋にオリーブオイルを熱し、鶏肉、エビ、イカを炒めて一度取り出す。玉ねぎ、にんにく、パプリカを炒める。',
          estimatedTime: 10,
        },
        {
          step: 3,
          title: '米とスープを煮込む',
          description: '米を加えて透き通るまで炒める。白ワイン、サフラン水、水、コンソメ、塩こしょうを加えて煮立たせる。',
          estimatedTime: 10,
        },
        {
          step: 4,
          title: '仕上げ',
          description: '取り出した具材とアサリを米の上に並べ、蓋をして弱火で煮込む。水分がなくなったら火を止め、蒸らす。レモンとパセリを飾る。',
          estimatedTime: 15,
        },
      ],
    },
  },
});

console.log(`Created recipes: ${recipe1.title}, ${recipe2.title}, ${recipe3.title}, ${recipe4.title}, ${recipe5.title}, ${recipe6.title}, ${recipe7.title}, ${recipe8.title}, ${recipe9.title}, ${recipe10.title}, ${recipe11.title}, ${recipe12.title}, ${recipe13.title}, ${recipe14.title}, ${recipe15.title}, ${recipe16.title}, ${recipe17.title}, ${recipe18.title}, ${recipe19.title}, ${recipe20.title}, ${recipe21.title}, ${recipe22.title}, ${recipe23.title}, ${recipe24.title}, ${recipe25.title}, ${recipe26.title}, ${recipe27.title}, ${recipe28.title}, ${recipe29.title}, ${recipe30.title}`);
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