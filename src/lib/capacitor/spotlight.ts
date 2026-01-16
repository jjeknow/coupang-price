/**
 * iOS Spotlight 검색 연동
 * 앱 콘텐츠를 시스템 검색에 노출
 */

import { Capacitor } from '@capacitor/core';

export interface SpotlightItem {
  uniqueIdentifier: string;
  domainIdentifier: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  keywords?: string[];
  contentType?: string;
}

// Spotlight 검색 가능 여부
export function isSpotlightAvailable(): boolean {
  return Capacitor.getPlatform() === 'ios';
}

// 상품을 Spotlight에 인덱싱
export async function indexProduct(product: {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
}): Promise<void> {
  if (!isSpotlightAvailable()) return;

  try {
    // Capacitor에는 기본 Spotlight 플러그인이 없어서
    // 웹뷰에서 Native에 메시지를 보내는 방식으로 구현
    // 실제로는 Swift 코드에서 처리해야 함

    const item: SpotlightItem = {
      uniqueIdentifier: `product-${product.id}`,
      domainIdentifier: 'com.ddokcheck.products',
      title: product.name,
      description: `${product.price.toLocaleString()}원`,
      thumbnailUrl: product.image,
      keywords: [
        product.name,
        product.category || '',
        '쿠팡',
        '최저가',
        '가격비교',
      ].filter(Boolean),
      contentType: 'public.item',
    };

    // 네이티브 브릿지를 통해 전달
    (window as unknown as { webkit?: { messageHandlers?: { spotlight?: { postMessage: (item: SpotlightItem) => void } } } }).webkit?.messageHandlers?.spotlight?.postMessage(item);

    console.log('[Spotlight] 인덱싱:', item.title);
  } catch (error) {
    console.error('[Spotlight] 인덱싱 실패:', error);
  }
}

// 여러 상품 일괄 인덱싱
export async function indexProducts(products: Array<{
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
}>): Promise<void> {
  if (!isSpotlightAvailable()) return;

  for (const product of products.slice(0, 50)) { // 최대 50개
    await indexProduct(product);
  }
}

// Spotlight 인덱스에서 항목 제거
export async function removeFromIndex(productId: number): Promise<void> {
  if (!isSpotlightAvailable()) return;

  try {
    (window as unknown as { webkit?: { messageHandlers?: { spotlightRemove?: { postMessage: (id: string) => void } } } }).webkit?.messageHandlers?.spotlightRemove?.postMessage(`product-${productId}`);
    console.log('[Spotlight] 인덱스 제거:', productId);
  } catch (error) {
    console.error('[Spotlight] 제거 실패:', error);
  }
}

// 모든 인덱스 삭제
export async function clearAllIndexes(): Promise<void> {
  if (!isSpotlightAvailable()) return;

  try {
    (window as unknown as { webkit?: { messageHandlers?: { spotlightClearAll?: { postMessage: (msg: string) => void } } } }).webkit?.messageHandlers?.spotlightClearAll?.postMessage('clear');
    console.log('[Spotlight] 모든 인덱스 삭제');
  } catch (error) {
    console.error('[Spotlight] 전체 삭제 실패:', error);
  }
}

// 즐겨찾기 상품 인덱싱
export async function indexFavoriteProducts(products: Array<{
  id: number;
  name: string;
  price: number;
  image?: string;
}>): Promise<void> {
  if (!isSpotlightAvailable()) return;

  for (const product of products) {
    await indexProduct({
      ...product,
      category: '관심상품',
    });
  }
}
