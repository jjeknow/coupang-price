/**
 * Capacitor 네이티브 기능 통합 모듈
 * App Store 심사 통과를 위한 iOS 네이티브 기능 구현
 */

import { Capacitor } from '@capacitor/core';

// 플랫폼 확인
export const isNative = Capacitor.isNativePlatform();
export const isIOS = Capacitor.getPlatform() === 'ios';
export const isAndroid = Capacitor.getPlatform() === 'android';
export const isWeb = Capacitor.getPlatform() === 'web';

// 네이티브 기능 사용 가능 여부
export function isPluginAvailable(pluginName: string): boolean {
  return Capacitor.isPluginAvailable(pluginName);
}

// 디바이스 정보
export async function getDeviceInfo() {
  if (!isNative) return null;

  const { Device } = await import('@capacitor/device');
  return Device.getInfo();
}

// 네트워크 상태
export async function getNetworkStatus() {
  const { Network } = await import('@capacitor/network');
  return Network.getStatus();
}

// 네트워크 상태 변경 리스너
export async function addNetworkListener(callback: (status: { connected: boolean }) => void) {
  const { Network } = await import('@capacitor/network');
  return Network.addListener('networkStatusChange', callback);
}
