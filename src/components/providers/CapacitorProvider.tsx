'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

interface CapacitorContextType {
  isNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isReady: boolean;
  platform: string;
}

const CapacitorContext = createContext<CapacitorContextType>({
  isNative: false,
  isIOS: false,
  isAndroid: false,
  isReady: false,
  platform: 'web',
});

export const useCapacitor = () => useContext(CapacitorContext);

interface CapacitorProviderProps {
  children: ReactNode;
}

export default function CapacitorProvider({ children }: CapacitorProviderProps) {
  const [isReady, setIsReady] = useState(false);

  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();
  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';

  useEffect(() => {
    async function initializeCapacitor() {
      if (!isNative) {
        setIsReady(true);
        return;
      }

      try {
        // 1. 상태바 설정
        if (Capacitor.isPluginAvailable('StatusBar')) {
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          await StatusBar.setStyle({ style: Style.Light });

          if (isAndroid) {
            await StatusBar.setBackgroundColor({ color: '#ffffff' });
          }
        }

        // 2. 스플래시 스크린 숨기기
        if (Capacitor.isPluginAvailable('SplashScreen')) {
          const { SplashScreen } = await import('@capacitor/splash-screen');
          await SplashScreen.hide();
        }

        // 3. 키보드 설정
        if (Capacitor.isPluginAvailable('Keyboard')) {
          const { Keyboard } = await import('@capacitor/keyboard');

          Keyboard.addListener('keyboardWillShow', () => {
            document.body.classList.add('keyboard-visible');
          });

          Keyboard.addListener('keyboardWillHide', () => {
            document.body.classList.remove('keyboard-visible');
          });
        }

        // 4. 푸시 알림 초기화
        if (Capacitor.isPluginAvailable('PushNotifications')) {
          const { initPushNotifications, createNotificationChannel } = await import('@/lib/capacitor/push');
          await createNotificationChannel();
          await initPushNotifications({
            onNotificationAction: (action) => {
              // 알림 클릭 시 해당 페이지로 이동
              const data = action.notification.data;
              if (data?.url) {
                window.location.href = data.url;
              }
            },
          });
        }

        // 5. 로컬 알림 액션 타입 등록
        if (Capacitor.isPluginAvailable('LocalNotifications')) {
          const { registerActionTypes } = await import('@/lib/capacitor/local-notifications');
          await registerActionTypes();
        }

        // 6. 앱 상태 리스너
        if (Capacitor.isPluginAvailable('App')) {
          const { addAppStateListener, addDeepLinkListener, handleDeepLink } = await import('@/lib/capacitor/app-state');

          addAppStateListener((state) => {
            if (state.isActive) {
              // 앱이 포그라운드로 돌아올 때
              console.log('[App] 포그라운드 전환');
            }
          });

          addDeepLinkListener((url) => {
            console.log('[App] 딥링크:', url);
            handleDeepLink(url);
          });
        }

        // 7. 네트워크 상태 리스너
        if (Capacitor.isPluginAvailable('Network')) {
          const { addNetworkListener } = await import('@/lib/capacitor/index');

          addNetworkListener((status) => {
            if (!status.connected) {
              // 오프라인 상태 UI 표시
              document.body.classList.add('offline');
            } else {
              document.body.classList.remove('offline');
            }
          });
        }

        console.log('[Capacitor] 초기화 완료');
      } catch (error) {
        console.error('[Capacitor] 초기화 실패:', error);
      } finally {
        setIsReady(true);
      }
    }

    initializeCapacitor();
  }, [isNative, isIOS, isAndroid]);

  // Android 백버튼 처리
  useEffect(() => {
    if (!isAndroid) return;

    async function setupBackButton() {
      const { addBackButtonListener, exitApp } = await import('@/lib/capacitor/app-state');

      addBackButtonListener(() => {
        // 메인 페이지에서는 앱 종료
        if (window.location.pathname === '/') {
          exitApp();
        } else {
          // 그 외에는 뒤로가기
          window.history.back();
        }
      });
    }

    setupBackButton();
  }, [isAndroid]);

  return (
    <CapacitorContext.Provider
      value={{
        isNative,
        isIOS,
        isAndroid,
        isReady,
        platform,
      }}
    >
      {children}
    </CapacitorContext.Provider>
  );
}
