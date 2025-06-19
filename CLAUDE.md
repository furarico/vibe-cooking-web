# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code（claude.ai/code）向けガイダンスを提供します。

## ルール

### 🔄 Git & バージョン管理
- **必須**: 変更を加えた場合は、都度 Git コミットすること
- **必須**: Gitコミットする前に、差分にTypeScriptファイル（`.ts`、`.tsx`）が含まれている場合のみ`pnpm format`を実行してエラーを解消すること

### 📋 ドキュメント管理
- **必須**: プロジェクトに変更を加える際は、CLAUDE.mdの内容に変更が必要かどうかを都度確認すること
- **必須**: CLAUDE.mdの内容が現在のプロジェクト状態と乖離している場合は、必要に応じて更新すること

### 🌐 言語・エンコーディング
- **必須**: 全ての出力は日本語で行うこと
- **必須**: 日本語をファイルに出力する場合は、UTF-8 エンコーディングを使用すること
- **必須**: ファイルの最終行は改行すること

### 🧪 テスト駆動開発（TDD）
- **基本方針**: テスト駆動で開発を行うこと
- **新機能実装時**:
  1. ユニットテストを先に実装すること
  2. テストが失敗することを最初に確認すること
  3. テストが失敗することを確認してから機能を実装すること
  4. 実装後、ユニットテストが成功することを確認すること
- **禁止事項**: 
  - 既存のユニットテストは変更しないこと
  - モック実装をしないこと

### 📁 ファイル命名規則
- **TypeScript**: `.ts`および`.tsx` のファイル名は、`kebab-case` で命名すること

### 💻 TypeScript コーディング規則
- **必須**: `any`型の使用を禁止すること
- **必須**: 型の安全性を保つため、具体的な型定義を使用すること
- **推奨**: `unknown`、`object`、`Record<string, unknown>`等の適切な型を使用すること
- **例外**: 既存のライブラリの型定義が不完全な場合のみ、`// eslint-disable-next-line @typescript-eslint/no-explicit-any`コメントと共に一時的に許可

## 開発コマンド

- **開発サーバー**: `pnpm dev` (高速ビルドのためTurbopackを使用)
- **本番ビルド**: `pnpm build`
- **リンティング**: `pnpm lint`
- **フォーマット**: `pnpm format` (リンティング修正とPrettierフォーマットを実行)
- **テスト**: `pnpm test` (Jestでユニットテストを実行)
- **テスト監視**: `pnpm test:watch` (ファイル変更を監視してテストを自動実行)
- **テストカバレッジ**: `pnpm test:coverage` (カバレッジレポート付きでテストを実行)
- **APIクライアント生成**: `pnpm api:generate` (OpenAPI仕様からTypeScript型定義を再生成)
- **APIドキュメントプレビュー**: `pnpm api:preview` (ブラウザでRedoclyドキュメントを開く)
- **Storybook開発サーバー**: `pnpm storybook` (コンポーネントライブラリの確認・開発)
- **Storybookビルド**: `pnpm build-storybook` (Storybookの静的ビルド)

### データベース関連コマンド
- **Prismaクライアント生成**: `pnpm db:generate` (Prismaクライアントコード生成)
- **Prismaマイグレーション（開発）**: `pnpm db:migrate:dev` (開発環境用マイグレーション作成・適用)
- **Prismaマイグレーション（本番）**: `pnpm db:migrate:prod` (本番環境用マイグレーション適用)
- **Prisma Studio（開発）**: `pnpm db:studio:dev` (開発環境用データベースGUI管理ツール起動)
- **Prisma Studio（本番）**: `pnpm db:studio:prod` (本番環境用データベースGUI管理ツール起動)
- **データベースリセット（開発）**: `pnpm db:reset:dev` (開発環境用データベース完全リセット)
- **データベースリセット（本番）**: `pnpm db:reset:prod` (本番環境用データベース完全リセット)

### Cloud Run関連
- **Dockerビルド**: `docker build -t vibe-cooking .`
- **ローカルテスト**: `docker run -p 3000:3000 vibe-cooking`
- **Google Cloud Runデプロイ**: `pnpm deploy:gcr` (Cloud Runに自動デプロイ)

## アーキテクチャ概要

これは**Next.js 15.3.3 App Router**プロジェクトで、**TypeScript**、**Tailwind CSS 4.1.8**、**shadcn/ui**を使用し、料理・レシピプラットフォーム向けの**APIファースト開発**アプローチで設計されています。**PWA（Progressive Web App）**対応もされており、オフライン機能やホーム画面への追加が可能です。

### 主要なアーキテクチャパターン

**APIファースト開発**: プロジェクトはOpenAPI仕様（`openapi/openapi.yaml`）を使用して型安全なTypeScriptクライアントコードを生成します。API仕様はフロントエンドとバックエンド間のデータ契約の信頼できる情報源です。

**生成されたAPI型定義**: `openapi/openapi.yaml`への変更後は`pnpm api:generate`を実行してください。これにより以下が生成されます：
- `src/types/api.d.ts`にTypeScript型定義
- `src/lib/api-client.ts`で手動実装されたHTTPクライアント（DefaultApiクラス）
- Recipe、Ingredient、Instruction等の型安全なインターフェース

**現在のAPIエンドポイント**:
- `GET /recipes` - レシピ一覧を取得（テキスト検索、タグフィルター、カテゴリフィルター対応）
- `GET /recipes/{id}` - IDで特定のレシピを取得
- `GET /categories` - カテゴリ一覧を取得
- `POST /vibe-recipe` - バイブレシピを作成（音声入力から対話的にレシピを生成）

**主要機能**:
- **バイブレシピ機能**: `/candidates`ページで音声入力から対話的にレシピ候補を生成・選択する機能を提供
- **調理モード**: `/cooking/{id}`ページでカルーセル形式の調理手順表示とオーディオガイド機能
- **レシピ検索・表示**: カテゴリ別フィルター、テキスト検索、タグフィルターに対応したレシピ管理機能
- **PWA機能**: オフライン対応、ホーム画面への追加、アプリライクな体験

### クライアントサイドアーキテクチャ

**レイヤードアーキテクチャ**

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
- **技術**: React Components, Next.js Pages, shadcn/ui, Tailwind CSS
- **場所**: `src/app/`, `src/components/`
- **特徴**: プレゼンテーション専用、ビジネスロジックは含まない

#### 2. Presenter Layer（プレゼンターレイヤー）
- **責務**: UIの状態管理、イベントハンドリング、サービス層との橋渡し
- **技術**: React Hooks, Custom Hooks
- **場所**: `src/client/presenters/`
- **特徴**: UIとビジネスロジックの分離、テスタブルな状態管理

#### 3. Service Layer（サービスレイヤー）
- **責務**: ビジネスロジック、データ変換、複数リポジトリの組み合わせ
- **場所**: `src/client/services/`
- **特徴**: ドメイン固有のロジック、トランザクション管理

#### 4. Repository Layer（リポジトリレイヤー）
- **責務**: データアクセスの抽象化、APIクライアントの管理
- **場所**: `src/client/repositories/`
- **特徴**: データソースの詳細を隠蔽、型安全なデータアクセス

#### 5. DI Container（依存性注入コンテナ）
- **責務**: 各レイヤー間の依存関係管理、インスタンス生成
- **場所**: `src/client/di/`
- **特徴**: 疎結合、テスタビリティの向上

### サーバサイドアーキテクチャ

**レイヤードアーキテクチャ**

サーバーサイドもクライアントサイドと一貫した5層構造を採用し、**Prisma ORM**と**PostgreSQL**を使用します：

```
API Routes Layer (Next.js App Router)
    ↓
Controller Layer  
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database Layer (Prisma + PostgreSQL)
```

#### 1. API Routes Layer（APIルートレイヤー）
- **責務**: HTTPリクエストのルーティング、基本的な認証・認可
- **技術**: Next.js App Router
- **場所**: `src/app/api/` (既存)
- **特徴**: 薄いレイヤー、Controllerへの移譲のみ

#### 2. Controller Layer（コントローラーレイヤー）
- **責務**: リクエスト・レスポンスの変換、バリデーション、エラーハンドリング
- **場所**: `src/server/controllers/`
- **特徴**: HTTPプロトコルに依存、OpenAPI仕様との整合性確保

#### 3. Service Layer（サービスレイヤー）
- **責務**: ビジネスロジック、トランザクション管理、複数リポジトリの協調
- **場所**: `src/server/services/`
- **特徴**: ドメイン中心の設計、HTTPに非依存

#### 4. Repository Layer（リポジトリレイヤー）
- **責務**: データアクセスの抽象化、Prismaクライアントの管理
- **場所**: `src/server/repositories/`
- **特徴**: データソースの詳細を隠蔽、型安全なデータアクセス

#### 5. Database Layer（データベースレイヤー）
- **責務**: データ永続化、スキーマ管理
- **技術**: Prisma ORM + PostgreSQL
- **場所**: `prisma/` ディレクトリ

#### 6. DI Container（依存性注入コンテナ）
- **責務**: サーバーサイド各レイヤー間の依存関係管理、インスタンス生成
- **場所**: `src/server/di/`
- **特徴**: 疎結合、テスタビリティの向上

**サーバーサイド推奨ディレクトリ構造**:
```
src/server/
├── controllers/          # コントローラーレイヤー
├── services/            # サービスレイヤー  
├── repositories/        # リポジトリレイヤー
│   ├── interfaces/      # リポジトリインターフェース
│   └── implementations/ # リポジトリ実装
├── di/                 # 依存性注入
├── types/              # サーバー固有の型定義
└── utils/              # ユーティリティ

prisma/                 # Prismaスキーマとマイグレーション
├── schema.prisma
└── migrations/
```

### コアデータモデル

**Recipeスキーマ**: 基本情報（id、title、description）、時間（prepTime、cookTime、servings）、コンテンツ配列（ingredients、instructions）、カテゴリ関連（category、categoryId）、メタデータ（tags、imageUrl、timestamps）を含みます。

**Ingredientスキーマ**: name、amount、unit（すべて必須）と、オプションのnotesで構成されています。

**Instructionスキーマ**: step number、title、description（すべて必須）と、オプションのimageUrl、estimatedTime、audioUrlを持つ順次ステップです。音声クッキング機能に対応するためaudioUrlフィールドが追加されています。

**Categoryスキーマ**: id、name（両方必須）で構成され、複数のレシピを関連付けるカテゴリ情報です。

**VibeRecipeスキーマ**: 複数のレシピを組み合わせたバイブレシピを表すスキーマで、recipeIds配列（含まれるレシピIDの配列）とvibeInstructions（並び替えられた手順の配列）を持ちます。

**VibeInstructionスキーマ**: VibeRecipeの手順を表すスキーマで、instructionId（元のInstructionのID）、step（並び替え後の手順番号）、recipeId（元のInstructionが属するレシピのID）、vibeRecipeId（所属するVibeRecipeのID）を持ちます。

### プロジェクト構造の詳細

- **App Router**: `src/app/`ディレクトリ内の全ページ
- **生成されたコード**: `src/types/api.d.ts`を手動で編集しないでください - 常にOpenAPI仕様から再生成
- **APIクライアント**: `src/lib/api-client.ts`でfetchベースのHTTPクライアントを手動実装
- **API仕様**: "Vibe Cooking API"の日本語ドキュメントを含む`openapi/openapi.yaml`に配置
- **スタイリング**: shadcn/uiコンポーネントシステムとTailwind CSS 4を使用
- **UIコンポーネント**: `src/components/ui/`にshadcn/ui再利用可能コンポーネント

### 開発ワークフロー

1. **API変更**: `openapi/openapi.yaml`を修正 → `pnpm api:generate`を実行 → 仕様と生成された型定義をコミット
2. **APIドキュメントプレビュー**: 開発中にAPIドキュメントを表示するために`pnpm api:preview`を使用
3. **データベーススキーマ変更**: `prisma/schema.prisma`を修正 → `pnpm db:migrate:dev`（開発環境）または`pnpm db:migrate:prod`（本番環境）を実行 → マイグレーションファイルをコミット
4. **フォント最適化**: プロジェクトは自動最適化のために`next/font`経由でGeistフォントを使用

### Cloud SQL接続設定

**データベース接続**: プロジェクトは環境に応じて異なるデータベース接続方式をサポートします：

1. **ローカル開発**: 従来のURL接続文字列を使用（`MAIN_DATABASE_URL`および`SHADOW_DATABASE_URL`環境変数）
2. **Cloud Run本番環境**: Unix Socket + IAM認証を使用

**Cloud SQL IAM認証設定**:
- `src/lib/database.ts`でデータベース接続を管理
- 環境変数を通じて接続設定を動的に切り替え
- Unix Socketパス: `/cloudsql/<PROJECT_ID>:<REGION>:<INSTANCE_NAME>`
- IAM認証用ユーザー名: サービスアカウントメールアドレス

**必要な環境変数** (`.env.development.example`/`.env.production.example`参照):
- `MAIN_DATABASE_URL`: メインデータベース接続URL
- `SHADOW_DATABASE_URL`: シャドウデータベース接続URL（マイグレーション用）
- `GOOGLE_CLOUD_PROJECT`: GCPプロジェクトID
- `GOOGLE_APPLICATION_CREDENTIALS`: サービスアカウントキーファイルのパス

**Firebase関連環境変数**:
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API Key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase認証ドメイン
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: FirebaseプロジェクトID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase App ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Google Analytics測定ID
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: reCAPTCHA Site Key

**Cloud Runデプロイ要件**:
- Cloud SQL接続設定が必要（`--set-cloudsql-instances`フラグ）
- サービスアカウントにCloud SQL Client権限が必要
- Dockerfileでstandalone出力モードを使用

### UIコンポーネントシステム

**shadcn/ui設定**: プロジェクトはモダンなUIコンポーネントライブラリshadcn/uiを使用します：

**設定ファイル**:
- `components.json`: shadcn/ui設定（New Yorkスタイル、TypeScript、Tailwind CSS変数使用）
- `tailwind.config.ts`: shadcn/ui用のTailwind CSS設定
- `src/lib/utils.ts`: クラス名結合用ユーティリティ（`cn`関数）

**利用可能なUIコンポーネント**:
- `Button`: 複数バリアント対応ボタン（default, destructive, outline, secondary, ghost, link）
- `Card`: カードコンポーネント（Header, Title, Description, Content, Footer）
- `Input`: 入力フィールドコンポーネント
- `Carousel`: 画像カルーセルコンポーネント（embla-carousel-reactベース）
- `Progress`: プログレスバーコンポーネント
- `Sonner`: トースト通知コンポーネント

**ビジネスコンポーネント**:
- `RecipeCard`: レシピカード表示コンポーネント
- `RecipeCardList`: レシピカード一覧表示コンポーネント
- `RecipeDetailHeader`: レシピ詳細ヘッダーコンポーネント
- `CookingInstructionCard`: 調理手順カードコンポーネント
- `InstructionProgress`: 調理進捗表示コンポーネント
- `Ingredients`: 材料リスト表示コンポーネント
- `IngredientsItem`: 材料アイテムコンポーネント
- `Instructions`: 手順リスト表示コンポーネント
- `InstructionsItem`: 手順アイテムコンポーネント
- `StepBadge`: ステップ番号バッジコンポーネント
- `TimeCard`: 時間表示カードコンポーネント
- `SelectCount`: 数量選択コンポーネント

**ツールコンポーネント**:
- `Loading`: ローディング表示コンポーネント
- `NoContent`: コンテンツなし表示コンポーネント

**依存関係**:
- `class-variance-authority`: バリアント管理
- `clsx`: 条件付きクラス名管理
- `tailwind-merge`: TailwindCSSクラスのマージ
- `lucide-react`: アイコンライブラリ
- `@radix-ui/react-slot`: プリミティブコンポーネント
- `@radix-ui/react-progress`: プログレスバーコンポーネント
- `embla-carousel-react`: カルーセルライブラリ
- `sonner`: トースト通知ライブラリ
- `next-themes`: テーマ管理ライブラリ
- `tw-animate-css`: TailwindCSS用アニメーションユーティリティ

### PWA設定

**Progressive Web App対応**: プロジェクトはPWA機能を提供し、ユーザーがアプリのようにWebサイトを使用できます：

**設定ファイル**:
- `src/app/manifest.ts`: PWAマニフェストファイル（アプリ名、アイコン、表示モード等を定義）
- `src/app/service-worker-registration.tsx`: Service Worker登録コンポーネント
- `public/sw.js`: Service Workerファイル（キャッシュ戦略、オフライン対応等）
- `public/icon-192x192.png`, `public/icon-512x512.png`: PWAアイコン

**PWA機能**:
- **インストール可能**: ホーム画面への追加が可能
- **オフライン対応**: Service Workerによるキャッシュとオフライン機能
- **アプリライクな体験**: スタンドアローンモードでの表示
- **レスポンシブデザイン**: モバイルファーストのデザイン

**PWAマニフェスト設定**:
- アプリ名: "Vibe Cooking"
- 表示モード: standalone
- 背景色: #ffffff
- テーマカラー: #000000
- アイコン: 192x192、512x512のPNGファイル

### Storybook設定

**コンポーネント開発環境**: Storybookを使用してUIコンポーネントの開発・テスト・ドキュメント化を行います：

**設定ファイル**:
- `.storybook/main.ts`: Storybook設定（Next.jsフレームワーク、addon設定）
- `.storybook/preview.ts`: プレビュー設定（グローバルCSS、パラメーター設定）

**Storybook設定**:
- フレームワーク: `@storybook/nextjs`
- ストーリーファイル: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- アドオン: `@storybook/addon-docs`, `@storybook/addon-onboarding`
- 静的ファイル: `public/`ディレクトリ

**利用可能なストーリー**:
- 全UIコンポーネント（Button、Card、Input、Carousel、Progress、Sonner）
- 全ビジネスコンポーネント（Recipe関連、Instruction関連、時間関連コンポーネント）
- ツールコンポーネント（Loading、NoContent）

### Firebase設定

**Firebase初期化**: プロジェクトはFirebase App Checkを含むFirebase SDKを統合します：

**設定ファイル**:
- `src/lib/firebase.ts`: Firebase初期化とApp Check設定
- `src/app/firebase-init.tsx`: クライアントサイドFirebase初期化コンポーネント

**App Check設定**:
- reCAPTCHA v3 Providerを使用
- クライアントサイドでのみ初期化
- 自動トークンリフレッシュ有効

**Firebase環境変数の設定** (上記のFirebase関連環境変数セクションを参照)

### Firebase AppCheck セキュリティ

**AppCheck 設定**: プロジェクトはFirebase AppCheckを使用してAPIエンドポイントを保護します：

**サーバーサイド設定**:
- `src/lib/firebase-admin.ts`: Firebase Admin SDK初期化とAppCheckトークン検証
- `src/lib/middleware/app-check.ts`: AppCheck検証ミドルウェア
- 開発環境ではデバッグトークン対応、本番環境では厳密な検証

**AppCheck 検証ミドルウェア**:
- `withAppCheck()`: HOF（高階関数）でAPIハンドラーをラップ
- Authorizationヘッダーから`Bearer`トークンを取得
- Firebase Admin SDKでトークンを検証
- 検証失敗時は適切なHTTPステータスコードを返却

**必要な環境変数**:

**本番環境**:
- `GOOGLE_APPLICATION_CREDENTIALS`: サービスアカウントキーファイルのパス（例: `/path/to/service-account-key.json`）

**開発環境（オプション）**:
- `FIREBASE_DEBUG_TOKENS`: デバッグトークンのカンマ区切りリスト（例: `debug-token-1,debug-token-2`）
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: FirebaseプロジェクトID（デバッグ時のフォールバック用）

**開発環境の動作**:
- デバッグトークンが設定されている場合、そのトークンでの検証をスキップ
- `GOOGLE_APPLICATION_CREDENTIALS`未設定の場合、全てのトークンを有効とする
- 実際のFirebase AppCheck検証も可能（`GOOGLE_APPLICATION_CREDENTIALS`設定時）

**サービスアカウント設定**:
- Firebase ConsoleでサービスアカウントキーファイルをJSONでダウンロード
- Cloud Runにファイルをマウントして`GOOGLE_APPLICATION_CREDENTIALS`にパスを設定
- または、環境変数でJSONコンテンツを直接設定する方法も可能

### 重要な注意事項

- **パッケージマネージャー**: pnpm 10.x を使用（npm/yarnではない）
- **Node.js**: バージョン 22.x を使用
- **開発サーバー**: 高速ビルドのために**Turbopack**を含む（`pnpm dev`）
- **APIサーバー**: `http://localhost:3000/api`で動作（Next.js APIルート）
- **型定義生成**: `openapi-typescript`を使用（軽量で高速）
- **生成されたファイル**: `src/types/api.d.ts`はコミット対象（手動編集禁止）
- **AI統合**: Gemini API (`@google/genai`) を使用したバイブレシピ生成機能
- **データベース**: PostgreSQL + Prisma ORM + Google Cloud SQL Connector
- **認証**: Firebase Admin SDK + App Check による API保護
- **PWA**: Service Worker による オフライン対応とキャッシュ機能
- **テスト**: Jest + Testing Library による単体テスト
- **コンポーネント開発**: Storybook による UI コンポーネント管理

## 主要な依存関係

### フロントエンド
- **React**: 19.1.0 - UIライブラリ
- **Next.js**: 15.3.3 - React フレームワーク
- **TypeScript**: 5.8.3 - 型安全性
- **Tailwind CSS**: 4.1.8 - スタイリング
- **shadcn/ui**: コンポーネントライブラリ

### UI/UX
- **lucide-react**: 0.514.0 - アイコンライブラリ
- **embla-carousel-react**: 8.6.0 - カルーセルコンポーネント
- **sonner**: 2.0.5 - トースト通知
- **next-themes**: 0.4.6 - テーマ管理

### データベース・API
- **Prisma**: 6.9.0 - ORM
- **@prisma/client**: 6.9.0 - Prismaクライアント
- **@google-cloud/cloud-sql-connector**: 1.8.1 - Cloud SQL接続
- **openapi-fetch**: 0.14.0 - API クライアント

### AI・認証
- **@google/genai**: 1.5.1 - Gemini API
- **firebase**: 11.9.1 - Firebase SDK
- **firebase-admin**: 13.4.0 - Firebase Admin SDK
- **@firebase/app-check**: 0.10.0 - App Check

### 開発・テスト
- **Jest**: 30.0.0 - テストフレームワーク
- **@testing-library/react**: 16.3.0 - React テストユーティリティ
- **Storybook**: 9.0.8 - コンポーネント開発環境
- **ESLint**: 9.28.0 - コード品質チェック
- **Prettier**: 3.5.3 - コードフォーマット

### ツール
- **openapi-typescript**: 7.8.0 - OpenAPI型定義生成
- **@redocly/cli**: 1.34.3 - API ドキュメント生成
- **dotenv-cli**: 8.0.0 - 環境変数管理
