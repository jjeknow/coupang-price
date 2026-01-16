import { NextRequest, NextResponse } from 'next/server';
import { createDeeplink } from '@/lib/coupang-api';

/**
 * 쿠팡 딥링크 생성 API
 *
 * 상품 ID를 받아 쿠팡 파트너스 딥링크를 생성합니다.
 * 기존 URL이 만료되었을 때 새로운 어필리에이트 링크를 생성하는 데 사용됩니다.
 */
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

    // 상품 URL이 있으면 그대로 사용, 없으면 상품 ID로 URL 생성
    let targetUrl = productUrl;
    if (!targetUrl && productId) {
      targetUrl = `https://www.coupang.com/vp/products/${productId}`;
    }

    // 딥링크 생성
    const result = await createDeeplink([targetUrl]);

    if (result && result.length > 0) {
      const deeplink = result[0];
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

    // 에러 발생 시에도 원본 쿠팡 URL로 폴백
    const body = await request.json().catch(() => ({}));
    const fallbackUrl = body.productUrl ||
      (body.productId ? `https://www.coupang.com/vp/products/${body.productId}` : '');

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
