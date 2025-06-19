# Vibe Cooking Web

[![CI](https://github.com/kantacky/vibe-cooking-web/actions/workflows/ci.yml/badge.svg)](https://github.com/kantacky/vibe-cooking-web/actions/workflows/ci.yml)

音声ガイド機能付きの革新的な料理体験を提供するWebアプリケーション

## 🚀 クイックスタート

### 必要な環境
- **Node.js** 22.x
- **pnpm** 10.x （推奨パッケージマネージャー）

### セットアップ

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/kantacky/vibe-cooking-web.git
   cd vibe-cooking-web
   ```

2. **依存関係をインストール**
   ```bash
   pnpm install
   ```

3. **環境設定**
   - `.env.development.example` を参考に `.env.development` を作成
   - 必要なFirebase、データベース、API設定を記入

4. **開発サーバーを起動**
   ```bash
   pnpm dev
   ```

5. **ブラウザでアクセス**
   [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認

## 🛠️ 開発コマンド

### 基本コマンド
```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# リンティング
pnpm lint

# フォーマット（リンティング修正とPrettierフォーマット）
pnpm format

# テスト実行
pnpm test

# テスト監視
pnpm test:watch

# テストカバレッジ
pnpm test:coverage
```

### Storybook関連コマンド
```bash
# Storybook開発サーバー起動
pnpm storybook

# Storybookビルド
pnpm build-storybook
```

### API関連コマンド
```bash
# APIクライアント生成（OpenAPI仕様からTypeScript型定義を再生成）
pnpm api:generate

# APIドキュメントプレビュー（ブラウザでRedoclyドキュメントを開く）
pnpm api:preview
```

### データベース関連コマンド
```bash
# Prismaクライアント生成
pnpm db:generate

# Prismaマイグレーション（開発環境）
pnpm db:migrate:dev

# Prismaマイグレーション（本番環境）
pnpm db:migrate:prod

# Prisma Studio（開発環境）
pnpm db:studio:dev

# Prisma Studio（本番環境）
pnpm db:studio:prod

# データベース完全リセット（開発環境）
pnpm db:reset:dev

# データベース完全リセット（本番環境）
pnpm db:reset:prod
```

### Cloud Runデプロイ関連
```bash
# Dockerビルド
docker build -t vibe-cooking .

# ローカルテスト
docker run -p 3000:3000 vibe-cooking

# Google Cloud Runデプロイ
pnpm deploy:gcr
```

## 🏗️ アーキテクチャ概要

このプロジェクトは**Next.js 15.3.3 App Router**をベースとした**APIファースト開発**アプローチで、クライアントサイドとサーバーサイドの両方で**レイヤードアーキテクチャ**を採用しています。**PWA（Progressive Web App）**対応もされており、オフライン機能やホーム画面への追加が可能です。

### 主要なアーキテクチャパターン

**APIファースト開発**: プロジェクトはOpenAPI仕様（`openapi/openapi.yaml`）を使用して型安全なTypeScriptクライアントコードを生成します。API仕様はフロントエンドとバックエンド間のデータ契約の信頼できる情報源です。

**現在のAPIエンドポイント**:
- `GET /recipes` - レシピ一覧を取得（テキスト検索、タグフィルター、カテゴリフィルター対応）
- `GET /recipes/{id}` - IDで特定のレシピを取得
- `GET /categories` - カテゴリ一覧を取得
- `POST /vibe-recipe` - バイブレシピを作成（音声入力から対話的にレシピを生成）

### クライアントサイドアーキテクチャ

**レイヤードアーキテクチャ**

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

#### 各レイヤーの責務
1. **UI Layer**: React Components, Next.js Pages, shadcn/ui, Tailwind CSS
2. **Presenter Layer**: React Hooks, Custom Hooks - UIの状態管理
3. **Service Layer**: ビジネスロジック、データ変換
4. **Repository Layer**: データアクセスの抽象化、APIクライアントの管理
5. **DI Container**: 依存関係管理、インスタンス生成

### サーバーサイドアーキテクチャ

**レイヤードアーキテクチャ**

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

#### 各レイヤーの責務
1. **API Routes Layer**: HTTPリクエストのルーティング、基本的な認証・認可
2. **Controller Layer**: リクエスト・レスポンスの変換、バリデーション
3. **Service Layer**: ビジネスロジック、トランザクション管理
4. **Repository Layer**: データアクセスの抽象化、Prismaクライアントの管理
5. **Database Layer**: データ永続化、スキーマ管理（Prisma ORM + PostgreSQL）
6. **DI Container**: サーバーサイド各レイヤー間の依存関係管理

### プロジェクト構造

```
vibe-cooking-web/
├── src/
│   ├── app/                    # Next.js App Router（UI Layer）
│   │   ├── api/                # API Routes
│   │   ├── recipes/            # レシピ関連ページ
│   │   │   ├── [id]/           # レシピ詳細
│   │   │   └── page.tsx        # レシピ一覧
│   │   ├── cooking/            # 調理モードページ
│   │   │   └── [id]/           # 調理手順表示
│   │   ├── candidates/         # バイブレシピ候補ページ
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   ├── firebase-init.tsx  # Firebase初期化コンポーネント
│   │   ├── manifest.ts        # PWAマニフェスト
│   │   ├── service-worker-registration.tsx # Service Worker登録
│   │   └── globals.css        # グローバルスタイル
│   ├── components/             # UIコンポーネント
│   │   └── ui/                # shadcn/ui再利用可能コンポーネント
│   ├── client/                 # クライアントサイドレイヤー
│   │   ├── di/                # 依存性注入コンテナ
│   │   ├── presenters/        # Presenter Layer
│   │   ├── repositories/      # Repository Layer
│   │   └── services/          # Service Layer
│   ├── server/                 # サーバーサイドレイヤー
│   │   ├── controllers/       # Controller Layer
│   │   ├── di/                # 依存性注入コンテナ
│   │   ├── repositories/      # Repository Layer
│   │   │   ├── interfaces/    # リポジトリインターフェース
│   │   │   └── implementations/ # リポジトリ実装
│   │   ├── services/          # Service Layer
│   │   ├── types/             # サーバー固有の型定義
│   │   └── utils/             # ユーティリティ
│   ├── lib/                    # 共通ライブラリ
│   │   ├── api-client.ts      # 手動実装HTTPクライアント
│   │   ├── database.ts        # データベース接続管理
│   │   ├── firebase.ts        # Firebase設定
│   │   ├── firebase-admin.ts  # Firebase Admin SDK
│   │   ├── middleware/        # ミドルウェア
│   │   │   └── app-check.ts   # App Check検証
│   │   └── utils.ts           # shadcn/ui用ユーティリティ
│   └── types/                  # 型定義
│       └── api.d.ts           # 自動生成されたAPI型定義
├── openapi/
│   └── openapi.yaml           # OpenAPI仕様書
├── prisma/                     # データベーススキーマとマイグレーション
│   ├── schema.prisma
│   └── migrations/
├── components.json             # shadcn/ui設定
├── tailwind.config.ts         # Tailwind CSS設定
├── jest.config.js             # Jest設定
├── .storybook/                # Storybook設定
│   ├── main.ts               # Storybook設定
│   └── preview.ts            # プレビュー設定
├── public/                     # 静的ファイル
│   ├── sw.js                 # Service Worker
│   ├── icon-192x192.png      # PWAアイコン
│   └── icon-512x512.png      # PWAアイコン
├── .env.development.example    # 開発環境設定例
├── .env.production.example     # 本番環境設定例
└── CLAUDE.md                  # Claude Code向けガイド
```

## 🔧 技術スタック

### フロントエンド
- **React**: 19.1.0 - UIライブラリ
- **Next.js**: 15.3.3 - React フレームワーク (App Router)
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
- **PostgreSQL**: データベース

### AI・認証
- **@google/genai**: 1.5.1 - Gemini API
- **firebase**: 11.9.1 - Firebase SDK
- **firebase-admin**: 13.4.0 - Firebase Admin SDK
- **@firebase/app-check**: 0.10.0 - App Check (reCAPTCHA v3)

### 開発・テスト
- **Jest**: 30.0.0 - テストフレームワーク
- **@testing-library/react**: 16.3.0 - React テストユーティリティ
- **Storybook**: 9.0.8 - コンポーネント開発環境
- **ESLint**: 9.28.0 - コード品質チェック
- **Prettier**: 3.5.3 - コードフォーマット

### ツール・その他
- **openapi-typescript**: 7.8.0 - OpenAPI型定義生成
- **@redocly/cli**: 1.34.3 - API ドキュメント生成
- **dotenv-cli**: 8.0.0 - 環境変数管理
- **pnpm**: 10.x - パッケージマネージャー
- **Google Cloud Run**: デプロイ
- **PWA**: Service Worker による オフライン対応

## 📋 API開発ワークフロー

このプロジェクトは **API ファースト開発** を採用しています。

### 1. API仕様の編集
`openapi/openapi.yaml` を編集してAPIエンドポイントを定義

### 2. クライアントコード生成
```bash
pnpm api:generate
```
TypeScript型定義が `src/types/api.d.ts` に自動生成されます

### 3. APIドキュメント確認
```bash
pnpm api:preview
```
ブラウザでインタラクティブなAPIドキュメントを表示

### 主要機能

🎵 **バイブレシピ機能** (`/candidates`)
- 音声入力から対話的にレシピ候補を生成・選択
- 複数のレシピを組み合わせた革新的な料理体験
- Gemini APIによるパーソナライズされたレシピ提案
- 音声認識とAIチャットによる自然な対話

🍳 **調理モード** (`/cooking/{id}`)
- カルーセル形式の手順表示とナビゲーション
- 進捗トラッキングとステップ管理
- 各手順の音声ガイド自動再生機能
- オーディオファイル対応（audioUrl）

📚 **レシピ管理**
- カテゴリ別フィルター、テキスト検索、タグ検索
- レスポンシブデザイン対応
- リアルタイムデータ取得
- 材料リスト、手順表示、時間管理

📱 **PWA機能**
- オフライン対応（Service Worker）
- ホーム画面への追加が可能
- アプリライクな体験（スタンドアローンモード）
- プッシュ通知対応

### コアデータモデル

- **Recipe**: レシピの基本情報、準備・調理時間、材料、手順、カテゴリ、タグ
- **Ingredient**: 材料名、分量、単位、備考
- **Instruction**: 手順番号、タイトル、説明、推定時間、画像URL、**音声URL**
- **Category**: カテゴリ名（ご飯、おかず、デザート、汁物など）
- **VibeRecipe**: 音声入力から生成されるレシピ候補、関連レシピIDsと手順配列
- **VibeInstruction**: VibeRecipeの手順、手順ID、バイブレシピの手順番号、レシピID

## 🎨 開発ガイドライン

### スタイリング
- **Tailwind CSS 4** を使用
- **shadcn/ui** コンポーネントライブラリ
- CSS変数でテーマカスタマイズ
- ダークモード自動対応（`prefers-color-scheme`）

### TypeScript
- 厳密な型チェック有効
- パスマッピング: `@/*` → `./src/*`
- 自動生成されたAPI型を活用

### コード品質とテスト
- ESLint with Next.js設定
- Prettier自動フォーマット
- Jestでユニットテスト
- テスト駆動開発（TDD）を推奨
- Turbopackで高速開発

## 💾 データベース設定

### Cloud SQL接続設定

プロジェクトは環境に応じて異なるデータベース接続方式をサポートします：

1. **ローカル開発**: 従来のURL接続文字列を使用
2. **Cloud Run本番環境**: Unix Socket + IAM認証を使用

#### 環境変数設定

**開発環境** (`.env.development.example`を参考に作成):
```bash
# データベース接続
MAIN_DATABASE_URL="postgres://user:pass@host:port/name"
SHADOW_DATABASE_URL="postgres://user:pass@host:port/name_shadow"

# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# 開発環境用デバッグトークン（オプション）
FIREBASE_DEBUG_TOKENS=debug-token-1,debug-token-2
```

**本番環境** (`.env.production.example`を参考に作成):
```bash
# Cloud SQL IAM認証
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Unix Socket接続（本番環境）
MAIN_DATABASE_URL="postgres://service-account@email/database?host=/cloudsql/project:region:instance"
```

### Prisma スキーマ管理

データベーススキーマは `prisma/schema.prisma` で管理し、マイグレーションでバージョン管理しています。

#### スキーマ変更ワークフロー
1. `prisma/schema.prisma` を編集
2. `pnpm db:migrate:dev` （開発環境用マイグレーション作成・適用）
3. `pnpm db:migrate:prod` （本番環境用マイグレーション適用）
4. マイグレーションファイルをコミット

## 🎨 UIコンポーネントシステム

### shadcn/ui設定

プロジェクトは現代的で再利用可能なUIコンポーネントライブラリ **shadcn/ui** を採用しています。

#### 設定詳細
- **スタイル**: New York
- **ベースカラー**: Slate
- **CSS変数**: 使用
- **Tailwind CSS prefix**: なし
- **アイコンライブラリ**: Lucide React
- **TypeScript**: 完全対応

#### 利用可能なUIコンポーネント

**基本コンポーネント**:
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

#### 依存関係
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

### Storybook統合

**コンポーネント開発環境**: Storybookを使用してUIコンポーネントの開発・テスト・ドキュメント化を行います。

**設定**:
- フレームワーク: `@storybook/nextjs`
- ストーリーファイル: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- アドオン: `@storybook/addon-docs`, `@storybook/addon-onboarding`

**利用可能なストーリー**:
- 全UIコンポーネント（Button、Card、Input、Carousel、Progress、Sonner）
- 全ビジネスコンポーネント（Recipe関連、Instruction関連、時間関連コンポーネント）
- ツールコンポーネント（Loading、NoContent）

## 🔐 Firebase統合

### Firebase設定

プロジェクトはFirebase SDKとApp Checkを統合し、セキュリティを強化しています。

#### Firebase初期化
- `src/lib/firebase.ts`: Firebase初期化とApp Check設定
- `src/app/firebase-init.tsx`: クライアントサイドFirebase初期化コンポーネント

#### App Check設定
- **Provider**: reCAPTCHA v3
- **初期化**: クライアントサイドのみ
- **自動トークンリフレッシュ**: 有効
- **開発環境**: デバッグトークン対応
- **本番環境**: 厳密な検証

### Firebase AppCheck セキュリティ

**AppCheck 検証ミドルウェア**:
- `src/lib/firebase-admin.ts`: Firebase Admin SDK初期化とAppCheckトークン検証
- `src/lib/middleware/app-check.ts`: AppCheck検証ミドルウェア
- `withAppCheck()`: HOF（高階関数）でAPIハンドラーをラップ
- Authorizationヘッダーから`Bearer`トークンを取得・検証

**セキュリティレベル**:
- **本番環境**: サービスアカウントキーによる厳密な検証
- **開発環境**: デバッグトークンまたは緩い検証モード

**サービスアカウント設定**:
- Firebase Consoleでサービスアカウントキーファイルをダウンロード
- Cloud Runにファイルをマウントして`GOOGLE_APPLICATION_CREDENTIALS`にパスを設定
- 環境変数でJSONコンテンツを直接設定する方法も可能

## 📱 PWA（Progressive Web App）

### PWA機能

プロジェクトはPWA機能を提供し、ユーザーがアプリのようにWebサイトを使用できます。

**設定ファイル**:
- `src/app/manifest.ts`: PWAマニフェストファイル（アプリ名、アイコン、表示モード等）
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

## 🚀 デプロイメント

### Google Cloud Run

プロダクションアプリケーションはGoogle Cloud Runでホストされています。

**Cloud Runデプロイ要件**:
- Cloud SQL接続設定が必要（`--set-cloudsql-instances`フラグ）
- サービスアカウントにCloud SQL Client権限が必要
- Dockerfileでstandalone出力モードを使用

### Dockerコンテナ

```bash
# Dockerイメージビルド
docker build -t vibe-cooking .

# ローカルテスト
docker run -p 3000:3000 vibe-cooking

# Google Cloud Runデプロイ
pnpm deploy:gcr
```

## 🚨 重要な注意点

- **パッケージマネージャー**: pnpm 10.x を使用（npm/yarnではない）
- **Node.js**: バージョン 22.x を使用
- **開発サーバー**: 高速ビルドのために**Turbopack**を含む（`pnpm dev`）
- **生成された型定義を手動編集しない**: `src/types/api.d.ts` は `pnpm api:generate` で再生成されます
- **API変更ワークフロー**: OpenAPI仕様変更後は必ずクライアントコードを再生成してください
- **テスト駆動開発**: 新機能実装時はテストを先に実装してください
- **shadcn/ui使用**: UIコンポーネントは `src/components/ui/` から使用してください
- **Firebase環境変数**: 本番環境では適切なFirebase設定が必要です
- **TypeScript厳格モード**: `any`型の使用を禁止、具体的な型定義を使用
- **ファイル命名規則**: `.ts`および`.tsx` ファイルは`kebab-case`で命名

## 📋 開発ワークフロー

### API変更ワークフロー
1. `openapi/openapi.yaml` を修正
2. `pnpm api:generate` を実行
3. 仕様と生成された型定義をコミット
4. `pnpm api:preview` でドキュメント確認

### データベース変更ワークフロー
1. `prisma/schema.prisma` を修正
2. `pnpm db:migrate:dev`（開発）または `pnpm db:migrate:prod`（本番）を実行
3. マイグレーションファイルをコミット

### テスト駆動開発ワークフロー
1. ユニットテストを先に実装
2. テストが失敗することを確認
3. 機能を実装
4. テストが成功することを確認

## 📚 詳細ドキュメント

- [CLAUDE.md](./CLAUDE.md) - Claude Code向けの詳細な開発ガイド
- [OpenAPI仕様書](./openapi/openapi.yaml) - API仕様の詳細
- [Next.js公式ドキュメント](https://nextjs.org/docs) - フレームワーク公式ドキュメント
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs) - スタイリング公式ドキュメント
- [shadcn/ui公式ドキュメント](https://ui.shadcn.com) - UIコンポーネント公式ドキュメント
- [Prisma公式ドキュメント](https://www.prisma.io/docs) - ORM公式ドキュメント

## 🤝 コントリビューション

1. Issueで議論
2. フィーチャーブランチを作成
3. 変更を実装（TDD方式）
4. `pnpm format` でコードフォーマット
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは私的使用のため、ライセンスは設定されていません。

---

**開発チーム**: ギャFUN!! (gyafun@furari.co)
