import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBestProducts, CATEGORIES, CoupangProduct } from '@/lib/coupang-api';
import CategoryProductList from '@/components/category/CategoryProductList';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com';

// 카테고리 이모지 매핑
const categoryEmojis: Record<number, string> = {
  1001: '👗',
  1002: '👔',
  1010: '💄',
  1011: '👶',
  1012: '🍎',
  1013: '🍳',
  1014: '🧹',
  1015: '🛋️',
  1016: '📺',
  1017: '⚽',
  1018: '🚗',
  1019: '📚',
  1020: '🎮',
  1021: '✏️',
  1024: '💊',
  1029: '🐶',
  1030: '👶',
};

// 카테고리별 SEO 키워드
const categoryKeywords: Record<number, string[]> = {
  1001: ['여성패션', '여성의류', '원피스', '블라우스', '여성코디'],
  1002: ['남성패션', '남성의류', '셔츠', '바지', '남성코디'],
  1010: ['뷰티', '화장품', '스킨케어', '메이크업', '향수'],
  1011: ['출산', '유아동', '기저귀', '분유', '유아용품'],
  1012: ['식품', '신선식품', '간편식', '과일', '건강식품'],
  1013: ['주방용품', '조리도구', '그릇', '수납용품', '주방가전'],
  1014: ['생활용품', '청소용품', '욕실용품', '세제', '생활잡화'],
  1015: ['홈인테리어', '가구', '조명', '수납', '인테리어소품'],
  1016: ['가전디지털', 'TV', '노트북', '스마트폰', '가전제품'],
  1017: ['스포츠', '레저', '운동용품', '캠핑', '등산'],
  1018: ['자동차용품', '차량용품', '세차용품', '카액세서리'],
  1019: ['도서', '음반', 'DVD', '책', 'CD'],
  1020: ['완구', '취미', '장난감', '보드게임', '피규어'],
  1021: ['문구', '오피스', '필기구', '사무용품', '학용품'],
  1024: ['헬스', '건강식품', '비타민', '영양제', '다이어트'],
  1029: ['반려동물', '강아지', '고양이', '펫용품', '사료'],
  1030: ['유아동패션', '아동복', '유아복', '아기옷'],
};

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

// 정적 생성을 위한 파라미터
export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((id) => ({ id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const categoryId = parseInt(id);
  const categoryName = CATEGORIES[categoryId];

  if (!categoryName) {
    return { title: '카테고리를 찾을 수 없습니다' };
  }

  const emoji = categoryEmojis[categoryId] || '📦';
  const keywords = categoryKeywords[categoryId] || [];
  const now = new Date();
  const monthYear = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;

  return {
    title: `쿠팡 ${categoryName} 베스트 100 | 실시간 인기상품 순위 (${monthYear})`,
    description: `${monthYear} 쿠팡 ${categoryName} 카테고리 베스트셀러 TOP 100! 로켓배송 상품, 할인 특가, 실시간 인기 순위를 확인하세요. 가격 변동 추적으로 최적의 구매 타이밍을 잡으세요.`,
    keywords: [
      `쿠팡 ${categoryName}`,
      `${categoryName} 베스트`,
      `${categoryName} 인기상품`,
      `${categoryName} 추천`,
      `${categoryName} 최저가`,
      ...keywords,
    ],
    openGraph: {
      title: `${emoji} 쿠팡 ${categoryName} 베스트 100 | 실시간 인기상품`,
      description: `${monthYear} 쿠팡 ${categoryName} 베스트셀러! 로켓배송, 할인 특가 상품을 확인하세요.`,
      url: `${BASE_URL}/category/${categoryId}`,
      siteName: '쿠팡 최저가',
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${emoji} 쿠팡 ${categoryName} 베스트 100`,
      description: `${monthYear} 쿠팡 ${categoryName} 인기상품 순위`,
    },
    alternates: {
      canonical: `${BASE_URL}/category/${categoryId}`,
    },
  };
}

// JSON-LD ItemList 스키마 생성
function generateItemListJsonLd(categoryName: string, categoryId: number, products: CoupangProduct[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `쿠팡 ${categoryName} 베스트 상품`,
    description: `쿠팡 ${categoryName} 카테고리의 인기 베스트셀러 상품 목록`,
    url: `${BASE_URL}/category/${categoryId}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.productName,
        image: product.productImage,
        url: product.productUrl,
        offers: {
          '@type': 'Offer',
          price: product.productPrice,
          priceCurrency: 'KRW',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };
}

// BreadcrumbList 스키마 생성
function generateBreadcrumbJsonLd(categoryName: string, categoryId: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${BASE_URL}/category/${categoryId}`,
      },
    ],
  };
}

// CollectionPage 스키마 생성 (카테고리 컬렉션 페이지용)
function generateCollectionPageJsonLd(
  categoryName: string,
  categoryId: number,
  products: CoupangProduct[],
  emoji: string
) {
  const now = new Date();
  const prices = products.map((p) => p.productPrice);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE_URL}/category/${categoryId}`,
    name: `${emoji} 쿠팡 ${categoryName} 베스트 상품`,
    description: `쿠팡 ${categoryName} 카테고리의 베스트셀러 상품을 한눈에 확인하세요. 로켓배송, 무료배송 상품과 함께 가격 변동을 추적하고 최저가 알림을 받아보세요.`,
    url: `${BASE_URL}/category/${categoryId}`,
    inLanguage: 'ko-KR',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: '똑체크',
      url: BASE_URL,
    },
    about: {
      '@type': 'Thing',
      name: categoryName,
      description: `쿠팡 ${categoryName} 카테고리`,
    },
    dateModified: now.toISOString(),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      name: `${categoryName} 베스트 상품`,
    },
    specialty: `쿠팡 ${categoryName} 베스트셀러 TOP ${products.length}`,
    // 가격 범위 정보 추가
    ...(minPrice > 0 && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'KRW',
        lowPrice: minPrice,
        highPrice: maxPrice,
        offerCount: products.length,
      },
    }),
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const categoryId = parseInt(id);
  const categoryName = CATEGORIES[categoryId];

  if (!categoryName) {
    notFound();
  }

  const products = await getBestProducts(categoryId, 100).catch(() => []);
  const emoji = categoryEmojis[categoryId] || '📦';

  const itemListJsonLd = generateItemListJsonLd(categoryName, categoryId, products);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(categoryName, categoryId);
  const collectionPageJsonLd = generateCollectionPageJsonLd(categoryName, categoryId, products, emoji);

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <span className="text-[48px]">{emoji}</span>
            <div>
              <h1 className="text-[24px] font-bold text-[#191f28]">
                쿠팡 {categoryName} 베스트
              </h1>
              <p className="text-[14px] text-[#6b7684] mt-1">
                실시간 인기 상품 {products.length}개 · 매일 업데이트
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {products.length > 0 ? (
          <>
            <CategoryProductList products={products} />
            <p className="text-[12px] text-[#6b7684] mt-6 text-center">
              본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받으며, 구매자에게 추가 비용은 없습니다.
            </p>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center border border-[#e5e8eb]">
            <p className="text-[40px] mb-4">⏳</p>
            <p className="text-[15px] text-[#6b7684]">상품을 불러오는 중...</p>
            <p className="text-[13px] text-[#8b95a1] mt-2">잠시 후 다시 시도해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
