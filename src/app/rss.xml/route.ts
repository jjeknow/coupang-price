/**
 * RSS 피드 생성 API
 * 네이버 SEO 최적화를 위한 RSS 2.0 피드
 *
 * 네이버 가이드라인:
 * - RSS 피드에 본문 전체를 포함
 * - 최신 콘텐츠 포함
 * - 유효한 RSS 2.0 형식
 */

import { NextResponse } from 'next/server';
import { getGoldboxProducts, CATEGORIES, getBestProducts, CoupangProduct } from '@/lib/coupang-api';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';
const SITE_TITLE = '쿠팡 최저가';
const SITE_DESCRIPTION = '쿠팡 상품의 실시간 가격 변동을 추적하고 역대 최저가 알림을 받으세요.';

// 가격 포맷팅 함수
function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

// HTML 특수문자 이스케이프
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// CDATA로 감싸기
function cdata(content: string): string {
  return `<![CDATA[${content}]]>`;
}

export async function GET() {
  try {
    // 골드박스 상품 가져오기 (최신 특가)
    let goldboxProducts: CoupangProduct[] = [];
    try {
      goldboxProducts = await getGoldboxProducts('230x230');
    } catch (error) {
      console.error('RSS: Failed to fetch goldbox products:', error);
    }

    // 베스트 카테고리 상품 (가전디지털) 가져오기
    let bestProducts: CoupangProduct[] = [];
    try {
      bestProducts = await getBestProducts(1016, 10, '230x230');
    } catch (error) {
      console.error('RSS: Failed to fetch best products:', error);
    }

    const now = new Date();
    const pubDate = now.toUTCString();

    // RSS 아이템 생성
    const rssItems: string[] = [];

    // 골드박스 상품을 RSS 아이템으로 변환
    goldboxProducts.slice(0, 20).forEach((product, index) => {
      const itemDate = new Date(now.getTime() - index * 60000); // 1분씩 차이
      const productUrl = `${BASE_URL}/product/${product.productId}`;

      const description = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          <img src="${product.productImage}" alt="${escapeXml(product.productName)}" style="max-width: 230px; margin-bottom: 16px;" />
          <h2>${escapeXml(product.productName)}</h2>
          <p style="font-size: 24px; font-weight: bold; color: #3182f6;">
            ${formatPrice(product.productPrice)}
          </p>
          ${product.isRocket ? '<span style="background: #3182f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">로켓배송</span>' : ''}
          <p style="margin-top: 16px;">
            <a href="${product.productUrl}" style="color: #3182f6; text-decoration: none;">쿠팡에서 구매하기 →</a>
          </p>
          <p style="color: #8b95a1; font-size: 12px; margin-top: 16px;">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>
      `.trim();

      rssItems.push(`
    <item>
      <title>${cdata(`[골드박스] ${product.productName}`)}</title>
      <link>${productUrl}</link>
      <guid isPermaLink="true">${productUrl}</guid>
      <description>${cdata(description)}</description>
      <pubDate>${itemDate.toUTCString()}</pubDate>
      <category>${cdata(product.categoryName || '골드박스')}</category>
      <enclosure url="${product.productImage}" type="image/jpeg" length="0" />
    </item>`);
    });

    // 베스트 상품을 RSS 아이템으로 변환
    bestProducts.slice(0, 10).forEach((product, index) => {
      const itemDate = new Date(now.getTime() - (20 + index) * 60000);
      const productUrl = `${BASE_URL}/product/${product.productId}`;

      const description = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          <img src="${product.productImage}" alt="${escapeXml(product.productName)}" style="max-width: 230px; margin-bottom: 16px;" />
          <h2>${escapeXml(product.productName)}</h2>
          <p style="font-size: 24px; font-weight: bold; color: #3182f6;">
            ${formatPrice(product.productPrice)}
          </p>
          ${product.isRocket ? '<span style="background: #3182f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">로켓배송</span>' : ''}
          <p style="margin-top: 16px;">
            <a href="${product.productUrl}" style="color: #3182f6; text-decoration: none;">쿠팡에서 구매하기 →</a>
          </p>
          <p style="color: #8b95a1; font-size: 12px; margin-top: 16px;">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>
      `.trim();

      rssItems.push(`
    <item>
      <title>${cdata(`[베스트] ${product.productName}`)}</title>
      <link>${productUrl}</link>
      <guid isPermaLink="true">${productUrl}</guid>
      <description>${cdata(description)}</description>
      <pubDate>${itemDate.toUTCString()}</pubDate>
      <category>${cdata(product.categoryName || '가전디지털')}</category>
      <enclosure url="${product.productImage}" type="image/jpeg" length="0" />
    </item>`);
    });

    // 카테고리 페이지들도 RSS 아이템으로 추가
    Object.entries(CATEGORIES).slice(0, 10).forEach(([categoryId, categoryName], index) => {
      const itemDate = new Date(now.getTime() - (30 + index) * 3600000); // 1시간씩 차이
      const categoryUrl = `${BASE_URL}/category/${categoryId}`;

      const description = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          <h2>${categoryName} 베스트 상품</h2>
          <p>쿠팡 ${categoryName} 카테고리의 인기 상품을 확인하세요.</p>
          <p>실시간 가격 변동 추적과 역대 최저가 알림 서비스를 제공합니다.</p>
          <p style="margin-top: 16px;">
            <a href="${categoryUrl}" style="color: #3182f6; text-decoration: none;">${categoryName} 상품 보기 →</a>
          </p>
        </div>
      `.trim();

      rssItems.push(`
    <item>
      <title>${cdata(`${categoryName} 베스트 상품 - 쿠팡 최저가`)}</title>
      <link>${categoryUrl}</link>
      <guid isPermaLink="true">${categoryUrl}</guid>
      <description>${cdata(description)}</description>
      <pubDate>${itemDate.toUTCString()}</pubDate>
      <category>${cdata(categoryName)}</category>
    </item>`);
    });

    // RSS XML 생성
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${cdata(SITE_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${cdata(SITE_DESCRIPTION)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <ttl>60</ttl>
    <generator>쿠팡 최저가 RSS Generator</generator>
    <copyright>Copyright ${now.getFullYear()} ${SITE_TITLE}</copyright>
    <managingEditor>noreply@coupang-price.vercel.app (쿠팡 최저가)</managingEditor>
    <webMaster>noreply@coupang-price.vercel.app (쿠팡 최저가)</webMaster>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>${SITE_TITLE}</title>
      <link>${BASE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems.join('')}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);

    // 오류 시에도 유효한 RSS 반환
    const errorRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>쿠팡 최저가</title>
    <link>${BASE_URL}</link>
    <description>쿠팡 상품의 실시간 가격 변동을 추적하고 역대 최저가 알림을 받으세요.</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

    return new NextResponse(errorRss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
