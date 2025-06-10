# Node.js 20 LTSを使用
FROM node:20-slim AS base

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

# Prismaクライアント生成
RUN pnpm db:generate
# Next.jsビルド
RUN pnpm build

# 本番ステージ
FROM base AS runner
WORKDIR /app

# 本番用環境変数
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# nextユーザー作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なファイルをコピー
COPY --from=builder /app/public ./public

# Next.jsの出力ファイルをコピー
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prismaクライアントをコピー
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# nextjsユーザーに切り替え
USER nextjs

# ポート公開
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# アプリケーション起動
CMD ["node", "server.js"]