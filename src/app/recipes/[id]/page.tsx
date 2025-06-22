import { NoContent } from '@/components/tools/no-content';
import { createApiClient } from '@/lib/api-client';
import { headers } from 'next/headers';
import Client from './client';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const host = (await headers()).get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}/api`;

  const apiClient = createApiClient(baseUrl);

  const recipe = await apiClient.recipesIdGet(id);

  if (!recipe) {
    return <NoContent text="レシピが見つかりません" />;
  }

  return <Client recipe={recipe} />;
}
