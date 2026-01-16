/**
 * iOS 네이티브 저장소
 * UserDefaults 사용 (웹보다 안전하고 빠름)
 */

import { Capacitor } from '@capacitor/core';

// 값 저장
export async function setPreference(key: string, value: string): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('[Preferences] 저장 실패:', error);
    // 폴백
    localStorage.setItem(key, value);
  }
}

// 값 가져오기
export async function getPreference(key: string): Promise<string | null> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import('@capacitor/preferences');
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error('[Preferences] 조회 실패:', error);
    return localStorage.getItem(key);
  }
}

// 값 삭제
export async function removePreference(key: string): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('[Preferences] 삭제 실패:', error);
    localStorage.removeItem(key);
  }
}

// 모든 값 삭제
export async function clearPreferences(): Promise<void> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  } catch (error) {
    console.error('[Preferences] 전체 삭제 실패:', error);
  }
}

// 모든 키 가져오기
export async function getPreferenceKeys(): Promise<string[]> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Preferences } = await import('@capacitor/preferences');
      const { keys } = await Preferences.keys();
      return keys;
    } else {
      return Object.keys(localStorage);
    }
  } catch (error) {
    console.error('[Preferences] 키 조회 실패:', error);
    return Object.keys(localStorage);
  }
}

// JSON 객체 저장
export async function setJsonPreference<T>(key: string, value: T): Promise<void> {
  await setPreference(key, JSON.stringify(value));
}

// JSON 객체 가져오기
export async function getJsonPreference<T>(key: string): Promise<T | null> {
  const value = await getPreference(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

// ===== 앱 전용 헬퍼 함수들 =====

// 최근 본 상품 저장
export async function addRecentProduct(productId: number): Promise<void> {
  const recent = await getJsonPreference<number[]>('recentProducts') || [];
  const updated = [productId, ...recent.filter(id => id !== productId)].slice(0, 20);
  await setJsonPreference('recentProducts', updated);
}

// 최근 본 상품 가져오기
export async function getRecentProducts(): Promise<number[]> {
  return await getJsonPreference<number[]>('recentProducts') || [];
}

// 알림 설정 저장
export async function setNotificationSettings(settings: {
  priceAlert: boolean;
  lowestPrice: boolean;
  dailyDigest: boolean;
}): Promise<void> {
  await setJsonPreference('notificationSettings', settings);
}

// 알림 설정 가져오기
export async function getNotificationSettings(): Promise<{
  priceAlert: boolean;
  lowestPrice: boolean;
  dailyDigest: boolean;
}> {
  return await getJsonPreference('notificationSettings') || {
    priceAlert: true,
    lowestPrice: true,
    dailyDigest: false,
  };
}

// 온보딩 완료 여부
export async function isOnboardingComplete(): Promise<boolean> {
  const value = await getPreference('onboardingComplete');
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await setPreference('onboardingComplete', 'true');
}
