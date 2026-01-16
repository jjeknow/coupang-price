'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 이미 설치된 앱인지 확인
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    if (standalone) return;

    // iOS 체크
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // 이미 닫았으면 24시간 동안 표시하지 않음
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Android/Desktop - beforeinstallprompt 이벤트 대기
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // 약간의 딜레이 후 표시 (UX 개선)
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS는 바로 표시 (약간의 딜레이 후)
    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
  };

  // 이미 설치되었거나 표시하지 않을 경우
  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e5e8eb] overflow-hidden max-w-lg mx-auto">
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
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <img src="/icon-192.png" alt="앱 아이콘" className="w-8 h-8 rounded-lg" />
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
              <span className="w-5 h-5 rounded-full bg-[#e8f3ff] flex items-center justify-center text-[#3182f6] text-[12px]">✓</span>
              최저가 알림을 즉시 받아보세요
            </li>
            <li className="flex items-center gap-2 text-[14px] text-[#5c6470]">
              <span className="w-5 h-5 rounded-full bg-[#e8f3ff] flex items-center justify-center text-[#3182f6] text-[12px]">✓</span>
              오프라인에서도 관심상품 확인
            </li>
            <li className="flex items-center gap-2 text-[14px] text-[#5c6470]">
              <span className="w-5 h-5 rounded-full bg-[#e8f3ff] flex items-center justify-center text-[#3182f6] text-[12px]">✓</span>
              홈 화면에서 빠르게 접근
            </li>
          </ul>

          {isIOS ? (
            // iOS 설치 안내
            <div className="bg-[#f8f9fa] rounded-xl p-3">
              <p className="text-[13px] text-[#5c6470] mb-2 font-medium">
                <Share size={16} className="inline mr-1" />
                Safari에서 설치하기
              </p>
              <ol className="text-[12px] text-[#8b95a1] space-y-1">
                <li>1. 하단의 <Share size={12} className="inline" /> 공유 버튼 탭</li>
                <li>2. "홈 화면에 추가" 선택</li>
                <li>3. "추가" 버튼 탭</li>
              </ol>
            </div>
          ) : (
            // Android/Desktop 설치 버튼
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3182f6] text-white rounded-xl font-semibold hover:bg-[#1b64da] active:scale-[0.98] transition-all touch-manipulation"
            >
              <Download size={20} />
              앱 설치하기
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
