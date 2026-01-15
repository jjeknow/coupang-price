'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, BellOff, Trash2, ArrowLeft, TrendingDown, ExternalLink } from 'lucide-react';

interface Alert {
  id: string;
  coupangProductId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  targetPrice: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
}

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/mypage/alerts');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAlerts();
    }
  }, [session]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/user/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('알림 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (alertId: string, currentActive: boolean) => {
    setUpdating(alertId);
    try {
      const res = await fetch('/api/user/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, isActive: !currentActive }),
      });

      if (res.ok) {
        setAlerts(alerts.map(a =>
          a.id === alertId ? { ...a, isActive: !currentActive } : a
        ));
      }
    } catch (error) {
      console.error('알림 수정 실패:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (alertId: string) => {
    if (!confirm('알림을 삭제하시겠습니까?')) return;

    setUpdating(alertId);
    try {
      const res = await fetch(`/api/user/alerts?alertId=${alertId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId));
      }
    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setUpdating(null);
    }
  };

  const calculateDiscount = (original: number, target: number) => {
    return Math.round(((original - target) / original) * 100);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.isActive);
  const inactiveAlerts = alerts.filter(a => !a.isActive);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#f2f4f6] rounded-lg">
          <ArrowLeft size={24} className="text-[#191f28]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#191f28]">가격 알림</h1>
          <p className="text-[#6b7684] text-sm">
            활성 {activeAlerts.length}개 · 비활성 {inactiveAlerts.length}개
          </p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#f2f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={40} className="text-[#adb5bd]" />
          </div>
          <p className="text-[#6b7684] mb-2">설정된 가격 알림이 없습니다</p>
          <p className="text-[#adb5bd] text-sm mb-4">상품 페이지에서 원하는 가격을 설정하세요</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182f6] text-white rounded-xl font-medium hover:bg-[#1b64da]"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 활성 알림 */}
          {activeAlerts.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#191f28] mb-4 flex items-center gap-2">
                <Bell size={20} className="text-[#3182f6]" />
                활성 알림
              </h2>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    updating={updating === alert.id}
                    onToggle={() => toggleActive(alert.id, alert.isActive)}
                    onDelete={() => handleDelete(alert.id)}
                    calculateDiscount={calculateDiscount}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 비활성 알림 */}
          {inactiveAlerts.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#6b7684] mb-4 flex items-center gap-2">
                <BellOff size={20} />
                비활성 알림
              </h2>
              <div className="space-y-4 opacity-60">
                {inactiveAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    updating={updating === alert.id}
                    onToggle={() => toggleActive(alert.id, alert.isActive)}
                    onDelete={() => handleDelete(alert.id)}
                    calculateDiscount={calculateDiscount}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AlertCard({
  alert,
  updating,
  onToggle,
  onDelete,
  calculateDiscount,
}: {
  alert: Alert;
  updating: boolean;
  onToggle: () => void;
  onDelete: () => void;
  calculateDiscount: (original: number, target: number) => number;
}) {
  const discount = calculateDiscount(alert.productPrice, alert.targetPrice);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e8eb] p-4 flex gap-4">
      {/* 이미지 */}
      <Link
        href={`/product/p-${alert.coupangProductId}`}
        className="relative w-20 h-20 bg-[#f8f9fa] rounded-xl overflow-hidden flex-shrink-0"
      >
        <Image
          src={alert.productImage}
          alt={alert.productName}
          fill
          className="object-contain p-2"
          unoptimized
        />
      </Link>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <Link href={`/product/p-${alert.coupangProductId}`}>
          <p className="text-[14px] text-[#191f28] line-clamp-2 hover:text-[#3182f6]">
            {alert.productName}
          </p>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <p className="text-[#6b7684] text-[13px]">현재</p>
          <p className="text-[15px] font-medium text-[#191f28]">
            {alert.productPrice.toLocaleString()}원
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-[#3182f6] text-[13px]">목표</p>
          <p className="text-[17px] font-bold text-[#3182f6]">
            {alert.targetPrice.toLocaleString()}원
          </p>
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#dbeafe] text-[#1d4ed8] text-[11px] font-semibold rounded">
            <TrendingDown size={10} />
            {discount}% 할인
          </span>
        </div>

        {/* 버튼들 */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={onToggle}
            disabled={updating}
            className={`flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-lg disabled:opacity-50 ${
              alert.isActive
                ? 'bg-[#f2f4f6] text-[#4e5968] hover:bg-[#e5e8eb]'
                : 'bg-[#3182f6] text-white hover:bg-[#1b64da]'
            }`}
          >
            {alert.isActive ? <BellOff size={14} /> : <Bell size={14} />}
            {alert.isActive ? '비활성화' : '활성화'}
          </button>
          <a
            href={alert.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-[#f2f4f6] text-[#4e5968] text-[13px] rounded-lg hover:bg-[#e5e8eb]"
          >
            <ExternalLink size={14} />
            쿠팡
          </a>
          <button
            onClick={onDelete}
            disabled={updating}
            className="flex items-center gap-1 px-3 py-1.5 text-[#c92a2a] text-[13px] rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

interface Alert {
  id: string;
  coupangProductId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  targetPrice: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
}
