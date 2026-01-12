/**
 * 가격 수집 Cron API
 * Vercel Cron에서 매일 호출하여 가격 히스토리 저장
 *
 * 쿠팡 API 규제 준수:
 * - 분당 100회 제한 → 분당 12회만 호출 (12% 사용)
 * - 각 호출 사이 5초 딜레이
 * - 429/403 에러 시 즉시 중단
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBestProducts, getGoldboxProducts, CATEGORIES } from '@/lib/coupang-api';

// Vercel Cron 시크릿 키
const CRON_SECRET = process.env.CRON_SECRET;

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
      for (const product of goldboxProducts) {
        await saveProductPrice(product);
        results.goldbox++;
        results.totalProducts++;
      }
    }

    // 5초 대기
    await delay(5000);

    // 2. 카테고리별 베스트 상품 수집 (상위 10개씩만)
    const categoryIds = Object.keys(CATEGORIES).map(Number);

    for (const categoryId of categoryIds) {
      try {
        const products = await safeApiCall(
          () => getBestProducts(categoryId, 10),
          `Category ${categoryId}`
        );

        if (products) {
          for (const product of products) {
            await saveProductPrice({
              ...product,
              categoryName: CATEGORIES[categoryId],
            });
            results.totalProducts++;
          }
          results.categories++;
        }

        // 각 카테고리 사이 5초 대기 (분당 12회 유지)
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

    // 30일 이상 된 가격 히스토리 정리
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await prisma.priceHistory.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

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
