/**
 * 가격 수집 Cron API
 * Vercel Cron에서 매일 호출하여 가격 히스토리 저장
 *
 * 쿠팡 API 규제 준수:
 * - 분당 100회 제한 → 분당 12회만 호출 (12% 사용)
 * - 각 호출 사이 5초 딜레이
 * - 429/403 에러 시 즉시 중단
 * - Vercel 5분 타임아웃 내 완료 필요 (15카테고리 × 5초 = 75초 + 여유)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBestProducts, getGoldboxProducts, searchProducts, CATEGORIES } from '@/lib/coupang-api';

// Vercel Cron 시크릿 키
const CRON_SECRET = process.env.CRON_SECRET;

// 사용자 상품 수집 설정 (초안전 모드)
const USER_PRODUCTS_CONFIG = {
  maxProductsPerDay: 50,      // 일일 최대 50개
  delayBetweenCalls: 6000,    // 6초 간격 (10회/분)
  viewedWithinDays: 7,        // 7일 내 조회한 상품만
};

// 딜레이 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 안전한 API 호출 (에러 시 null 반환)
async function safeApiCall<T>(
  fn: () => Promise<T>,
  name: string
): Promise<T | null> {
  try {
    const result = await fn();
    console.log(`[Cron] ${name}: 성공`);
    return result;
  } catch (error) {
    console.error(`[Cron] ${name}: 실패`, error);

    // 429/403 에러면 즉시 중단 신호
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('403')) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
    }
    return null;
  }
}

// 상품 가격 저장
async function saveProductPrice(product: {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  categoryName?: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
}) {
  const coupangId = product.productId.toString();

  try {
    // 기존 상품 찾기 또는 생성
    const existingProduct = await prisma.product.findUnique({
      where: { coupangId },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (existingProduct) {
      // 오늘 이미 가격이 저장됐는지 확인
      const todayRecord = existingProduct.priceHistory.find(h => {
        const recordDate = new Date(h.createdAt);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      if (todayRecord) {
        // 오늘 이미 저장됨 - 가격이 변경됐으면 업데이트
        if (todayRecord.price !== product.productPrice) {
          await prisma.priceHistory.update({
            where: { id: todayRecord.id },
            data: { price: product.productPrice },
          });
        }
      } else {
        // 오늘 가격 새로 저장
        await prisma.priceHistory.create({
          data: {
            productId: existingProduct.id,
            price: product.productPrice,
          },
        });
      }

      // 통계 업데이트
      const allPrices = [
        ...existingProduct.priceHistory.map(h => h.price),
        product.productPrice,
      ];
      const lowestPrice = Math.min(...allPrices);
      const highestPrice = Math.max(...allPrices);
      const averagePrice = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);

      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: product.productName,
          imageUrl: product.productImage,
          productUrl: product.productUrl,
          currentPrice: product.productPrice,
          lowestPrice,
          highestPrice,
          averagePrice,
          isRocket: product.isRocket ?? false,
          isFreeShipping: product.isFreeShipping ?? false,
          categoryName: product.categoryName,
        },
      });
    } else {
      // 새 상품 생성
      await prisma.product.create({
        data: {
          coupangId,
          name: product.productName,
          imageUrl: product.productImage,
          productUrl: product.productUrl,
          currentPrice: product.productPrice,
          lowestPrice: product.productPrice,
          highestPrice: product.productPrice,
          averagePrice: product.productPrice,
          isRocket: product.isRocket ?? false,
          isFreeShipping: product.isFreeShipping ?? false,
          categoryName: product.categoryName,
          priceHistory: {
            create: {
              price: product.productPrice,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error(`[Cron] 상품 저장 실패 (${coupangId}):`, error);
  }
}

// 사용자 조회 상품 가격 수집
async function collectUserViewedProducts(
  results: {
    totalProducts: number;
    userProducts: number;
    errors: string[];
  },
  startTime: number
) {
  console.log('[Cron] 사용자 조회 상품 수집 시작...');

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - USER_PRODUCTS_CONFIG.viewedWithinDays);

  try {
    // 최근 7일 내 조회된 상품 중 카테고리 베스트/골드박스에 없는 상품
    // 즐겨찾기에 등록된 상품 우선
    const userProducts = await prisma.product.findMany({
      where: {
        lastViewedAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: [
        { lastViewedAt: 'desc' }, // 최근 조회순
      ],
      take: USER_PRODUCTS_CONFIG.maxProductsPerDay,
      select: {
        id: true,
        coupangId: true,
        name: true,
        currentPrice: true,
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    console.log(`[Cron] 사용자 조회 상품 ${userProducts.length}개 발견`);

    for (const product of userProducts) {
      // Vercel 5분 타임아웃 - 4분 30초에서 중단
      const elapsed = Date.now() - startTime;
      if (elapsed > 270000) {
        console.log('[Cron] 타임아웃 임박 - 사용자 상품 수집 중단');
        results.errors.push('Timeout approaching - stopped early');
        break;
      }

      try {
        // 상품명으로 검색하여 현재 가격 확인
        const searchResult = await safeApiCall(
          () => searchProducts(product.name, 1),
          `UserProduct ${product.coupangId}`
        );

        if (!searchResult || !searchResult.productData?.length) {
          continue;
        }

        // 검색 결과에서 같은 상품 찾기 (상품 ID 매칭)
        const foundProduct = searchResult.productData.find(
          p => p.productId.toString() === product.coupangId
        );

        if (foundProduct) {
          // 가격 저장
          await saveProductPrice({
            productId: foundProduct.productId,
            productName: foundProduct.productName,
            productPrice: foundProduct.productPrice,
            productImage: foundProduct.productImage,
            productUrl: foundProduct.productUrl,
            categoryName: foundProduct.categoryName,
            isRocket: foundProduct.isRocket,
            isFreeShipping: foundProduct.isFreeShipping,
          });

          results.userProducts++;
          results.totalProducts++;
        }

        // 6초 대기 (분당 10회, 20% 사용)
        await delay(USER_PRODUCTS_CONFIG.delayBetweenCalls);
      } catch (error) {
        if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
          results.errors.push('User products: Rate limit exceeded - 수집 중단');
          break;
        }
        // 개별 상품 에러는 계속 진행
        console.error(`[Cron] 사용자 상품 ${product.coupangId} 수집 실패:`, error);
      }
    }

    console.log(`[Cron] 사용자 조회 상품 수집 완료: ${results.userProducts}개`);
  } catch (error) {
    console.error('[Cron] 사용자 상품 수집 오류:', error);
    results.errors.push(`User products: ${error}`);
  }
}

export async function GET(request: NextRequest) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const results = {
    success: true,
    totalProducts: 0,
    categories: 0,
    goldbox: 0,
    userProducts: 0,
    errors: [] as string[],
    duration: 0,
  };

  try {
    console.log('[Cron] 가격 수집 시작:', new Date().toISOString());

    // 1. 골드박스 수집
    const goldboxProducts = await safeApiCall(
      () => getGoldboxProducts(),
      'Goldbox'
    );

    if (goldboxProducts) {
      // 병렬로 저장 (5개씩 배치)
      const batchSize = 5;
      for (let i = 0; i < goldboxProducts.length; i += batchSize) {
        const batch = goldboxProducts.slice(i, i + batchSize);
        await Promise.all(batch.map(product => saveProductPrice(product)));
        results.goldbox += batch.length;
        results.totalProducts += batch.length;
      }
    }

    // 5초 대기
    await delay(5000);

    // 2. 카테고리별 베스트 상품 수집 (상위 100개씩)
    const categoryIds = Object.keys(CATEGORIES).map(Number);

    for (const categoryId of categoryIds) {
      try {
        const products = await safeApiCall(
          () => getBestProducts(categoryId, 100),
          `Category ${categoryId}`
        );

        if (products) {
          // 병렬로 저장 (10개씩 배치)
          const batchSize = 10;
          for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            await Promise.all(batch.map(product => saveProductPrice({
              ...product,
              categoryName: CATEGORIES[categoryId],
            })));
            results.totalProducts += batch.length;
          }
          results.categories++;
        }

        // 각 카테고리 사이 5초 대기 (분당 12회, 5분 타임아웃 내 완료)
        await delay(5000);
      } catch (error) {
        if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
          results.errors.push('Rate limit exceeded - 수집 중단');
          results.success = false;
          break;
        }
        results.errors.push(`Category ${categoryId}: ${error}`);
      }
    }

    // 가격 히스토리는 삭제하지 않음 (장기 추이 분석용)

    // 3. 사용자 조회 상품 가격 수집 (초안전 모드)
    await collectUserViewedProducts(results, startTime);

    results.duration = Date.now() - startTime;
    console.log('[Cron] 가격 수집 완료:', results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('[Cron] 가격 수집 실패:', error);
    results.success = false;
    results.errors.push(String(error));
    results.duration = Date.now() - startTime;

    return NextResponse.json(results, { status: 500 });
  }
}
