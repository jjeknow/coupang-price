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
export async function openCoupangProduct(productUrl: string): Promise<void> {
  await openInAppBrowser({
    url: productUrl,
    toolbarColor: '#e5243b', // 쿠팡 색상
  });
}

// 외부 앱으로 URL 열기
export async function openExternal(url: string): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { App } = await import('@capacitor/app');
      // iOS에서는 시스템이 적절한 앱으로 열어줌
      window.open(url, '_system');
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
