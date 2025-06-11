import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vibe Cooking Web',
    short_name: 'VibeCooking',
    description: 'お料理とレシピのWebアプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '256x256',
        type: 'image/x-icon',
      },
    ],
  }
}