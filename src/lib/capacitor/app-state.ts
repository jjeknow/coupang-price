/**
 * iOS 앱 상태 관리
 * 백그라운드/포그라운드 전환, 딥링크 처리
 */

import { Capacitor } from '@capacitor/core';

export type AppState = 'active' | 'inactive' | 'background';

// 앱 상태 변경 리스너
export async function addAppStateListener(
  callback: (state: { isActive: boolean }) => void
): Promise<(() => void) | undefined> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { App } = await import('@capacitor/app');
    const handle = await App.addListener('appStateChange', callback);
    return () => handle.remove();
  } catch (error) {
    console.error('[App] 상태 리스너 등록 실패:', error);
    return undefined;
  }
}

// 딥링크 리스너
export async function addDeepLinkListener(
  callback: (url: string) => void
): Promise<(() => void) | undefined> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { App } = await import('@capacitor/app');
    const handle = await App.addListener('appUrlOpen', (event) => {
      callback(event.url);
    });
    return () => handle.remove();
  } catch (error) {
    console.error('[App] 딥링크 리스너 등록 실패:', error);
    return undefined;
  }
}

// 백버튼 리스너 (Android)
export async function addBackButtonListener(
  callback: () => void
): Promise<(() => void) | undefined> {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    const { App } = await import('@capacitor/app');
    const handle = await App.addListener('backButton', callback);
    return () => handle.remove();
  } catch (error) {
    console.error('[App] 백버튼 리스너 등록 실패:', error);
    return undefined;
  }
}

// 앱 정보 가져오기
export async function getAppInfo() {
  if (!Capacitor.isNativePlatform()) {
    return {
      name: '똑체크',
      id: 'com.ddokcheck.app',
      build: '1',
      version: '1.0.0',
    };
  }

  try {
    const { App } = await import('@capacitor/app');
    return App.getInfo();
  } catch (error) {
    console.error('[App] 정보 조회 실패:', error);
    return null;
  }
}

// 앱 최소화 (Android)
export async function minimizeApp(): Promise<void> {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    const { App } = await import('@capacitor/app');
    await App.minimizeApp();
  } catch (error) {
    console.error('[App] 최소화 실패:', error);
  }
}

// 앱 종료 (Android)
export async function exitApp(): Promise<void> {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    const { App } = await import('@capacitor/app');
    await App.exitApp();
  } catch (error) {
    console.error('[App] 종료 실패:', error);
  }
}

// 딥링크 URL 파싱
export function parseDeepLink(url: string): {
  path: string;
  params: Record<string, string>;
} | null {
  try {
    // ddokcheck://product/12345
    // https://ddokcheck.com/product/12345
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const params: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return { path, params };
  } catch {
    return null;
  }
}

// 딥링크 라우팅
export function handleDeepLink(url: string): void {
  const parsed = parseDeepLink(url);
  if (!parsed) return;

  const { path } = parsed;

  // 상품 페이지
  if (path.startsWith('/product/')) {
    const productId = path.split('/')[2];
    if (productId) {
      window.location.href = `/product/${productId}`;
    }
  }
  // 검색
  else if (path.startsWith('/search')) {
    const query = parsed.params.q;
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  }
  // 카테고리
  else if (path.startsWith('/category/')) {
    const categoryId = path.split('/')[2];
    if (categoryId) {
      window.location.href = `/category/${categoryId}`;
    }
  }
  // 기본
  else {
    window.location.href = path || '/';
  }
}
