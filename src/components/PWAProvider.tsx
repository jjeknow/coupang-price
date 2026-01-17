'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Download, Share, Wifi, WifiOff, ChevronUp, RefreshCw } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [splashFading, setSplashFading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Pull to Refresh 상태
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const PULL_THRESHOLD = 80;

  useEffect(() => {
    // 앱 모드 확인
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // iOS 확인
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // 스플래시 화면 (앱 모드에서만, 세션당 1회)
    if (standalone && !sessionStorage.getItem('splash-shown')) {
      sessionStorage.setItem('splash-shown', 'true');
      setShowSplash(true);
      setTimeout(() => setSplashFading(true), 1500);
      setTimeout(() => setShowSplash(false), 2000);
    }

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
                  // 새 버전 알림
                  if (confirm('새 버전이 있습니다. 업데이트하시겠습니까?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker 등록 실패:', error);
        });
    }

    // PWA 설치 프롬프트 캡처 (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 이전에 배너를 닫지 않았다면 표시
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      // 24시간 후 다시 표시
      if (!dismissedTime || Date.now() - dismissedTime > 24 * 60 * 60 * 1000) {
        setTimeout(() => setShowInstallBanner(true), 3000);
      }
    };

    // iOS는 별도 처리
    if (ios && !standalone) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      if (!dismissedTime || Date.now() - dismissedTime > 24 * 60 * 60 * 1000) {
        setTimeout(() => setShowInstallBanner(true), 4000);
      }
    }

    // 온라인/오프라인 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      sessionStorage.setItem('was-offline', 'true');
    };

    // 스크롤 위치에 따라 상단 이동 버튼 표시
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 초기 상태 설정
    setIsOnline(navigator.onLine);

    // Pull to Refresh (앱 모드에서만)
    let canPull = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && standalone) {
        startY.current = e.touches[0].clientY;
        canPull = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0 && window.scrollY <= 0) {
        const pullAmount = Math.min(distance / 2.5, 120);
        setPullDistance(pullAmount);
        setIsPulling(true);

        if (pullAmount > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (!canPull) return;
      canPull = false;

      if (pullDistance >= PULL_THRESHOLD) {
        setIsRefreshing(true);
        setPullDistance(PULL_THRESHOLD / 2);

        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    if (standalone) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('scroll', handleScroll);
      if (standalone) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [pullDistance]);

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
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  return (
    <>
      {/* 스플래시 화면 */}
      {showSplash && (
        <div
          className={`
            fixed inset-0 z-[9999] bg-gradient-to-b from-[#3182f6] to-[#1b64da]
            flex flex-col items-center justify-center
            transition-opacity duration-500
            ${splashFading ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <div className="mb-6 animate-pulse">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path
                  d="M28 8L8 18V38L28 48L48 38V18L28 8Z"
                  fill="#3182f6"
                  stroke="#1b64da"
                  strokeWidth="2"
                />
                <path
                  d="M28 28L8 18M28 28L48 18M28 28V48"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="28" cy="18" r="4" fill="#ff5252" />
                <text x="28" y="36" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
                  W
                </text>
              </svg>
            </div>
          </div>
          <h1 className="text-white text-[24px] font-bold mb-2">쿠팡 최저가</h1>
          <p className="text-white/80 text-[14px]">실시간 가격 추적</p>
          <div className="absolute bottom-20 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Pull to Refresh 인디케이터 */}
      {(isPulling || isRefreshing) && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-[#e5e8eb] transition-all"
          style={{ top: Math.max(pullDistance - 48, 8) }}
        >
          <RefreshCw
            size={20}
            className={`text-[#3182f6] ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${(pullDistance / PULL_THRESHOLD) * 360}deg)`,
            }}
          />
        </div>
      )}

      {children}

      {/* PWA 설치 배너 */}
      {showInstallBanner && !isStandalone && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-fadeIn max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e5e8eb] overflow-hidden">
            {/* 헤더 */}
            <div className="relative bg-gradient-to-r from-[#3182f6] to-[#1b64da] text-white px-4 py-3">
              <button
                onClick={handleDismiss}
                className="absolute right-2 top-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <img
                    src="/icon-192.png"
                    alt="앱 아이콘"
                    className="w-8 h-8 rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[16px]">쿠팡 최저가</h3>
                  <p className="text-[13px] text-white/80">앱으로 더 빠르게</p>
                </div>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="p-4">
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-[14px] text-[#5c6470]">
                  <span className="w-5 h-5 rounded-full bg-[#e8f3ff] flex items-center justify-center text-[#3182f6] text-[12px] flex-shrink-0">1</span>
                  최저가 알림을 즉시 받아보세요
                </li>
                <li className="flex items-center gap-2 text-[14px] text-[#5c6470]">
                  <span className="w-5 h-5 rounded-full bg-[#e8f3ff] flex items-center justify-center text-[#3182f6] text-[12px] flex-shrink-0">2</span>
                  오프라인에서도 관심상품 확인
                </li>
                <li className="flex items-center gap-2 text-[14px] text-[#5c6470]">
                  <span className="w-5 h-5 rounded-full bg-[#e8f3ff] flex items-center justify-center text-[#3182f6] text-[12px] flex-shrink-0">3</span>
                  홈 화면에서 빠르게 접근
                </li>
              </ul>

              {isIOS ? (
                // iOS 설치 안내
                <div className="bg-[#f8f9fa] rounded-xl p-3">
                  <p className="text-[13px] text-[#191f28] mb-2 font-medium flex items-center gap-1">
                    <Share size={16} />
                    Safari에서 설치하기
                  </p>
                  <ol className="text-[12px] text-[#5c6470] space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#e5e8eb] flex items-center justify-center text-[10px]">1</span>
                      하단의 <Share size={12} className="inline mx-0.5" /> 공유 버튼 탭
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#e5e8eb] flex items-center justify-center text-[10px]">2</span>
                      &quot;홈 화면에 추가&quot; 선택
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[#e5e8eb] flex items-center justify-center text-[10px]">3</span>
                      &quot;추가&quot; 버튼 탭
                    </li>
                  </ol>
                </div>
              ) : deferredPrompt ? (
                // Android/Desktop 설치 버튼
                <button
                  onClick={handleInstall}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3182f6] text-white rounded-xl font-semibold hover:bg-[#1b64da] active:scale-[0.98] transition-all touch-manipulation"
                >
                  <Download size={20} />
                  앱 설치하기
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 오프라인 알림 */}
      {!isOnline && (
        <div className="fixed top-16 left-4 right-4 z-50 animate-fadeIn max-w-lg mx-auto">
          <div className="bg-[#191f28] text-white rounded-xl p-3 shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff8b00]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-4 h-4 text-[#ff8b00]" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium">오프라인 모드</p>
              <p className="text-[12px] text-[#8b95a1]">인터넷 연결을 확인해주세요</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 bg-white/10 rounded-lg text-[12px] hover:bg-white/20 transition-colors"
            >
              재연결
            </button>
          </div>
        </div>
      )}

      {/* 온라인 복구 알림 */}
      {isOnline && typeof window !== 'undefined' && sessionStorage.getItem('was-offline') === 'true' && (
        <OnlineRestored />
      )}

      {/* 상단으로 스크롤 버튼 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`
          fixed right-4 bottom-24 z-40
          w-12 h-12 rounded-full
          bg-white shadow-lg border border-[#e5e8eb]
          flex items-center justify-center
          text-[#5c6470] hover:text-[#3182f6] hover:border-[#3182f6]
          active:scale-95 transition-all duration-200
          touch-manipulation
          ${showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
        `}
        aria-label="맨 위로 이동"
      >
        <ChevronUp size={24} strokeWidth={2.5} />
      </button>
    </>
  );
}

// 온라인 복구 알림 컴포넌트
function OnlineRestored() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.removeItem('was-offline');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 animate-fadeIn max-w-lg mx-auto">
      <div className="bg-[#20c997] text-white rounded-xl p-3 shadow-lg flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Wifi className="w-4 h-4" />
        </div>
        <p className="text-[14px] font-medium">인터넷에 다시 연결되었습니다</p>
      </div>
    </div>
  );
}
