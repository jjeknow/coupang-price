import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/coupang-api';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 핵심 페이지들 (높은 우선순위)
  const corePages: MetadataRoute.Sitemap = [
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
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/favorites`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/alerts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // 카테고리 페이지들 (쿠팡 인기순 정렬)
  const categoryOrder = [
    1012, // 식품
    1014, // 생활용품
    1010, // 뷰티
    1016, // 가전디지털
    1013, // 주방용품
    1001, // 여성패션
    1002, // 남성패션
    1017, // 스포츠/레저
    1024, // 헬스/건강
    1029, // 반려동물
    1011, // 출산/유아동
    1015, // 홈인테리어
    1020, // 완구/취미
    1018, // 자동차용품
    1019, // 도서/음반
    1021, // 문구/오피스
  ];

  const categoryPages: MetadataRoute.Sitemap = categoryOrder
    .filter((id) => CATEGORIES[id])
    .map((categoryId, index) => ({
      url: `${BASE_URL}/category/${categoryId}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      // 인기 카테고리일수록 높은 우선순위 (0.95 ~ 0.75)
      priority: Math.max(0.75, 0.95 - index * 0.01),
    }));

  // 나머지 카테고리 추가
  const remainingCategories: MetadataRoute.Sitemap = Object.keys(CATEGORIES)
    .map(Number)
    .filter((id) => !categoryOrder.includes(id))
    .map((categoryId) => ({
      url: `${BASE_URL}/category/${categoryId}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    }));

  // 법적 페이지들 (낮은 우선순위)
  const legalPages: MetadataRoute.Sitemap = [
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

  return [...corePages, ...categoryPages, ...remainingCategories, ...legalPages];
}
