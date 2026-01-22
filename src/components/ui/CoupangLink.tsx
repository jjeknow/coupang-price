'use client';

import { useState, useCallback, ReactNode } from 'react';

interface CoupangLinkProps {
  productId: string | number;
  children: ReactNode;
  className?: string;
}

/**
 * 쿠팡 어필리에이트 링크 컴포넌트
 * 클릭 시 딥링크 API를 호출하여 새로운 어필리에이트 링크를 생성합니다.
 */
export default function CoupangLink({ productId, children, className }: CoupangLinkProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/deeplink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: String(productId) }),
      });

      const result = await res.json();
      const targetUrl = result.data?.shortenUrl || result.data?.landingUrl || `https://www.coupang.com/vp/products/${productId}`;

      // 쿠팡 앱 연동을 위해 location.href 사용
      const { openCoupangProduct } = await import('@/lib/capacitor/browser');
      await openCoupangProduct(targetUrl);
    } catch (error) {
      console.error('딥링크 생성 실패:', error);
      // 실패 시 기본 URL로 이동
      const { openCoupangProduct } = await import('@/lib/capacitor/browser');
      await openCoupangProduct(`https://www.coupang.com/vp/products/${productId}`);
    } finally {
      setLoading(false);
    }
  }, [productId, loading]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          이동 중...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
