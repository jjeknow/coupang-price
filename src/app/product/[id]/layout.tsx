import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

// URL 슬러그에서 productId 추출 (예: "삼성-tv-65인치-12345" → "12345")
function extractProductId(slug: string): string {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  return slug;
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const productId = extractProductId(id);

  try {
    const product = await prisma.product.findFirst({
      where: { coupangId: productId },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!product) {
      return {
        title: '상품 정보 | 똑체크',
        description: '쿠팡 상품 가격 변동을 추적하고 최저가 알림을 받아보세요.',
      };
    }

    const prices = product.priceHistory.map((h) => h.price);
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : product.currentPrice;
    const highestPrice = prices.length > 0 ? Math.max(...prices) : product.currentPrice;
    const isCurrentLowest = product.currentPrice <= lowestPrice;
    const discountPercent = highestPrice > product.currentPrice
      ? Math.round(((highestPrice - product.currentPrice) / highestPrice) * 100)
      : 0;

    const now = new Date();
    const monthYear = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;

    // 키워드 추출 (상품명에서 주요 단어)
    const keywords = product.name
      .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 2)
      .slice(0, 10);

    const priceStatus = isCurrentLowest
      ? '역대 최저가 달성!'
      : discountPercent > 0
      ? `${discountPercent}% 할인 중`
      : '가격 추적 중';

    const title = `${product.name} 가격변동 | ${priceStatus} (${monthYear})`;
    const description = `${product.name} - 현재가 ${product.currentPrice.toLocaleString()}원${
      isCurrentLowest ? ' (역대 최저가!)' : ''
    }. 최저가 ${lowestPrice.toLocaleString()}원, 최고가 ${highestPrice.toLocaleString()}원. 똑체크에서 쿠팡 가격 변동을 추적하고 최저가 알림을 받아보세요.`;

    const productUrl = `${BASE_URL}/product/${id}`;

    return {
      title,
      description,
      keywords: [
        product.name,
        `${product.name} 가격`,
        `${product.name} 최저가`,
        '쿠팡 가격변동',
        '쿠팡 최저가',
        product.categoryName || '',
        ...keywords,
      ].filter(Boolean),
      openGraph: {
        title: `${product.name} | ${priceStatus}`,
        description,
        url: productUrl,
        siteName: '똑체크',
        locale: 'ko_KR',
        type: 'website',
        images: [
          {
            url: product.imageUrl,
            width: 492,
            height: 492,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | ${priceStatus}`,
        description: `현재가 ${product.currentPrice.toLocaleString()}원 | 최저가 ${lowestPrice.toLocaleString()}원`,
        images: [product.imageUrl],
      },
      alternates: {
        canonical: productUrl,
      },
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
    return {
      title: '상품 정보 | 똑체크',
      description: '쿠팡 상품 가격 변동을 추적하고 최저가 알림을 받아보세요.',
    };
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <div className="product-detail-page">
      {children}
    </div>
  );
}
