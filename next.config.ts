import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cloud Run用のstandalone出力を有効化
  output: 'standalone',
  // 必要に応じて静的リソースの最適化
  compress: true,
  // 外部画像ホストの許可
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r2.vibe-cooking.app',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'dev.r2.vibe-cooking.app',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
