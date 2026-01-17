'use client';

import { useState, useEffect, useRef } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 앱으로 실행된 경우에만 스플래시 표시
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    // 이미 본 경우 표시하지 않음 (세션 당 1회)
    const hasSeenSplash = sessionStorage.getItem('splash-shown');

    if (!isStandalone || hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    sessionStorage.setItem('splash-shown', 'true');

    // 1.5초 후 페이드 아웃 시작
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    // 2초 후 완전히 숨김
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] bg-gradient-to-b from-[#3182f6] to-[#1b64da]
        flex flex-col items-center justify-center
        transition-opacity duration-500
        ${isFading ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* 로고 */}
      <div className="mb-6 animate-bounce-subtle">
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
              ₩
            </text>
          </svg>
        </div>
      </div>

      {/* 앱 이름 */}
      <h1 className="text-white text-[24px] font-bold mb-2">쿠팡 최저가</h1>
      <p className="text-white/80 text-[14px]">실시간 가격 추적</p>

      {/* 로딩 인디케이터 */}
      <div className="absolute bottom-20">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
