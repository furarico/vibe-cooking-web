import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cloud Run用のstandalone出力を有効化
  output: 'standalone',
  // 必要に応じて静的リソースの最適化
  compress: true,
};

export default nextConfig;
