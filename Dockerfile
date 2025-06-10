# Node.js 22 LTSを使用
FROM node:22-alpine AS base

# pnpmインストール
RUN npm install -g pnpm

# 作業ディレクトリ設定
WORKDIR /app

# 依存関係インストール用のステージ
FROM base AS deps
# パッケージファイルをコピー
COPY package.json pnpm-lock.yaml ./
# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ビルドステージ
FROM base AS builder
WORKDIR /app
# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
# ソースコードをコピー
COPY . .

# APIコードを生成
RUN pnpm generate:api
# Prismaクライアント生成
RUN pnpm db:generate
# Next.jsビルド
RUN pnpm build

# 本番ステージ
FROM base AS runner
WORKDIR /app

# 必要なファイルをコピー
COPY --from=builder /app/public ./public

# Next.jsの出力ファイルをコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prismaクライアントをコピー
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# アプリケーション起動
CMD ["node", "server.js"]
