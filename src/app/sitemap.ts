import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/coupang-api';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com';

// 슬러그 생성 함수
function createSlug(productName: string, productId: string): string {
  const slug = productName
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .toLowerCase();
  return `${slug}-${productId}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // 상품 페이지들 (가격 히스토리가 있는 상품만)
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: {
        priceHistory: { some: {} },
      },
      orderBy: { updatedAt: 'desc' },
      take: 500, // 최근 업데이트된 500개 상품
      select: {
        coupangId: true,
        name: true,
        updatedAt: true,
        currentPrice: true,
        lowestPrice: true,
      },
    });

    productPages = products.map((product) => {
      // 최저가인 상품은 우선순위 높게
      const isLowestPrice = product.lowestPrice && product.currentPrice <= product.lowestPrice;
      return {
        url: `${BASE_URL}/product/${createSlug(product.name, product.coupangId)}`,
        lastModified: product.updatedAt,
        changeFrequency: 'daily' as const,
        priority: isLowestPrice ? 0.8 : 0.6,
      };
    });
  } catch (error) {
    console.error('상품 사이트맵 생성 오류:', error);
  }

  return [...corePages, ...categoryPages, ...remainingCategories, ...productPages, ...legalPages];
}
