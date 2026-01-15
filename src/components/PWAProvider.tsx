'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker 등록 성공:', registration.scope);

          // 업데이트 확인
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 새 버전 사용 가능
                  console.log('새 버전이 사용 가능합니다.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker 등록 실패:', error);
        });
    }

    // PWA 설치 프롬프트 캡처
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 이전에 배너를 닫지 않았다면 표시
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowInstallBanner(true), 3000);
      }
    };

    // 온라인/오프라인 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 초기 상태 설정
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA 설치됨');
    }

    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <>
      {children}

      {/* PWA 설치 배너 */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-[#e5e8eb] p-4 z-50 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-[#3182f6] rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-[#191f28] mb-1">
                앱으로 설치하기
              </h3>
              <p className="text-[13px] text-[#6b7684] mb-3">
                홈 화면에 추가하고 더 빠르게 이용하세요
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-2.5 bg-[#3182f6] text-white rounded-lg text-[13px] font-medium hover:bg-[#1b64da] active:scale-[0.98] transition-all"
                >
                  설치하기
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 bg-[#f2f4f6] text-[#4e5968] rounded-lg text-[13px] font-medium hover:bg-[#e5e8eb] active:scale-[0.98] transition-all"
                >
                  나중에
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-[#6b7684] hover:text-[#4e5968] p-1"
              aria-label="닫기"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 오프라인 알림 */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 bg-[#191f28] text-white rounded-xl p-4 shadow-lg z-50 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff8b00]/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[#ff8b00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium">오프라인 상태</p>
              <p className="text-[12px] text-[#6b7684]">인터넷 연결을 확인해주세요</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
