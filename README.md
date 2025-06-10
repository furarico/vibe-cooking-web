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

```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# コード品質チェック
pnpm lint

# APIクライアント生成（OpenAPIスキーマから）
pnpm run api:generate

# APIドキュメントプレビュー
pnpm run preview:api
```

## 🏗️ プロジェクト構造

```
vibe-cooking-web/
├── src/
│   ├── app/                    # Next.js App Router（ページとレイアウト）
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   └── globals.css        # グローバルスタイル
│   └── lib/
│       └── api/               # 自動生成されたAPIクライアント
├── openapi/
│   ├── openapi.yaml           # OpenAPI仕様書
│   └── config.yaml            # コード生成設定
├── public/                     # 静的ファイル
└── 設定ファイル群
```

## 🔧 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **パッケージマネージャー**: pnpm
- **API仕様**: OpenAPI 3.0.3
- **フォント**: Geist (Vercel)

## 📋 API開発ワークフロー

このプロジェクトは **API ファースト開発** を採用しています。

### 1. API仕様の編集
`openapi/openapi.yaml` を編集してAPIエンドポイントを定義

### 2. クライアントコード生成
```bash
pnpm run api:generate
```
TypeScript型定義とAPIクライアントが `src/lib/api/` に自動生成されます

### 3. APIドキュメント確認
```bash
pnpm run preview:api
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

### コード品質
- ESLint with Next.js設定
- 自動フォーマット対応
- Turbopackで高速開発

## 🚨 重要な注意点

- **生成されたコードを手動編集しない**: `src/lib/api/` 内のファイルは `pnpm run api:generate` で再生成されます
- **pnpmを使用**: このプロジェクトはpnpmに最適化されています
- **API変更時**: OpenAPI仕様変更後は必ずクライアントコードを再生成してください

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
