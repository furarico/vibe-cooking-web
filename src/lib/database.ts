import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Cloud SQL Unix Socket + IAM認証用のデータベースURL生成
 */
function generateCloudSqlUrl(): string {
  const projectId = process.env.CLOUD_SQL_PROJECT_ID;
  const region = process.env.CLOUD_SQL_REGION;
  const instanceName = process.env.CLOUD_SQL_INSTANCE_NAME;
  const databaseName = process.env.CLOUD_SQL_DATABASE_NAME;
  const iamUser = process.env.CLOUD_SQL_IAM_USER;

  if (!projectId || !region || !instanceName || !databaseName || !iamUser) {
    throw new Error('Cloud SQL環境変数が不足しています。');
  }

  // Unix Socketを使用した接続文字列
  // Cloud Run内では /cloudsql/<project-id>:<region>:<instance-name> のパスでUnix Socketにアクセス可能
  const socketPath = `/cloudsql/${projectId}:${region}:${instanceName}`;

  return `postgresql://${encodeURIComponent(iamUser)}@localhost/${databaseName}?host=${socketPath}&sslmode=disable`;
}

/**
 * 環境に応じたデータベースURL取得
 */
function getDatabaseUrl(): string {
  // 明示的にDATABASE_URLが設定されている場合はそれを使用（ローカル開発等）
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Cloud Run環境の場合はUnix Socket + IAM認証を使用
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.CLOUD_SQL_PROJECT_ID
  ) {
    return generateCloudSqlUrl();
  }

  throw new Error('DATABASE_URLまたはCloud SQL環境変数を設定してください。');
}

/**
 * Prismaクライアントの初期化（遅延初期化）
 */
function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: getDatabaseUrl(),
        },
      },
    });
  } catch {
    return new PrismaClient();
  }
}

/**
 * Prismaクライアントのインスタンス取得
 */
export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
