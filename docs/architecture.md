# Vibe Cooking Web - クライアントアーキテクチャ

## プロジェクト概要

Vibe Cooking Webは、料理・レシピプラットフォーム向けの**API-First開発**を採用したNext.js 15 App Routerプロジェクトです。

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

### API-First開発

OpenAPI仕様書（`openapi/openapi.yaml`）を**真実の情報源**として、型安全なTypeScriptクライアントコードを自動生成します。

```
openapi/openapi.yaml → `pnpm run generate:api` → src/lib/api/
```

#### 生成されるファイル構造
```
src/lib/api/
├── apis/
│   └── DefaultApi.ts          # 型安全なAPI関数
├── models/                    # TypeScriptインターフェース
│   ├── Recipe.ts
│   ├── Ingredient.ts
│   └── Instruction.ts
└── runtime/                   # HTTP リクエストユーティリティ
```

### データモデル

#### Recipeスキーマ
- **基本情報**: id, title, description
- **調理情報**: prepTime, cookTime, servings
- **コンテンツ**: ingredients[], instructions[]
- **メタデータ**: tags[], imageUrl, createdAt, updatedAt

#### Ingredientスキーマ
- **必須フィールド**: name, amount, unit
- **オプション**: notes

#### Instructionスキーマ
- **必須フィールド**: step, description
- **オプション**: imageUrl, estimatedTime

### 現在のAPIエンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/recipes` | レシピ一覧取得 |
| GET | `/recipes/{id}` | レシピ詳細取得 |

## プロジェクト構造

```
vibe-cooking-web/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   └── globals.css        # グローバルスタイル
│   └── lib/
│       └── api/               # 自動生成されたAPIクライアント
├── openapi/
│   └── openapi.yaml           # API仕様書（日本語ドキュメント）
├── public/                    # 静的アセット
├── docs/                      # プロジェクトドキュメント
└── CLAUDE.md                  # Claude Code用プロジェクト指示
```

## 開発ワークフロー

### 1. API変更
```bash
# 1. openapi/openapi.yaml を編集
# 2. APIクライアント再生成
pnpm run generate:api

# 3. 仕様書とコードの両方をコミット
git add openapi/openapi.yaml src/lib/api/
git commit -m "Update API specification and generated client"
```

### 2. 開発サーバー起動
```bash
pnpm dev  # Turbopack使用で高速ビルド
```

### 3. API ドキュメント確認
```bash
pnpm run preview:api  # ブラウザでRedoclyドキュメント表示
```

### 4. コード品質チェック
```bash
pnpm lint      # ESLint実行
pnpm build     # プロダクションビルド
```

## 重要な開発ルール

### 生成コードの取り扱い
- **`src/lib/api/`ディレクトリは手動編集禁止**
- API変更時は必ず`pnpm run generate:api`で再生成
- OpenAPI仕様書の変更とコード生成はセットで実行

### スタイリング
- **Tailwind CSS 4**使用
- CSSカスタムプロパティでテーマ管理
- ダークモード対応

### パッケージ管理
- **pnpm**使用（npm/yarn不使用）
- 依存関係は`package.json`で厳密管理

## API サーバー設定

- **開発環境**: `http://localhost:3000/api`
- **Next.js API Routes**でサーバーサイド実装
- OpenAPI仕様書に従った型安全な実装

## TypeScript設定

- **String Enums**使用
- **ES6+機能**有効
- **型安全性**を最優先
- インターフェースとAPIの分離管理