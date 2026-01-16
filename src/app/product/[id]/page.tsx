'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  ChevronRight,
} from 'lucide-react';
import PriceChart from '@/components/chart/PriceChart';
import ProductCard from '@/components/ui/ProductCard';
import { saveRecentProduct } from '@/components/home/RecentlyViewed';
import { isFavorite as checkIsFavorite, toggleFavorite } from '@/lib/favorites';
import { useToast } from '@/components/providers/ToastProvider';
import BottomSheet from '@/components/ui/BottomSheet';

// 카카오 SDK 타입
declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            imageUrl: string;
            link: { mobileWebUrl: string; webUrl: string };
          };
          commerce: {
            productName: string;
            regularPrice: number;
            discountPrice: number;
          };
          buttons: Array<{
            title: string;
            link: { mobileWebUrl: string; webUrl: string };
          }>;
        }) => void;
      };
    };
  }
}

// 카카오 JavaScript 앱 키 (카카오 개발자 콘솔에서 발급)
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';

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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com';

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

// URL 슬러그에서 productId 추출 (예: "삼성-tv-65인치-12345" → "12345")
function extractProductId(slug: string): string {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  // 마지막 부분이 숫자인지 확인
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  // 숫자가 없으면 전체 반환 (기존 방식 호환)
  return slug;
}

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const toast = useToast();
  const rawId = params.id as string;
  const productId = extractProductId(rawId);

  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAlertOn, setIsAlertOn] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState(0);
  const [alertLoading, setAlertLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // 가격 통계 계산 (priceHistory가 비어있으면 현재 가격 사용)
  const { lowestPrice, highestPrice, isCurrentLowest, hasHistoryData } = useMemo(() => {
    if (!product) {
      return { lowestPrice: 0, highestPrice: 0, isCurrentLowest: false, hasHistoryData: false };
    }
    if (priceHistory.length === 0) {
      // 데이터 없음 - 현재 가격으로 표시 (역대 최저가 배지는 표시 안함)
      return {
        lowestPrice: product.productPrice,
        highestPrice: product.productPrice,
        isCurrentLowest: false,
        hasHistoryData: false,
      };
    }
    const prices = priceHistory.map((p) => p.price);
    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);
    return {
      lowestPrice: lowest,
      highestPrice: highest,
      isCurrentLowest: product.productPrice <= lowest,
      hasHistoryData: true,
    };
  }, [priceHistory, product]);

  // JSON-LD 구조화 데이터 (product가 null이어도 안전하게 처리)
  const productJsonLd = useMemo(() => {
    if (!product) return null;

    // 가격 통계 계산
    const prices = priceHistory.length > 0 ? priceHistory.map((p) => p.price) : [product.productPrice];
    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${BASE_URL}/product/${product.productId}`,
      name: product.productName,
      image: [product.productImage, product.productImage.replace(/\/\d+x\d+\//, '/492x492/')],
      description: `${product.productName} - 똑체크에서 쿠팡 가격 변동을 추적하고 역대 최저가 알림을 받아보세요. 현재가: ${product.productPrice.toLocaleString()}원, 최저가: ${lowest.toLocaleString()}원`,
      sku: product.productId.toString(),
      mpn: product.productId.toString(),
      brand: {
        '@type': 'Brand',
        name: '쿠팡',
      },
      category: product.categoryName || '기타',
      offers: {
        '@type': 'AggregateOffer',
        url: product.productUrl,
        priceCurrency: 'KRW',
        lowPrice: lowest,
        highPrice: highest,
        price: product.productPrice,
        priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: 'https://schema.org/InStock',
        offerCount: 1,
        seller: {
          '@type': 'Organization',
          name: '쿠팡',
          url: 'https://www.coupang.com',
        },
        shippingDetails: product.isRocket ? {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: 0,
            currency: 'KRW',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
          },
        } : undefined,
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: '배송',
          value: product.isRocket ? '로켓배송' : (product.isFreeShipping ? '무료배송' : '유료배송'),
        },
        {
          '@type': 'PropertyValue',
          name: '7일 최저가',
          value: `${lowest.toLocaleString()}원`,
        },
        {
          '@type': 'PropertyValue',
          name: '7일 최고가',
          value: `${highest.toLocaleString()}원`,
        },
      ],
    };
  }, [product, priceHistory]);

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

  // 카카오 SDK 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao && KAKAO_JS_KEY) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
    }
  }, []);

  // 상품 DB 등록 (가격 추적 시작) - 쿠팡 API 호출 없음
  const registerProduct = async (productData: Product) => {
    try {
      await fetch('/api/products/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productData.productId,
          productName: productData.productName,
          productPrice: productData.productPrice,
          productImage: productData.productImage,
          productUrl: productData.productUrl,
          categoryName: productData.categoryName,
          isRocket: productData.isRocket,
          isFreeShipping: productData.isFreeShipping,
        }),
      });
    } catch {
      // 등록 실패해도 무시 (백그라운드 작업)
    }
  };

  // 실제 가격 히스토리 조회
  const fetchPriceHistory = async (prodId: string) => {
    setPriceHistoryLoading(true);
    try {
      const res = await fetch(`/api/products/${prodId}/price-history`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.hasHistory && data.data.history.length > 0) {
          setPriceHistory(data.data.history);
          setHasRealData(true);
        } else {
          // 데이터 없음
          setPriceHistory([]);
          setHasRealData(false);
        }
      } else {
        // API 실패
        setPriceHistory([]);
        setHasRealData(false);
      }
    } catch (error) {
      console.error('가격 히스토리 조회 실패:', error);
      setPriceHistory([]);
      setHasRealData(false);
    } finally {
      setPriceHistoryLoading(false);
    }
  };

  // 실제 데이터 여부 상태
  const [hasRealData, setHasRealData] = useState(false);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      // URL 쿼리에서 상품 데이터 파싱
      const dataParam = searchParams.get('data');

      if (dataParam) {
        try {
          const productData = JSON.parse(decodeURIComponent(dataParam)) as Product;
          setProduct(productData);

          // 상품 DB 등록 (가격 추적 시작)
          registerProduct(productData);

          // 실제 가격 히스토리 조회 시도
          fetchPriceHistory(productData.productId.toString());

          // 최근 본 상품에 저장
          saveRecentProduct({
            productId: productData.productId,
            productName: productData.productName,
            productPrice: productData.productPrice,
            productImage: productData.productImage,
            productUrl: productData.productUrl,
            isRocket: productData.isRocket,
            isFreeShipping: productData.isFreeShipping,
            categoryName: productData.categoryName,
          });
          setLoading(false);
          return;
        } catch {
          console.error('상품 데이터 파싱 실패');
        }
      }

      // 쿼리 파라미터가 없으면 DB에서 조회 (공유 링크 등)
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const productData = result.data as Product;
            setProduct(productData);

            // 실제 가격 히스토리 조회 시도
            fetchPriceHistory(productData.productId.toString());

            // 최근 본 상품에 저장
            saveRecentProduct({
              productId: productData.productId,
              productName: productData.productName,
              productPrice: productData.productPrice,
              productImage: productData.productImage,
              productUrl: productData.productUrl,
              isRocket: productData.isRocket,
              isFreeShipping: productData.isFreeShipping,
              categoryName: productData.categoryName,
            });
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('DB 상품 조회 실패:', error);
      }

      // 둘 다 실패하면 상품 없음
      setProduct(null);
      setLoading(false);
    };

    loadProduct();
  }, [productId, searchParams]);

  // 관심상품/알림 상태 초기화
  useEffect(() => {
    if (product) {
      // 로컬 스토리지 (비로그인)
      setIsFavorite(checkIsFavorite(product.productId));
      setTargetPrice(Math.round(product.productPrice * 0.9)); // 기본 목표가: 10% 할인

      // 로그인 상태면 서버에서 체크
      if (session?.user) {
        checkUserFavorite();
        checkUserAlert();
      }
    }
  }, [product, session]);

  const checkUserFavorite = async () => {
    if (!product) return;
    try {
      const res = await fetch('/api/user/favorites');
      if (res.ok) {
        const favorites = await res.json();
        const found = favorites.find((f: { coupangProductId: string }) =>
          f.coupangProductId === String(product.productId)
        );
        if (found) setIsFavorite(true);
      }
    } catch (error) {
      console.error('관심상품 체크 실패:', error);
    }
  };

  const checkUserAlert = async () => {
    if (!product) return;
    try {
      const res = await fetch('/api/user/alerts');
      if (res.ok) {
        const alerts = await res.json();
        const found = alerts.find((a: { coupangProductId: string; isActive: boolean; targetPrice: number }) =>
          a.coupangProductId === String(product.productId) && a.isActive
        );
        if (found) {
          setIsAlertOn(true);
          setTargetPrice(found.targetPrice);
        }
      }
    } catch (error) {
      console.error('알림 체크 실패:', error);
    }
  };

  const handleFavoriteClick = async () => {
    if (!product) return;

    // 비로그인: 로컬 스토리지
    if (!session?.user) {
      const newState = toggleFavorite({
        productId: product.productId,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: product.productImage,
        productUrl: product.productUrl,
        isRocket: product.isRocket,
        isFreeShipping: product.isFreeShipping,
        categoryName: product.categoryName,
      });
      setIsFavorite(newState);
      toast.success(newState ? '관심상품에 추가했어요' : '관심상품에서 삭제했어요');
      return;
    }

    // 로그인: 서버 저장
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // 삭제
        const res = await fetch(`/api/user/favorites?productId=${product.productId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsFavorite(false);
          toast.success('관심상품에서 삭제했어요');
        }
      } else {
        // 추가
        const res = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coupangProductId: product.productId,
            productName: product.productName,
            productPrice: product.productPrice,
            productImage: product.productImage,
            productUrl: product.productUrl,
            categoryName: product.categoryName,
            isRocket: product.isRocket,
            isFreeShipping: product.isFreeShipping,
          }),
        });
        if (res.ok) {
          setIsFavorite(true);
          toast.success('관심상품에 추가했어요');
        }
      }
    } catch (error) {
      console.error('관심상품 토글 실패:', error);
      toast.error('오류가 발생했어요');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAlertClick = () => {
    if (!session?.user) {
      // 비로그인: 로그인 페이지로 이동
      window.location.href = `/auth/login?callbackUrl=/product/${rawId}`;
      return;
    }
    setShowAlertModal(true);
  };

  const handleAlertSubmit = async () => {
    if (!product || !session?.user) return;

    setAlertLoading(true);
    try {
      const res = await fetch('/api/user/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupangProductId: product.productId,
          productName: product.productName,
          productPrice: product.productPrice,
          productImage: product.productImage,
          productUrl: product.productUrl,
          targetPrice,
        }),
      });

      if (res.ok) {
        setIsAlertOn(true);
        setShowAlertModal(false);
        toast.success(`${formatPrice(targetPrice)}원 이하가 되면 알려드릴게요`);
      } else {
        const data = await res.json();
        toast.error(data.error || '알림 설정에 실패했어요');
      }
    } catch (error) {
      console.error('알림 설정 실패:', error);
      toast.error('오류가 발생했어요');
    } finally {
      setAlertLoading(false);
    }
  };

  const handleAlertDelete = async () => {
    if (!product || !session?.user) return;

    try {
      const res = await fetch('/api/user/alerts');
      if (res.ok) {
        const alerts = await res.json();
        const found = alerts.find((a: { coupangProductId: string; id: string }) =>
          a.coupangProductId === String(product.productId)
        );
        if (found) {
          await fetch(`/api/user/alerts?alertId=${found.id}`, { method: 'DELETE' });
          setIsAlertOn(false);
          setShowAlertModal(false);
          toast.success('가격 알림을 해제했어요');
        }
      }
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      toast.error('오류가 발생했어요');
    }
  };

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

  // 쿠팡 구매 버튼 클릭 핸들러 (딥링크 새로 생성)
  const handlePurchaseClick = async () => {
    if (!product) return;

    setPurchaseLoading(true);

    try {
      // 딥링크 새로 생성 시도
      const res = await fetch('/api/deeplink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.productId,
          productUrl: product.productUrl,
        }),
      });

      const result = await res.json();

      // 새 딥링크가 있으면 사용, 없으면 기존 URL 사용
      const targetUrl = result.data?.shortenUrl || result.data?.landingUrl || product.productUrl;

      // 새 창으로 열기
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('딥링크 생성 실패:', error);
      // 실패 시 기존 URL로 열기
      window.open(product.productUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setPurchaseLoading(false);
    }
  };

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
          <p className="toss-body-1 text-[#5c6470] mb-4">상품을 찾을 수 없습니다</p>
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
      {/* 카카오 SDK */}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
        integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Ber/1kA"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.Kakao && KAKAO_JS_KEY && !window.Kakao.isInitialized()) {
            window.Kakao.init(KAKAO_JS_KEY);
          }
        }}
      />

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
        {/* 상단 네비게이션 - 뒤로가기만 */}
        <div className="bg-white border-b border-[#e5e8eb]">
          <div className="px-4">
            <div className="flex items-center h-12">
              <Link href="/" className="p-2 -ml-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg flex items-center gap-2">
                <ArrowLeft size={20} />
                <span className="text-[14px] font-medium">뒤로</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="bg-white">
          <div className="px-4 py-4">
            <div className="space-y-4">
              {/* 이미지 - 고화질 */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-[#e5e8eb]">
                <Image
                  src={highResImage}
                  alt={product.productName}
                  fill
                  className="object-contain p-6"
                  sizes="100vw"
                  priority
                  unoptimized
                />
                {hasHistoryData && isCurrentLowest && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#f04452] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <TrendingDown size={14} />
                      역대 최저가
                    </span>
                  </div>
                )}
                {/* 우측 상단 - 관심/공유 버튼 (세로 배치) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={handleFavoriteClick}
                    disabled={favoriteLoading}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg border border-[#e5e8eb] disabled:opacity-50 ${
                      isFavorite ? 'bg-[#f04452] text-white border-[#f04452]' : 'bg-white/95 text-[#5c6470] hover:bg-white hover:text-[#f04452]'
                    }`}
                    aria-label="관심상품"
                  >
                    <Heart size={18} fill={isFavorite ? '#fff' : 'none'} />
                  </button>
                  <button
                    onClick={() => {
                      // 짧은 공유 URL (쿼리 파라미터 없이)
                      const shareUrl = `${BASE_URL}/product/${productId}`;

                      // 카카오톡 공유
                      if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
                        window.Kakao.Share.sendDefault({
                          objectType: 'commerce',
                          content: {
                            title: product.productName,
                            imageUrl: product.productImage,
                            link: {
                              mobileWebUrl: shareUrl,
                              webUrl: shareUrl,
                            },
                          },
                          commerce: {
                            productName: product.productName,
                            regularPrice: highestPrice,
                            discountPrice: product.productPrice,
                          },
                          buttons: [
                            {
                              title: '자세히 보기',
                              link: {
                                mobileWebUrl: shareUrl,
                                webUrl: shareUrl,
                              },
                            },
                          ],
                        });
                      } else {
                        // 카카오 SDK 없으면 일반 공유
                        if (navigator.share) {
                          navigator.share({
                            title: product.productName,
                            text: `${product.productName} - ${formatPrice(product.productPrice)}원`,
                            url: shareUrl,
                          });
                        } else {
                          navigator.clipboard.writeText(shareUrl);
                          toast.success('링크가 복사되었어요');
                        }
                      }
                    }}
                    className="w-9 h-9 bg-[#FEE500] hover:bg-[#FADA0A] rounded-full flex items-center justify-center transition-all shadow-lg"
                    aria-label="카카오톡 공유하기"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 3C5.58172 3 2 5.79086 2 9.20755C2 11.4151 3.54198 13.3397 5.80545 14.3962L4.97368 17.4528C4.89777 17.7408 5.22735 17.9692 5.48052 17.8021L9.17596 15.3585C9.44707 15.3862 9.72166 15.4151 10 15.4151C14.4183 15.4151 18 12.6242 18 9.20755C18 5.79086 14.4183 3 10 3Z" fill="#191f28"/>
                    </svg>
                  </button>
                </div>
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
                    <span className="text-[13px] text-[#5c6470]">{product.categoryName}</span>
                    <ChevronRight size={14} className="text-[#5c6470]" />
                  </div>
                )}

                {/* 상품명 */}
                <h1 className="text-[18px] font-bold text-[#191f28] mb-4 leading-snug">{product.productName}</h1>

                {/* 현재 가격 */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] font-bold text-[#c92a2a] tracking-tighter">
                      {formatPrice(product.productPrice)}
                    </span>
                    <span className="text-[14px] text-[#c92a2a]">원</span>
                  </div>
                </div>

                {/* 가격 정보 테이블 */}
                {hasHistoryData ? (
                  <div className="border border-[#e5e8eb] rounded-lg overflow-hidden mb-4">
                    <table className="w-full text-[13px]">
                      <tbody>
                        <tr className="border-b border-[#e5e8eb]">
                          <td className="py-3 px-4 bg-[#f8f9fa] text-[#5c6470] font-medium w-1/3">역대 최저가</td>
                          <td className="py-3 px-4 text-[#087f5b] font-bold text-right">{formatPrice(lowestPrice)}원</td>
                        </tr>
                        <tr className="border-b border-[#e5e8eb]">
                          <td className="py-3 px-4 bg-[#f8f9fa] text-[#5c6470] font-medium">평균 가격</td>
                          <td className="py-3 px-4 text-[#191f28] font-bold text-right">{formatPrice(Math.round((lowestPrice + highestPrice) / 2))}원</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 bg-[#f8f9fa] text-[#5c6470] font-medium">최고 가격</td>
                          <td className="py-3 px-4 text-[#d9480f] font-bold text-right">{formatPrice(highestPrice)}원</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4 text-center">
                    <p className="text-[13px] text-[#5c6470] font-medium">
                      가격 데이터 수집 중입니다
                    </p>
                    <p className="text-[11px] text-[#5c6470] mt-1">
                      내일부터 가격 변동 정보를 확인할 수 있어요
                    </p>
                  </div>
                )}

                {/* 가격하락률 */}
                {hasHistoryData && highestPrice > product.productPrice && (
                  <div className="bg-[#e8f3ff] rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#1d4ed8]">최고가 대비 할인율</span>
                      <span className="text-[16px] font-bold text-[#1d4ed8]">
                        {Math.round(((highestPrice - product.productPrice) / highestPrice) * 100)}% 할인
                      </span>
                    </div>
                  </div>
                )}

                {/* 파트너스 고지 */}
                <div className="p-3 bg-[#f8f9fa] rounded-xl">
                  <p className="text-[11px] text-[#5c6470] leading-relaxed">
                    본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받으며,
                    무료로 제공하는 가격 추적 서비스 유지에 사용됩니다. 구매자에게 추가 비용은 없습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 가격 차트 */}
        <div className="px-4 py-6">
          <div className="toss-card-flat p-6 border border-[#e5e8eb]">
            {hasRealData && priceHistory.length > 0 ? (
              <PriceChart
                data={priceHistory}
                currentPrice={product.productPrice}
                lowestPrice={lowestPrice}
                highestPrice={highestPrice}
                height={350}
              />
            ) : (
              <div className="text-center py-12">
                <div className={`w-16 h-16 bg-[#f2f4f6] rounded-full flex items-center justify-center mx-auto mb-4 ${priceHistoryLoading ? 'animate-pulse' : ''}`}>
                  <TrendingDown size={32} className="text-[#adb5bd]" />
                </div>
                <h4 className="text-[17px] font-semibold text-[#191f28] mb-2">
                  {priceHistoryLoading ? '가격 데이터 확인 중...' : '가격 추적을 시작합니다'}
                </h4>
                <p className="text-[14px] text-[#5c6470] mb-1">
                  {priceHistoryLoading ? '잠시만 기다려주세요' : '이 상품의 가격 데이터를 수집 중입니다.'}
                </p>
                {!priceHistoryLoading && (
                  <p className="text-[13px] text-[#5c6470]">
                    내일부터 실제 가격 변동 그래프를 확인할 수 있어요.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 구매 가이드 */}
        <div className="px-4 pb-6">
          <div className="toss-card-flat p-6 border border-[#e5e8eb]">
            <h3 className="toss-title-3 mb-4">구매 가이드</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#3182f6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[#1d4ed8]">1</span>
                </div>
                <p className="toss-body-2 text-[#5c6470]">
                  현재 가격이 7일 내 최저가인지 확인하세요
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#3182f6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[#1d4ed8]">2</span>
                </div>
                <p className="toss-body-2 text-[#5c6470]">
                  최저가 알림을 설정하면 가격이 떨어질 때 알려드려요
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-[#3182f6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[#1d4ed8]">3</span>
                </div>
                <p className="toss-body-2 text-[#5c6470]">
                  가격 추이를 참고하여 구매 시점을 결정하세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 비슷한 상품 */}
        {relatedProducts.length > 0 && (
          <div className="px-4 pb-36">
            <div className="bg-white rounded-xl border border-[#e5e8eb] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e5e8eb] bg-[#f8f9fa]">
                <h3 className="text-[16px] font-bold text-[#191f28] flex items-center gap-2">
                  <span className="text-[18px]">🛍️</span>
                  비슷한 상품
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {relatedProducts.map((relatedProduct, index) => (
                    <ProductCard
                      key={`${relatedProduct.productId}-${index}`}
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

      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-14 left-0 right-0 w-full z-40 bg-white border-t border-[#e5e8eb] px-4 py-3 bottom-action-bar">
        <div className="flex gap-3">
          <button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
              isFavorite
                ? 'bg-[#fee] border-[#f04452] text-[#f04452]'
                : 'bg-white border-[#e5e8eb] text-[#5c6470]'
            }`}
            aria-label="관심상품"
          >
            <Heart size={22} fill={isFavorite ? '#f04452' : 'none'} />
          </button>
          <button
            onClick={handleAlertClick}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
              isAlertOn
                ? 'bg-[#fff8e6] border-[#ff9500] text-[#ff9500]'
                : 'bg-white border-[#e5e8eb] text-[#5c6470]'
            }`}
            aria-label="가격 알림"
          >
            <Bell size={22} fill={isAlertOn ? '#ff9500' : 'none'} />
          </button>
          <button
            onClick={handlePurchaseClick}
            disabled={purchaseLoading}
            className="flex-1 h-12 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {purchaseLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                이동 중...
              </>
            ) : (
              <>
                쿠팡에서 구매
                <ExternalLink size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 알림 설정 바텀시트 */}
      <BottomSheet
        isOpen={showAlertModal && !!product}
        onClose={() => setShowAlertModal(false)}
        title="가격 알림 설정"
      >
        {product && (
          <div className="p-4 pb-8">
            {/* 상품 정보 */}
            <div className="flex gap-3 mb-6">
              <div className="relative w-16 h-16 bg-[#f8f9fa] rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#191f28] line-clamp-2">{product.productName}</p>
                <p className="text-[15px] font-bold text-[#191f28] mt-1">
                  현재 {formatPrice(product.productPrice)}원
                </p>
              </div>
            </div>

            {/* 목표 가격 입력 */}
            <div className="mb-6">
              <label className="block text-[14px] font-medium text-[#191f28] mb-2">
                목표 가격
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[#f2f4f6] rounded-xl text-[16px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#3182f6]"
                  min={1}
                  max={product.productPrice - 1}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c6470]">원</span>
              </div>
              <p className="text-[12px] text-[#5c6470] mt-2">
                현재 가격보다 {formatPrice(product.productPrice - targetPrice)}원 낮은 가격 (
                {Math.round(((product.productPrice - targetPrice) / product.productPrice) * 100)}% 할인)
              </p>
            </div>

            {/* 빠른 선택 버튼 */}
            <div className="flex gap-2 mb-6">
              {[5, 10, 15, 20].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setTargetPrice(Math.round(product.productPrice * (1 - percent / 100)))}
                  className={`flex-1 py-2.5 text-[13px] rounded-lg transition-colors ${
                    Math.round(((product.productPrice - targetPrice) / product.productPrice) * 100) === percent
                      ? 'bg-[#3182f6] text-white'
                      : 'bg-[#f2f4f6] text-[#4e5968] hover:bg-[#e5e8eb]'
                  }`}
                >
                  {percent}% 할인
                </button>
              ))}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              {isAlertOn && (
                <button
                  onClick={handleAlertDelete}
                  className="flex-1 py-3.5 bg-[#f2f4f6] text-[#c92a2a] rounded-xl font-medium hover:bg-red-50"
                >
                  알림 해제
                </button>
              )}
              <button
                onClick={handleAlertSubmit}
                disabled={alertLoading || targetPrice >= product.productPrice}
                className="flex-1 py-3.5 bg-[#3182f6] text-white rounded-xl font-medium hover:bg-[#1b64da] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {alertLoading ? '설정 중...' : isAlertOn ? '알림 수정' : '알림 설정'}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
