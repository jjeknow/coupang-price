'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Heart,
  Bell,
  LogOut,
  ChevronRight,
  Package,
  Settings,
  HelpCircle
} from 'lucide-react';

interface Alert {
  id: string;
  productName: string;
  productImage: string;
  targetPrice: number;
  productPrice: number;
  isActive: boolean;
}

interface Favorite {
  id: string;
  productName: string;
  productImage: string;
  productPrice: number;
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/mypage');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const [alertsRes, favoritesRes] = await Promise.all([
        fetch('/api/user/alerts'),
        fetch('/api/user/favorites'),
      ]);

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.slice(0, 3));
      }

      if (favoritesRes.ok) {
        const favoritesData = await favoritesRes.json();
        setFavorites(favoritesData.slice(0, 3));
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const menuItems = [
    { href: '/mypage/favorites', icon: Heart, label: '관심상품', count: favorites.length },
    { href: '/mypage/alerts', icon: Bell, label: '가격 알림', count: alerts.filter(a => a.isActive).length },
    { href: '/mypage/history', icon: Package, label: '최근 본 상품' },
    { href: '/mypage/settings', icon: Settings, label: '설정' },
    { href: '/help', icon: HelpCircle, label: '고객센터' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 프로필 섹션 */}
      <div className="bg-white rounded-2xl border border-[#e5e8eb] p-6 mb-6">
        <div className="flex items-center gap-4">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="프로필"
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-[#3182f6] rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#191f28]">
              {session.user.name || '사용자'}
            </h1>
            <p className="text-[#5c6470] text-sm">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* 관심상품 미리보기 */}
      {favorites.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e5e8eb] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#191f28]">관심상품</h2>
            <Link href="/mypage/favorites" className="text-[#1d4ed8] text-sm font-medium">
              더보기
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {favorites.map((item) => (
              <div key={item.id} className="text-center">
                <div className="relative aspect-square bg-[#f2f4f6] rounded-xl overflow-hidden mb-2">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <p className="text-[12px] text-[#191f28] line-clamp-1">{item.productName}</p>
                <p className="text-[13px] font-bold text-[#c92a2a]">
                  {item.productPrice.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 가격 알림 미리보기 */}
      {alerts.filter(a => a.isActive).length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e5e8eb] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#191f28]">가격 알림</h2>
            <Link href="/mypage/alerts" className="text-[#1d4ed8] text-sm font-medium">
              더보기
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.filter(a => a.isActive).map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-xl">
                <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={alert.productImage}
                    alt={alert.productName}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#191f28] line-clamp-1">{alert.productName}</p>
                  <p className="text-[12px] text-[#5c6470]">
                    목표가: <span className="text-[#1d4ed8] font-medium">{alert.targetPrice.toLocaleString()}원</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메뉴 */}
      <div className="bg-white rounded-2xl border border-[#e5e8eb] overflow-hidden mb-6">
        {menuItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-6 py-4 hover:bg-[#f8f9fa] transition-colors ${
              index < menuItems.length - 1 ? 'border-b border-[#e5e8eb]' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-[#5c6470]" />
              <span className="text-[15px] text-[#191f28]">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 bg-[#3182f6] text-white text-[12px] font-medium rounded-full">
                  {item.count}
                </span>
              )}
              <ChevronRight size={18} className="text-[#adb5bd]" />
            </div>
          </Link>
        ))}
      </div>

      {/* 로그아웃 */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white rounded-2xl border border-[#e5e8eb] text-[#c92a2a] hover:bg-red-50 transition-colors"
      >
        <LogOut size={18} />
        <span className="font-medium">로그아웃</span>
      </button>
    </div>
  );
}
