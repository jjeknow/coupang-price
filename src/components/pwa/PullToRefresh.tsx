'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export default function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const THRESHOLD = 80; // 새로고침 트리거 거리
  const MAX_PULL = 120; // 최대 당김 거리
  const RESISTANCE = 2.5; // 저항값 (높을수록 덜 당겨짐)

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    let canPull = false;

    const handleTouchStart = (e: TouchEvent) => {
      // 스크롤이 맨 위일 때만 당기기 가능
      if (window.scrollY <= 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        canPull = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        // 아래로 당기는 경우만
        const pullAmount = Math.min(distance / RESISTANCE, MAX_PULL);
        setPullDistance(pullAmount);
        setIsPulling(true);

        // 기본 스크롤 동작 방지
        if (pullAmount > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!canPull || isRefreshing) return;

      canPull = false;

      if (pullDistance >= THRESHOLD) {
        // 새로고침 실행
        setIsRefreshing(true);
        setPullDistance(THRESHOLD / 2); // 로딩 중 표시 위치

        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        }
      } else {
        // 임계값 미달 - 원래대로
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isRefreshing, onRefresh, pullDistance]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const showIndicator = isPulling || isRefreshing;

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* 당기기 인디케이터 */}
      <div
        className={`
          fixed left-1/2 -translate-x-1/2 z-50
          flex items-center justify-center
          w-10 h-10 rounded-full bg-white shadow-lg border border-[#e5e8eb]
          transition-opacity duration-200
          ${showIndicator ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        style={{
          top: Math.max(pullDistance - 48, 8),
        }}
      >
        <RefreshCw
          size={20}
          className={`text-[#3182f6] transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
          style={{
            transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
          }}
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
