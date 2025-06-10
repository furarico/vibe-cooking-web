# Vibe Cooking Web

[![CI](https://github.com/kantacky/vibe-cooking-web/actions/workflows/ci.yml/badge.svg)](https://github.com/kantacky/vibe-cooking-web/actions/workflows/ci.yml)

レシピ共有とクッキングコミュニティのためのWebアプリケーション

## 🚀 クイックスタート

### 必要な環境
- **Node.js** 18以上
- **pnpm** （推奨パッケージマネージャー）

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

3. **開発サーバーを起動**
   ```bash
   pnpm dev
   ```

4. **ブラウザでアクセス**
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

### API関連コマンド
```bash
# APIクライアント生成（OpenAPI仕様からTypeScript型定義を再生成）
pnpm api:generate

# APIドキュメントプレビュー（ブラウザでRedoclyドキュメントを開く）
pnpm api:preview
```

### データベース関連コマンド
```bash
# Prismaマイグレーション生成・適用
pnpm db:migrate

# Prismaクライアント生成
pnpm db:generate

# データベースシード（初期データ投入）
pnpm db:seed

# Prisma Studio（データベースGUI管理ツール起動）
pnpm db:studio

# データベース完全リセット
pnpm db:reset
```

## 🏗️ アーキテクチャ概要

このプロジェクトは**Next.js 15 App Router**をベースとした**APIファースト開発**アプローチで、クライアントサイドとサーバーサイドの両方で**レイヤードアーキテクチャ**を採用しています。

### クライアントサイドアーキテクチャ

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

### サーバーサイドアーキテクチャ

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

### プロジェクト構造

```
vibe-cooking-web/
├── src/
│   ├── app/                    # Next.js App Router（UI Layer）
│   │   ├── api/                # API Routes
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   └── globals.css        # グローバルスタイル
│   ├── client/                 # クライアントサイドレイヤー
│   │   ├── di/                # 依存性注入コンテナ
│   │   ├── presenters/        # Presenter Layer
│   │   ├── repositories/      # Repository Layer
│   │   └── services/          # Service Layer
│   ├── server/                 # サーバーサイドレイヤー
│   │   ├── di/                # 依存性注入コンテナ
│   │   ├── repositories/      # Repository Layer
│   │   └── services/          # Service Layer
│   ├── lib/                    # 共通ライブラリ
│   │   ├── api-client.ts      # 手動実装HTTPクライアント
│   │   └── database.ts        # データベース接続管理
│   └── types/                  # 型定義
│       └── api.d.ts           # 自動生成されたAPI型定義
├── openapi/
│   └── openapi.yaml           # OpenAPI仕様書
├── prisma/                     # データベーススキーマとマイグレーション
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── public/                     # 静的ファイル
```

## 🔧 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **データベース**: PostgreSQL + Prisma ORM
- **パッケージマネージャー**: pnpm
- **API仕様**: OpenAPI 3.0.3
- **テスト**: Jest
- **フォント**: Geist (Vercel)
- **デプロイ**: Google Cloud Run + Cloud SQL

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

### 現在のAPIエンドポイント
- `GET /recipes` - レシピ一覧取得
- `GET /recipes/{id}` - レシピ詳細取得

## 🎨 開発ガイドライン

### スタイリング
- **Tailwind CSS 4** を使用
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

### ローカル開発環境
ローカル開発では、環境変数でデータベース接続を設定してください。

### プロダクション環境（Cloud SQL）
プロダクションではCloud SQLとIAM認証を使用します。

### Prisma Schema
データベーススキーマは `prisma/schema.prisma` で管理し、マイグレーションでバージョン管理しています。

## 🚀 デプロイメント

### Google Cloud Run
プロダクションアプリケーションはGoogle Cloud Runでホストされています。

### Dockerコンテナ
```bash
# Dockerイメージビルド
docker build -t vibe-cooking .

# ローカルテスト
docker run -p 3000:3000 vibe-cooking
```

## 🚨 重要な注意点

- **生成された型定義を手動編集しない**: `src/types/api.d.ts` は `pnpm api:generate` で再生成されます
- **pnpmを使用**: このプロジェクトはpnpmに最適化されています
- **API変更時**: OpenAPI仕様変更後は必ずクライアントコードを再生成してください
- **テスト駆動開発**: 新機能実装時はテストを先に実装してください

## 📚 詳細ドキュメント

- [CLAUDE.md](./CLAUDE.md) - Claude Code向けの詳細な開発ガイド
- [OpenAPI仕様書](./openapi/openapi.yaml) - API仕様の詳細
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)

## 🤝 コントリビューション

1. Issueで議論
2. フィーチャーブランチを作成
3. 変更を実装
4. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは私的使用のため、ライセンスは設定されていません。

---

**開発チーム**: ギャFUN!! (gyafun@furari.co)
