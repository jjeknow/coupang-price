import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://ddokcheck.com';
const SITE_NAME = '똑체크 - 쿠팡 최저가 알림';
const SITE_DESCRIPTION = '쿠팡 상품의 가격 변동을 추적하고 최저가 알림을 받아보세요. 똑똑한 쇼핑의 시작!';

// 카테고리 정보
const categories = [
  { id: '1012', name: '식품' },
  { id: '1014', name: '생활용품' },
  { id: '1010', name: '뷰티' },
  { id: '1016', name: '가전디지털' },
  { id: '1013', name: '주방용품' },
  { id: '1001', name: '여성패션' },
  { id: '1002', name: '남성패션' },
  { id: '1017', name: '스포츠/레저' },
  { id: '1024', name: '헬스/건강식품' },
  { id: '1029', name: '반려동물용품' },
  { id: '1011', name: '출산/유아동' },
  { id: '1015', name: '홈인테리어' },
  { id: '1020', name: '완구/취미' },
  { id: '1018', name: '자동차용품' },
  { id: '1019', name: '도서/음반' },
  { id: '1021', name: '문구/오피스' },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createSlug(productName: string): string {
  return productName
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .toLowerCase();
}

export async function GET() {
  const now = new Date().toUTCString();

  try {
    // 최근 가격 변동이 있는 상품 조회
    const products = await prisma.product.findMany({
      where: {
        priceHistory: { some: {} },
      },
      orderBy: { updatedAt: 'desc' },
      take: 30,
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 2,
        },
      },
    });

    // 상품 RSS 아이템 생성
    const productItems = products.map((product) => {
      const currentPrice = product.currentPrice;
      const previousPrice = product.priceHistory[1]?.price || currentPrice;
      const priceChange = currentPrice - previousPrice;
      const priceChangePercent = previousPrice > 0
        ? Math.round(Math.abs(priceChange / previousPrice) * 100)
        : 0;

      const priceStatus = priceChange < 0
        ? `🔻 ${priceChangePercent}% 가격 하락`
        : priceChange > 0
        ? `🔺 ${priceChangePercent}% 가격 상승`
        : '➡️ 가격 유지';

      const slug = createSlug(product.name);

      return `
    <item>
      <title><![CDATA[${product.name} - ${priceStatus}]]></title>
      <link>${SITE_URL}/product/${slug}-${product.coupangId}</link>
      <guid isPermaLink="true">${SITE_URL}/product/${product.coupangId}</guid>
      <description><![CDATA[
현재가: ${currentPrice.toLocaleString()}원
${priceChange !== 0 ? `이전가: ${previousPrice.toLocaleString()}원 (${priceChange > 0 ? '+' : ''}${priceChangePercent}%)` : ''}
${product.lowestPrice ? `역대 최저가: ${product.lowestPrice.toLocaleString()}원` : ''}
${product.isRocket ? '🚀 로켓배송' : ''}
      ]]></description>
      <pubDate>${new Date(product.updatedAt).toUTCString()}</pubDate>
      <category>${escapeXml(product.categoryName || '기타')}</category>
      ${product.imageUrl ? `<enclosure url="${escapeXml(product.imageUrl)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    }).join('');

    // 카테고리 RSS 아이템 생성
    const categoryItems = categories.map((category) => `
    <item>
      <title>${escapeXml(category.name)} 베스트 상품 - 똑체크</title>
      <link>${SITE_URL}/category/${category.id}</link>
      <description>쿠팡 ${escapeXml(category.name)} 카테고리의 인기 상품을 확인하고 최저가 알림을 설정하세요.</description>
      <category>${escapeXml(category.name)}</category>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/category/${category.id}</guid>
    </item>`).join('');

    // 메인 페이지 아이템
    const mainItem = `
    <item>
      <title>오늘의 골드박스 특가 - 똑체크</title>
      <link>${SITE_URL}</link>
      <description>쿠팡 골드박스 특가 상품을 확인하세요. 매일 업데이트되는 최저가 상품!</description>
      <category>골드박스</category>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/#goldbox-${new Date().toISOString().split('T')[0]}</guid>
    </item>`;

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ko-KR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icon-512.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} 똑체크. All rights reserved.</copyright>
    <managingEditor>support@ddokcheck.com (똑체크)</managingEditor>
    <webMaster>support@ddokcheck.com (똑체크)</webMaster>
    <category>쇼핑</category>
    <category>가격비교</category>
    <category>쿠팡</category>
    <generator>똑체크 RSS Generator v2.0</generator>
    ${mainItem}
    ${productItems}
    ${categoryItems}
  </channel>
</rss>`;

    return new NextResponse(rss.trim(), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
      },
    });
  } catch (error) {
    console.error('RSS 생성 오류:', error);

    // 에러 시 카테고리만 포함하는 기본 RSS
    const fallbackItems = categories.map((category) => `
    <item>
      <title>${escapeXml(category.name)} 베스트 상품 - 똑체크</title>
      <link>${SITE_URL}/category/${category.id}</link>
      <description>쿠팡 ${escapeXml(category.name)} 카테고리의 인기 상품을 확인하세요.</description>
      <category>${escapeXml(category.name)}</category>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/category/${category.id}</guid>
    </item>`).join('');

    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ko-KR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
    ${fallbackItems}
  </channel>
</rss>`;

    return new NextResponse(fallbackRss.trim(), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}
