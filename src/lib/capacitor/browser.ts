/**
 * iOS 인앱 브라우저
 * Safari View Controller 사용 (Apple 권장)
 */

import { Capacitor } from '@capacitor/core';

export interface BrowserOptions {
  url: string;
  toolbarColor?: string;
  presentationStyle?: 'fullscreen' | 'popover';
}

// 인앱 브라우저로 URL 열기
export async function openInAppBrowser(options: BrowserOptions): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Browser } = await import('@capacitor/browser');

      await Browser.open({
        url: options.url,
        toolbarColor: options.toolbarColor || '#ffffff',
        presentationStyle: options.presentationStyle || 'fullscreen',
      });
    } else {
      // 웹에서는 새 탭으로 열기
      window.open(options.url, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('[Browser] 열기 실패:', error);
    // 폴백
    window.open(options.url, '_blank');
  }
}

// 인앱 브라우저 닫기
export async function closeInAppBrowser(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { Browser } = await import('@capacitor/browser');
    await Browser.close();
  } catch (error) {
    console.error('[Browser] 닫기 실패:', error);
  }
}

// 쿠팡 상품 페이지 열기 (파트너스 링크)
// Universal Links/App Links가 작동하려면 직접 이동해야 함
// 쿠팡 앱이 설치되어 있으면 자동으로 앱으로 열림
export async function openCoupangProduct(productUrl: string): Promise<void> {
  // 앱/웹 모두 location.href로 이동 (모바일 웹에서도 쿠팡 앱 연동)
  window.location.href = productUrl;
}

// 외부 앱으로 URL 열기
export async function openExternal(url: string): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      // iOS/Android: 시스템이 적절한 앱으로 열어줌
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('[Browser] 외부 열기 실패:', error);
  }
}

// 브라우저 이벤트 리스너
export async function addBrowserListeners(handlers: {
  onFinished?: () => void;
  onLoaded?: () => void;
}) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { Browser } = await import('@capacitor/browser');

    if (handlers.onFinished) {
      Browser.addListener('browserFinished', handlers.onFinished);
    }
    if (handlers.onLoaded) {
      Browser.addListener('browserPageLoaded', handlers.onLoaded);
    }
  } catch (error) {
    console.error('[Browser] 리스너 등록 실패:', error);
  }
}
