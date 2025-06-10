# Vibe Cooking Web - クライアントアーキテクチャ

## プロジェクト概要

Vibe Cooking Webは、料理・レシピプラットフォーム向けの**API-First開発**と**レイヤードアーキテクチャ**を採用したNext.js 15 App Routerプロジェクトです。

## 技術スタック

### コアフレームワーク
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**

### 開発ツール・ライブラリ
- **pnpm** - パッケージマネージャー
- **Turbopack** - 高速ビルドツール
- **ESLint** - コード品質管理
- **OpenAPI Generator CLI** - API クライアント生成
- **Redocly CLI** - API ドキュメント生成・プレビュー

### フォント最適化
- **Geist Sans & Geist Mono** - next/fontによる自動最適化

## アーキテクチャパターン

### レイヤードアーキテクチャ

プロジェクトは以下の5層構造で構成されます：

```
UI Layer (Presentation)
    ↓
Presenter Layer
    ↓
Service Layer
    ↓
Repository Layer
    ↓
External API / Data Source
```

#### 1. UI Layer（UIレイヤー）
- **責務**: ユーザーインターフェースの描画とユーザーインタラクション
- **技術**: React Components, Next.js Pages, Tailwind CSS
- **場所**: `src/app/`, `src/components/`
- **特徴**: プレゼンテーション専用、ビジネスロジックは含まない

#### 2. Presenter Layer（プレゼンターレイヤー）
- **責務**: UIの状態管理、イベントハンドリング、サービス層との橋渡し
- **技術**: React Hooks, Custom Hooks
- **場所**: `src/presenters/`
- **特徴**: UIとビジネスロジックの分離、テスタブルな状態管理

#### 3. Service Layer（サービスレイヤー）
- **責務**: ビジネスロジック、データ変換、複数リポジトリの組み合わせ
- **場所**: `src/services/`
- **特徴**: ドメイン固有のロジック、トランザクション管理

#### 4. Repository Layer（リポジトリレイヤー）
- **責務**: データアクセスの抽象化、APIクライアントの管理
- **場所**: `src/repositories/`
- **特徴**: データソースの詳細を隠蔽、型安全なデータアクセス

#### 5. DI Container（依存性注入コンテナ）
- **責務**: 各レイヤー間の依存関係管理、インスタンス生成
- **場所**: `src/di/`
- **特徴**: 疎結合、テスタビリティの向上

### API-First開発

OpenAPI仕様書（`openapi/openapi.yaml`）を**真実の情報源**として、型安全なTypeScriptクライアントコードを自動生成します。

```
openapi/openapi.yaml → `pnpm run generate:api` → src/lib/api/
```

## プロジェクト構造

```
vibe-cooking-web/
├── src/
│   ├── app/                   # Next.js App Router (UI Layer)
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   └── globals.css        # グローバルスタイル
│   ├── components/            # UIコンポーネント (UI Layer)
│   │   ├── ui/                # 基本UIコンポーネント
│   │   └── features/          # 機能別コンポーネント
│   ├── presenters/            # プレゼンター (Presenter Layer)
│   │   ├── hooks/             # カスタムフック
│   │   └── stores/            # 状態管理
│   ├── services/              # ビジネスロジック (Service Layer)
│   │   ├── recipe/            # レシピ関連サービス
│   │   └── user/              # ユーザー関連サービス
│   ├── repositories/          # データアクセス (Repository Layer)
│   │   ├── interfaces/        # リポジトリインターフェース
│   │   └── implementations/   # 実装
│   ├── di/                    # 依存性注入 (DI Container)
│   │   ├── container.ts       # DIコンテナ
│   │   └── providers.tsx      # Reactプロバイダー
│   ├── lib/
│   │   ├── api/               # 自動生成されたAPIクライアント
│   │   └── utils/             # ユーティリティ関数
│   └── types/                 # 型定義
├── openapi/
│   └── openapi.yaml           # API仕様書
├── public/                    # 静的アセット
├── docs/                      # プロジェクトドキュメント
└── CLAUDE.md                  # Claude Code用プロジェクト指示
```

## データフロー

### 1. 基本的なデータフロー
```
User Input → UI Component → Presenter → Service → Repository → API
                ↓              ↓          ↓          ↓         ↓
            UI Update ←  State Update ←  Data  ←  Response ←  HTTP
```

### 2. 依存性注入によるインスタンス管理
```typescript
// DI Container
const container = {
  recipeRepository: new RecipeRepository(apiClient),
  recipeService: new RecipeService(recipeRepository),
  recipePresenter: new RecipePresenter(recipeService)
}

// React Context
<DIProvider container={container}>
  <App />
</DIProvider>
```

## レイヤー別実装例

### UI Layer
```typescript
// src/components/features/recipe/RecipeList.tsx
export const RecipeList: React.FC = () => {
  const { recipes, loading, fetchRecipes } = useRecipePresenter()
  
  return (
    <div>
      {loading ? <Loading /> : recipes.map(recipe => 
        <RecipeCard key={recipe.id} recipe={recipe} />
      )}
    </div>
  )
}
```

### Presenter Layer
```typescript
// src/presenters/hooks/useRecipePresenter.ts
export const useRecipePresenter = () => {
  const { recipeService } = useDI()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  
  const fetchRecipes = async () => {
    setLoading(true)
    const result = await recipeService.getAllRecipes()
    setRecipes(result)
    setLoading(false)
  }
  
  return { recipes, loading, fetchRecipes }
}
```

### Service Layer
```typescript
// src/services/recipe/RecipeService.ts
export class RecipeService {
  constructor(private recipeRepository: IRecipeRepository) {}
  
  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = await this.recipeRepository.findAll()
    return recipes.map(recipe => this.enrichRecipeData(recipe))
  }
  
  private enrichRecipeData(recipe: Recipe): Recipe {
    // ビジネスロジック: データの加工・検証など
    return { ...recipe, totalTime: recipe.prepTime + recipe.cookTime }
  }
}
```

### Repository Layer
```typescript
// src/repositories/interfaces/IRecipeRepository.ts
export interface IRecipeRepository {
  findAll(): Promise<Recipe[]>
  findById(id: string): Promise<Recipe | null>
}

// src/repositories/implementations/RecipeRepository.ts
export class RecipeRepository implements IRecipeRepository {
  constructor(private apiClient: DefaultApi) {}
  
  async findAll(): Promise<Recipe[]> {
    const response = await this.apiClient.getRecipes()
    return response.recipes || []
  }
  
  async findById(id: string): Promise<Recipe | null> {
    try {
      return await this.apiClient.getRecipeById({ id })
    } catch (error) {
      if (error.status === 404) return null
      throw error
    }
  }
}
```

### DI Container
```typescript
// src/di/container.ts
export const createDIContainer = () => {
  const apiClient = new DefaultApi()
  const recipeRepository = new RecipeRepository(apiClient)
  const recipeService = new RecipeService(recipeRepository)
  
  return {
    recipeRepository,
    recipeService
  }
}

// src/di/providers.tsx
const DIContext = createContext<ReturnType<typeof createDIContainer> | null>(null)

export const DIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const container = useMemo(() => createDIContainer(), [])
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>
}

export const useDI = () => {
  const context = useContext(DIContext)
  if (!context) throw new Error('useDI must be used within DIProvider')
  return context
}
```

## アーキテクチャの利点

### 1. 関心の分離
- 各レイヤーが単一責任を持つ
- 変更の影響範囲を限定
- コードの可読性・保守性向上

### 2. テスタビリティ
- 各レイヤーを独立してテスト可能
- モックやスタブの活用が容易
- 単体テスト・統合テストの実装が簡単

### 3. 拡張性
- 新機能追加時の影響を最小化
- レイヤー単位での機能拡張
- 技術スタック変更への対応力

### 4. 型安全性
- TypeScriptによる静的型チェック
- レイヤー間の型安全なデータ交換
- コンパイル時エラー検出

## 開発ワークフロー

### 1. 新機能開発の流れ
```bash
1. OpenAPI仕様更新 → pnpm run generate:api
2. Repository Interface定義
3. Repository Implementation実装
4. Service Layer実装
5. Presenter Layer実装
6. UI Component実装
7. DI Container更新
```

### 2. テスト戦略
```bash
1. Repository Layer: APIクライアントのモック
2. Service Layer: リポジトリのモック
3. Presenter Layer: サービスのモック
4. UI Layer: プレゼンターのモック
```

## 重要な開発ルール

### 依存関係の方向
- 上位レイヤーから下位レイヤーへの一方向依存
- インターフェースを通じた依存関係の抽象化
- 循環依存の禁止

### コード組織
- レイヤー単位でのディレクトリ分割
- 機能単位でのモジュール分割
- 単一責任原則の徹底

### 型安全性
- 全レイヤーでのTypeScript活用
- インターフェースによる契約定義
- 実行時型チェックの活用