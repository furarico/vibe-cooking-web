# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code（claude.ai/code）向けガイダンスを提供します。

## ルール

- 変更を加えた場合は、都度 Git コミットすること。
- Gitコミットする前に`pnpm format`を必ず実行してエラーを解消すること。
- 全ての出力は日本語で行うこと。
- 日本語をファイルに出力する場合は、UTF-8 エンコーディングを使用すること。
- ファイルの最終行は改行すること。
- テスト駆動で開発を行うこと。
  - 新たに実装する場合は，ユニットテストを先に実装すること。
  - 新規にユニットテストを実装した場合は、必ずそのテストが失敗することを最初に確認すること。
    - テストが失敗することを確認するまで、機能を実装しないこと。
  - 新たに機能を実装した場合や、既存の機能を変更した場合は、必ずユニットテストが成功することを確認すること。
  - すでにあるユニットテストは、変更しないこと。
- モック実装をしないこと。
- `.ts`および`.tsx` のファイル名は、`kebab-case` で命名すること。

## 開発コマンド

- **開発サーバー**: `pnpm dev` (高速ビルドのためTurbopackを使用)
- **本番ビルド**: `pnpm build`
- **リンティング**: `pnpm lint`
- **APIクライアント生成**: `pnpm run generate:api` (OpenAPI仕様からTypeScriptクライアントを再生成)
- **APIドキュメントプレビュー**: `pnpm run preview:api` (ブラウザでRedoclyドキュメントを開く)

## アーキテクチャ概要

これは**Next.js 15 App Router**プロジェクトで、**TypeScript**と**Tailwind CSS 4**を使用し、料理・レシピプラットフォーム向けの**APIファースト開発**アプローチで設計されています。

### 主要なアーキテクチャパターン

**APIファースト開発**: プロジェクトはOpenAPI仕様（`openapi/openapi.yaml`）を使用して型安全なTypeScriptクライアントコードを生成します。API仕様はフロントエンドとバックエンド間のデータ契約の信頼できる情報源です。

**生成されたAPIクライアント**: `openapi/openapi.yaml`への変更後は`pnpm run generate:api`を実行してください。これにより`/src/lib/api/`ディレクトリ全体が以下で再生成されます：
- `apis/DefaultApi.ts`の型安全なAPI関数
- `models/`ディレクトリのTypeScriptインターフェース
- HTTPリクエスト用のランタイムユーティリティ

**現在のAPIエンドポイント**:
- `GET /recipes` - 全レシピを取得（フィルタリング・ページネーションなし）
- `GET /recipes/{id}` - IDで特定のレシピを取得

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

### サーバサイドアーキテクチャ


### コアデータモデル

**Recipeスキーマ**: 基本情報（id、title、description）、時間（prepTime、cookTime、servings）、コンテンツ配列（ingredients、instructions）、メタデータ（tags、imageUrl、timestamps）を含みます。

**Ingredientスキーマ**: name、amount、unit（すべて必須）と、オプションのnotesで構成されています。

**Instructionスキーマ**: step number、description（両方必須）と、オプションのimageUrlとestimatedTimeを持つ順次ステップです。

### プロジェクト構造の詳細

- **App Router**: `src/app/`ディレクトリ内の全ページ
- **生成されたコード**: `src/lib/api/`を手動で編集しないでください - 常にOpenAPI仕様から再生成
- **API仕様**: "Vibe Cooking API"の日本語ドキュメントを含む`openapi/openapi.yaml`に配置
- **スタイリング**: テーマ用のCSSカスタムプロパティでTailwind CSS 4を使用

### 開発ワークフロー

1. **API変更**: `openapi/openapi.yaml`を修正 → `pnpm run generate:api`を実行 → 仕様と生成されたコード両方をコミット
2. **APIドキュメントプレビュー**: 開発中にAPIドキュメントを表示するために`pnpm run preview:api`を使用
3. **フォント最適化**: プロジェクトは自動最適化のために`next/font`経由でGeistフォントを使用

### 重要な注意事項

- プロジェクトはパッケージマネージャーとして**pnpm**を使用（npm/yarnではない）
- 開発サーバーは高速ビルドのために**Turbopack**を含む
- APIサーバーは`http://localhost:3000/api`で動作（Next.js APIルート）
- 生成された全てのTypeScript型は**文字列enum**と**ES6+機能**を使用
- `.gitignore`は`openapi/openapitools.json`と`src/lib/api`を除外（生成された更新をコミットする場合を除く）
