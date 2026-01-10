'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import {
  ArrowLeft,
  Heart,
  Bell,
  ExternalLink,
  Zap,
  Truck,
  TrendingDown,
  Share2,
  ChevronRight,
} from 'lucide-react';
import PriceChart from '@/components/chart/PriceChart';
import ProductCard from '@/components/ui/ProductCard';

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
}

interface PriceHistory {
  time: string;
  price: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';

// 카테고리명으로 카테고리 ID 찾기 (부분 매칭 지원)
const CATEGORY_MAP: Record<string, number> = {
  '여성패션': 1001,
  '남성패션': 1002,
  '뷰티': 1010,
  '출산/유아동': 1011,
  '출산': 1011,
  '유아동': 1011,
  '식품': 1012,
  '주방용품': 1013,
  '주방': 1013,
  '생활용품': 1014,
  '생활': 1014,
  '홈인테리어': 1015,
  '인테리어': 1015,
  '가전디지털': 1016,
  '가전': 1016,
  '디지털': 1016,
  '스포츠/레저': 1017,
  '스포츠': 1017,
  '레저': 1017,
  '자동차용품': 1018,
  '자동차': 1018,
  '도서/음반/DVD': 1019,
  '도서': 1019,
  '음반': 1019,
  '완구/취미': 1020,
  '완구': 1020,
  '취미': 1020,
  '문구/오피스': 1021,
  '문구': 1021,
  '오피스': 1021,
  '헬스/건강식품': 1024,
  '헬스': 1024,
  '건강식품': 1024,
  '건강': 1024,
  '국내여행': 1025,
  '해외여행': 1026,
  '반려동물용품': 1029,
  '반려동물': 1029,
  '펫': 1029,
  '유아동패션': 1030,
  'Coupang PL': 1014, // 쿠팡 PL은 생활용품으로 매핑
};

function getCategoryIdByName(categoryName: string): number {
  if (!categoryName) return 1012;

  // 정확히 매칭
  if (CATEGORY_MAP[categoryName]) {
    return CATEGORY_MAP[categoryName];
  }

  // 부분 매칭 시도
  const lowerName = categoryName.toLowerCase();
  for (const [key, id] of Object.entries(CATEGORY_MAP)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return id;
    }
  }

  return 1012; // 기본값: 식품
}

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAlertOn, setIsAlertOn] = useState(false);

  // 가격 통계 계산 (priceHistory가 비어있어도 안전하게 처리)
  const { lowestPrice, highestPrice, isCurrentLowest } = useMemo(() => {
    if (priceHistory.length === 0 || !product) {
      return { lowestPrice: 0, highestPrice: 0, isCurrentLowest: false };
    }
    const prices = priceHistory.map((p) => p.price);
    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);
    return {
      lowestPrice: lowest,
      highestPrice: highest,
      isCurrentLowest: product.productPrice <= lowest,
    };
  }, [priceHistory, product]);

  // JSON-LD 구조화 데이터 (product가 null이어도 안전하게 처리)
  const productJsonLd = useMemo(() => {
    if (!product) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${BASE_URL}/product/${product.productId}`,
      name: product.productName,
      image: product.productImage,
      description: `${product.productName} - 쿠팡 최저가에서 가격 변동을 추적하고 역대 최저가 알림을 받아보세요.`,
      sku: product.productId.toString(),
      brand: {
        '@type': 'Brand',
        name: '쿠팡',
      },
      offers: {
        '@type': 'Offer',
        url: product.productUrl,
        priceCurrency: 'KRW',
        price: product.productPrice,
        priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: '쿠팡',
        },
      },
    };
  }, [product]);

  const breadcrumbJsonLd = useMemo(() => {
    if (!product) return null;
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
        ...(product.categoryName ? [{
          '@type': 'ListItem',
          position: 2,
          name: product.categoryName,
          item: `${BASE_URL}/category/1016`,
        }] : []),
        {
          '@type': 'ListItem',
          position: product.categoryName ? 3 : 2,
          name: product.productName,
          item: `${BASE_URL}/product/${product.productId}`,
        },
      ],
    };
  }, [product]);

  useEffect(() => {
    // 가격 히스토리 생성 (데모)
    const generatePriceHistory = (basePrice: number) => {
      const history: PriceHistory[] = [];
      const today = new Date();

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // 가격 변동 시뮬레이션 (±10%)
        const variation = (Math.random() - 0.5) * 0.2;
        const price = Math.round(basePrice * (1 + variation));

        history.push({ time: dateStr, price });
      }

      return history;
    };

    // URL 쿼리에서 상품 데이터 파싱
    const dataParam = searchParams.get('data');

    if (dataParam) {
      try {
        const productData = JSON.parse(decodeURIComponent(dataParam)) as Product;
        setProduct(productData);
        setPriceHistory(generatePriceHistory(productData.productPrice));
      } catch {
        console.error('상품 데이터 파싱 실패');
        setProduct(null);
      }
    } else {
      setProduct(null);
    }

    setLoading(false);
  }, [productId, searchParams]);

  // ============================================================
  // 비슷한 상품 추천 (단순 키워드 검색 방식)
  // ============================================================

  // 상품명에서 핵심 키워드 추출 (1~2개)
  const extractKeyword = (productName: string): string => {
    // 1. 괄호 내용 제거
    let cleaned = productName
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/《.*?》/g, '')
      .replace(/【.*?】/g, '');

    // 2. 용량/수량 표기 제거
    cleaned = cleaned
      .replace(/\d+[gGmMlLkK][gGmMlL]?/gi, '')
      .replace(/\d+(?:개|입|팩|봉|세트|매|장|박스|캔|병|포)/gi, '')
      .replace(/\d+[+x×]\d+/gi, '');

    // 3. 배송/마케팅 문구 제거
    cleaned = cleaned
      .replace(/(?:무료|로켓|당일|익일)배송/g, '')
      .replace(/(?:특가|할인|세일|기획전|베스트|BEST|HOT|NEW)/gi, '');

    // 4. 특수문자 정리
    cleaned = cleaned
      .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 5. 단어 분리 후 핵심 키워드 선택
    const words = cleaned.split(' ').filter(w => w.length >= 2);

    // 불용어
    const stopWords = ['상품', '제품', '세트', '기획', '특가', '한정', '신상', '인기',
                       '추천', '증정', '공식', '정품', '대용량', '국내', '해외', '수입'];

    // 불용어 제외한 첫 번째 의미있는 키워드 반환
    for (const word of words) {
      if (!stopWords.includes(word) && word.length >= 2) {
        return word;
      }
    }

    // 못찾으면 첫 단어 반환
    return words[0] || productName.slice(0, 10);
  };

  // 비슷한 상품 가져오기 (단순 키워드 검색)
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
        // 핵심 키워드 추출 (예: "돌자반" → "돌자반", "신라면" → "신라면")
        const keyword = extractKeyword(product.productName);

        // 해당 키워드로 검색
        const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}&limit=10`);

        if (response.ok) {
          const result = await response.json();
          const products = (result.data?.products || []) as Product[];

          // 현재 상품 제외
          const filtered = products.filter(p => p.productId.toString() !== productId);

          setRelatedProducts(filtered.slice(0, 8));
        } else {
          // 검색 실패시 같은 카테고리 상품으로 fallback
          if (product.categoryName) {
            const categoryId = getCategoryIdByName(product.categoryName);
            const fallbackResponse = await fetch(`/api/products/best/${categoryId}?limit=10`);
            if (fallbackResponse.ok) {
              const result = await fallbackResponse.json();
              const products = (result.data?.products || []) as Product[];
              const filtered = products.filter(p => p.productId.toString() !== productId);
              setRelatedProducts(filtered.slice(0, 8));
            }
          }
        }
      } catch (error) {
        console.error('비슷한 상품 로딩 실패:', error);
      }
    };

    if (productId && product) {
      fetchRelatedProducts();
    }
  }, [productId, product]);

  const formatPrice = (price: number) => price.toLocaleString('ko-KR');

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex items-center justify-center">
        <div className="spinner-lg" />
      </div>
    );
  }

  // 상품이 없는 경우
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex items-center justify-center">
        <div className="text-center">
          <p className="toss-body-1 text-[#6b7684] mb-4">상품을 찾을 수 없습니다</p>
          <Link href="/" className="toss-btn toss-btn-primary px-6 py-3">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 이미지 URL에서 크기 변경 (492x492로 고화질)
  const highResImage = product.productImage.replace(/\/\d+x\d+\//, '/492x492/');

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      {productJsonLd && (
        <Script
          id="product-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}

      <div className="min-h-screen bg-[#f2f4f6]">
        {/* 상단 네비게이션 */}
        <div className="sticky top-0 z-50 bg-white border-b border-[#e5e8eb]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="p-2 -ml-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg">
                <ArrowLeft size={24} />
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite ? 'text-[#f04452]' : 'text-[#4e5968] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <Heart size={24} fill={isFavorite ? '#f04452' : 'none'} />
                </button>
                <button className="p-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* 이미지 - 고화질 */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-[#e5e8eb]">
                <Image
                  src={highResImage}
                  alt={product.productName}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  unoptimized
                />
                {isCurrentLowest && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#f04452] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <TrendingDown size={14} />
                      역대 최저가
                    </span>
                  </div>
                )}
                {/* 배지들 */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.isRocket && (
                    <span className="bg-[#3182f6] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Zap size={12} />
                      로켓배송
                    </span>
                  )}
                  {product.isFreeShipping && !product.isRocket && (
                    <span className="bg-[#00c471] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Truck size={12} />
                      무료배송
                    </span>
                  )}
                </div>
              </div>

              {/* 정보 */}
              <div>
                {/* 카테고리 */}
                {product.categoryName && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[13px] text-[#8b95a1]">{product.categoryName}</span>
                    <ChevronRight size={14} className="text-[#8b95a1]" />
                  </div>
                )}

                {/* 상품명 */}
                <h1 className="text-[20px] md:text-[24px] font-bold text-[#191f28] mb-6 leading-snug">{product.productName}</h1>

                {/* 현재 가격 */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[36px] font-bold text-[#191f28] tracking-tight">
                      {formatPrice(product.productPrice)}
                    </span>
                    <span className="text-[18px] text-[#6b7684]">원</span>
                    {isCurrentLowest && (
                      <span className="bg-[#f04452] text-white text-[12px] font-bold px-2 py-0.5 rounded ml-2">
                        최저
                      </span>
                    )}
                  </div>
                </div>

                {/* 가격 정보 테이블 */}
                <div className="border border-[#e5e8eb] rounded-xl overflow-hidden mb-6">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-[#e5e8eb]">
                        <td className="py-3 px-4 bg-[#f8f9fa] text-[14px] text-[#6b7684] w-[120px]">역대최저가</td>
                        <td className="py-3 px-4 text-[14px] font-semibold text-[#00c471]">
                          {formatPrice(lowestPrice)}원
                        </td>
                      </tr>
                      <tr className="border-b border-[#e5e8eb]">
                        <td className="py-3 px-4 bg-[#f8f9fa] text-[14px] text-[#6b7684]">최근가격</td>
                        <td className="py-3 px-4 text-[14px] font-medium text-[#191f28]">
                          {formatPrice(product.productPrice)}원
                        </td>
                      </tr>
                      <tr className="border-b border-[#e5e8eb]">
                        <td className="py-3 px-4 bg-[#f8f9fa] text-[14px] text-[#6b7684]">평균가격</td>
                        <td className="py-3 px-4 text-[14px] font-medium text-[#191f28]">
                          {formatPrice(Math.round((lowestPrice + highestPrice) / 2))}원
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 bg-[#f8f9fa] text-[14px] text-[#6b7684]">최고가격</td>
                        <td className="py-3 px-4 text-[14px] font-medium text-[#ff8b00]">
                          {formatPrice(highestPrice)}원
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 가격하락률 */}
                {highestPrice > product.productPrice && (
                  <div className="bg-[#e8f3ff] rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#3182f6]">최고가 대비 할인율</span>
                      <span className="text-[20px] font-bold text-[#3182f6]">
                        {Math.round(((highestPrice - product.productPrice) / highestPrice) * 100)}% 할인
                      </span>
                    </div>
                  </div>
                )}

                {/* 버튼 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsAlertOn(!isAlertOn)}
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isAlertOn
                        ? 'bg-[#f04452]/10 text-[#f04452] border-2 border-[#f04452]'
                        : 'bg-[#f2f4f6] text-[#4e5968] hover:bg-[#e5e8eb]'
                    }`}
                  >
                    <Bell size={20} fill={isAlertOn ? '#f04452' : 'none'} />
                    {isAlertOn ? '알림 ON' : '최저가 알림'}
                  </button>
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    쿠팡에서 구매
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 가격 차트 */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="toss-card-flat p-6 border border-[#e5e8eb]">
            <PriceChart
              data={priceHistory}
              currentPrice={product.productPrice}
              lowestPrice={lowestPrice}
              highestPrice={highestPrice}
              height={350}
            />
          </div>
        </div>

        {/* 구매 가이드 */}
        <div className="max-w-6xl mx-auto px-4 pb-6">
          <div className="toss-card-flat p-6 border border-[#e5e8eb]">
            <h3 className="toss-title-3 mb-4">구매 가이드</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#3182f6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[#3182f6]">1</span>
                </div>
                <p className="toss-body-2 text-[#6b7684]">
                  현재 가격이 30일 내 최저가인지 확인하세요
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#3182f6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[#3182f6]">2</span>
                </div>
                <p className="toss-body-2 text-[#6b7684]">
                  최저가 알림을 설정하면 가격이 떨어질 때 알려드려요
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#3182f6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[#3182f6]">3</span>
                </div>
                <p className="toss-body-2 text-[#6b7684]">
                  가격 추이를 참고하여 구매 시점을 결정하세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 비슷한 상품 */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-6">
            <div className="bg-white rounded-xl border border-[#e5e8eb] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e5e8eb] bg-[#f8f9fa]">
                <h3 className="text-[16px] font-bold text-[#191f28] flex items-center gap-2">
                  <span className="text-[18px]">🛍️</span>
                  비슷한 상품
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.productId}
                      productId={relatedProduct.productId}
                      productName={relatedProduct.productName}
                      productPrice={relatedProduct.productPrice}
                      productImage={relatedProduct.productImage}
                      productUrl={relatedProduct.productUrl}
                      isRocket={relatedProduct.isRocket}
                      isFreeShipping={relatedProduct.isFreeShipping}
                      categoryName={relatedProduct.categoryName}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 파트너스 고지 */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <p className="text-[11px] text-[#adb5bd] text-center">
            해당 사이트는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받으며, 구매자에게 추가 비용은 없습니다.
          </p>
        </div>
      </div>
    </>
  );
}
