import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/coupang-api';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 기본 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 카테고리 페이지들
  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORIES).map((categoryId) => ({
    url: `${BASE_URL}/category/${categoryId}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages];
}
