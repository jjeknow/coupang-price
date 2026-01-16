/**
 * iOS 네이티브 공유 기능
 * 시스템 공유 시트 사용
 */

import { Capacitor } from '@capacitor/core';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}

// 네이티브 공유
export async function share(options: ShareOptions): Promise<boolean> {
  try {
    // 네이티브 앱
    if (Capacitor.isNativePlatform()) {
      const { Share } = await import('@capacitor/share');

      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || '공유하기',
      });
      return true;
    }

    // 웹 (Web Share API)
    if (navigator.share) {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    }

    // 폴백: 클립보드 복사
    const shareText = options.url || options.text || '';
    await navigator.clipboard.writeText(shareText);
    return true;
  } catch (error) {
    // 사용자가 취소한 경우
    if ((error as Error).name === 'AbortError') {
      return false;
    }
    console.error('[Share] 공유 실패:', error);
    return false;
  }
}

// 상품 공유
export async function shareProduct(product: {
  name: string;
  price: number;
  url: string;
}): Promise<boolean> {
  const priceText = product.price.toLocaleString('ko-KR');

  return share({
    title: product.name,
    text: `${product.name}\n현재가: ${priceText}원\n\n똑체크에서 최저가를 확인해보세요!`,
    url: product.url,
    dialogTitle: '상품 공유',
  });
}

// 앱 공유
export async function shareApp(): Promise<boolean> {
  return share({
    title: '똑체크 - 쿠팡 가격변동 알림',
    text: '쿠팡 가격변동을 실시간으로 추적하고 최저가 알림을 받아보세요!',
    url: 'https://ddokcheck.com',
    dialogTitle: '앱 공유',
  });
}

// 공유 가능 여부 확인
export async function canShare(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    return Capacitor.isPluginAvailable('Share');
  }
  return !!navigator.share;
}
