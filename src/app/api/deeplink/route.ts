import { NextRequest, NextResponse } from 'next/server';
import { createDeeplink } from '@/lib/coupang-api';
import prisma from '@/lib/prisma';

/**
 * 쿠팡 딥링크 생성 API
 *
 * 상품 ID를 받아 쿠팡 파트너스 딥링크를 생성합니다.
 * DB 캐싱으로 API 호출을 최소화합니다.
 *
 * 캐싱 정책:
 * - 같은 productId에 대한 딥링크는 12시간 DB에 캐싱됩니다 (딥링크 24시간 유효)
 * - API 호출 제한: 분당 100회
 */

// 캐시 만료 시간: 12시간 (딥링크는 24시간 유효, 안전 마진 확보)
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productUrl } = body;

    if (!productId && !productUrl) {
      return NextResponse.json(
        { error: 'productId 또는 productUrl이 필요합니다.' },
        { status: 400 }
      );
    }

    // productId 추출
    let resolvedProductId: string;
    if (productId) {
      resolvedProductId = String(productId);
    } else if (productUrl) {
      const match = productUrl.match(/products\/(\d+)/);
      if (match) {
        resolvedProductId = match[1];
      } else {
        resolvedProductId = '';
      }
    } else {
      resolvedProductId = '';
    }

    // DB 캐시에서 확인 (5분 이내면 캐시된 링크 반환)
    if (resolvedProductId) {
      try {
        const cached = await prisma.deeplinkCache.findUnique({
          where: { productId: resolvedProductId },
        });

        if (cached && cached.expiresAt > new Date()) {
          return NextResponse.json({
            success: true,
            cached: true,
            data: {
              originalUrl: `https://www.coupang.com/vp/products/${resolvedProductId}`,
              shortenUrl: cached.shortenUrl,
              landingUrl: cached.landingUrl,
            },
          });
        }
      } catch (cacheError) {
        // 캐시 조회 실패해도 계속 진행
        console.error('Cache lookup error:', cacheError);
      }
    }

    // 새 URL 생성
    const targetUrl = resolvedProductId
      ? `https://www.coupang.com/vp/products/${resolvedProductId}`
      : productUrl;

    // 딥링크 생성
    const result = await createDeeplink([targetUrl]);

    if (result && result.length > 0) {
      const deeplink = result[0];

      // DB 캐시에 저장 (5분)
      if (resolvedProductId) {
        try {
          await prisma.deeplinkCache.upsert({
            where: { productId: resolvedProductId },
            update: {
              shortenUrl: deeplink.shortenUrl,
              landingUrl: deeplink.landingUrl,
              expiresAt: new Date(Date.now() + CACHE_TTL_MS),
            },
            create: {
              productId: resolvedProductId,
              shortenUrl: deeplink.shortenUrl,
              landingUrl: deeplink.landingUrl,
              expiresAt: new Date(Date.now() + CACHE_TTL_MS),
            },
          });
        } catch (cacheError) {
          // 캐시 저장 실패해도 응답은 반환
          console.error('Cache save error:', cacheError);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          originalUrl: deeplink.originalUrl,
          shortenUrl: deeplink.shortenUrl,
          landingUrl: deeplink.landingUrl,
        },
      });
    }

    // 딥링크 생성 실패 시 원본 URL 반환
    return NextResponse.json({
      success: true,
      data: {
        originalUrl: targetUrl,
        shortenUrl: targetUrl,
        landingUrl: targetUrl,
      },
    });
  } catch (error) {
    console.error('Deeplink API Error:', error);

    // 에러 발생 시에도 쿠팡 상품 페이지 URL로 폴백
    let fallbackUrl = '';
    try {
      const body = await request.clone().json();
      if (body.productId) {
        fallbackUrl = `https://www.coupang.com/vp/products/${body.productId}`;
      } else if (body.productUrl) {
        const match = body.productUrl.match(/products\/(\d+)/);
        fallbackUrl = match
          ? `https://www.coupang.com/vp/products/${match[1]}`
          : `https://www.coupang.com`;
      }
    } catch {
      fallbackUrl = 'https://www.coupang.com';
    }

    return NextResponse.json({
      success: false,
      error: '딥링크 생성에 실패했습니다.',
      data: {
        originalUrl: fallbackUrl,
        shortenUrl: fallbackUrl,
        landingUrl: fallbackUrl,
      },
    });
  }
}
