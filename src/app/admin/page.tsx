'use client';

import { useState, useEffect } from 'react';
import { Users, Bell, Heart, TrendingUp } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalAlerts: number;
  totalFavorites: number;
  activeAlerts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAlerts: 0,
    totalFavorites: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: '총 사용자',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: '가격 알림',
      value: stats.totalAlerts,
      icon: Bell,
      color: 'bg-amber-500',
    },
    {
      title: '활성 알림',
      value: stats.activeAlerts,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: '관심상품',
      value: stats.totalFavorites,
      icon: Heart,
      color: 'bg-rose-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#191f28] dark:text-[#f2f4f6] mb-8">
        대시보드
      </h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-[#1e2024] rounded-2xl p-6 border border-[#e5e8eb] dark:border-[#3a3d42]"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <stat.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-[#6b7684] dark:text-[#8b95a1]">
                  {stat.title}
                </p>
                {loading ? (
                  <div className="w-16 h-8 bg-[#f2f4f6] dark:bg-[#2a2d32] rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-[#191f28] dark:text-[#f2f4f6]">
                    {stat.value.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 서비스 준비 중 안내 */}
      <div className="bg-white dark:bg-[#1e2024] rounded-2xl p-8 border border-[#e5e8eb] dark:border-[#3a3d42]">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚧</span>
          </div>
          <h2 className="text-xl font-bold text-[#191f28] dark:text-[#f2f4f6] mb-2">
            관리자 기능 준비 중
          </h2>
          <p className="text-[#6b7684] dark:text-[#8b95a1] max-w-md mx-auto">
            사용자 관리, 알림 관리, 통계 분석 등 다양한 관리 기능이 곧 추가될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
