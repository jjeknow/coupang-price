import { NextResponse } from 'next/server';

const SITE_URL = 'https://ddokcheck.com';
const SITE_NAME = '똑체크 - 쿠팡 최저가 알림';
const SITE_DESCRIPTION = '쿠팡 상품의 가격 변동을 추적하고 최저가 알림을 받아보세요. 똑똑한 쇼핑의 시작!';

// 카테고리 정보
const categories = [
  { id: '1001', name: '여성패션', slug: 'women-fashion' },
  { id: '1002', name: '남성패션', slug: 'men-fashion' },
  { id: '1010', name: '뷰티', slug: 'beauty' },
  { id: '1020', name: '출산/유아동', slug: 'baby-kids' },
  { id: '1024', name: '식품', slug: 'food' },
  { id: '1025', name: '주방용품', slug: 'kitchen' },
  { id: '1026', name: '생활용품', slug: 'living' },
  { id: '1027', name: '홈인테리어', slug: 'interior' },
  { id: '1029', name: '가전디지털', slug: 'digital' },
  { id: '1030', name: '스포츠/레저', slug: 'sports' },
  { id: '1031', name: '자동차용품', slug: 'car' },
  { id: '1032', name: '도서/음반/DVD', slug: 'books' },
  { id: '1033', name: '완구/취미', slug: 'toys' },
  { id: '1034', name: '문구/오피스', slug: 'office' },
  { id: '1035', name: '반려동물용품', slug: 'pet' },
  { id: '1036', name: '헬스/건강식품', slug: 'health' },
];

export async function GET() {
  const now = new Date().toUTCString();

  // RSS 아이템 생성 (카테고리별 베스트 상품 페이지)
  const items = categories.map((category) => {
    return `
    <item>
      <title>${category.name} 베스트 상품 - 똑체크</title>
      <link>${SITE_URL}/category/${category.id}</link>
      <description>${category.name} 카테고리의 인기 상품을 확인하고 최저가 알림을 설정하세요.</description>
      <category>${category.name}</category>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/category/${category.id}</guid>
    </item>`;
  }).join('');

  // 메인 페이지 아이템 추가
  const mainItem = `
    <item>
      <title>오늘의 골드박스 특가 - 똑체크</title>
      <link>${SITE_URL}</link>
      <description>쿠팡 골드박스 특가 상품을 확인하세요. 매일 업데이트되는 최저가 상품!</description>
      <category>골드박스</category>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/#goldbox</guid>
    </item>`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ko-KR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icon-512.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
    ${mainItem}
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
