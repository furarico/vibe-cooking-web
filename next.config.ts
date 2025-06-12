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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
