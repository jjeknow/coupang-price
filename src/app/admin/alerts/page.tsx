'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, RefreshCw } from 'lucide-react';

interface Alert {
  id: string;
  productId: number;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
  };
}

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const formatPrice = (price: number) => price.toLocaleString('ko-KR');

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#191f28] dark:text-[#f2f4f6]">
          가격 알림 관리
        </h1>
        <button
          onClick={fetchAlerts}
          className="flex items-center gap-2 px-4 py-2 bg-[#3182f6] text-white rounded-xl hover:bg-[#1b64da] transition-colors"
        >
          <RefreshCw size={18} />
          새로고침
        </button>
      </div>

      {/* 검색 */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c6470]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="상품명 또는 이메일로 검색"
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1e2024] border border-[#e5e8eb] dark:border-[#3a3d42] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3182f6] text-[#191f28] dark:text-[#f2f4f6]"
        />
      </div>

      {/* 알림 목록 */}
      <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-[#e5e8eb] dark:border-[#3a3d42] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="text-[#d1d6db] dark:text-[#4e5968] mx-auto mb-4" />
            <p className="text-[#5c6470] dark:text-[#5c6470]">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 알림이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e8eb] dark:border-[#3a3d42] bg-[#f9fafb] dark:bg-[#2a2d32]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#5c6470] dark:text-[#5c6470]">
                    상품
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#5c6470] dark:text-[#5c6470]">
                    목표가
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#5c6470] dark:text-[#5c6470]">
                    현재가
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#5c6470] dark:text-[#5c6470]">
                    사용자
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#5c6470] dark:text-[#5c6470]">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#5c6470] dark:text-[#5c6470]">
                    등록일
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="border-b border-[#e5e8eb] dark:border-[#3a3d42] last:border-0"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#191f28] dark:text-[#f2f4f6] line-clamp-1 max-w-xs">
                        {alert.productName}
                      </p>
                      <p className="text-xs text-[#5c6470]">
                        ID: {alert.productId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#1d4ed8]">
                        {formatPrice(alert.targetPrice)}원
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#191f28] dark:text-[#f2f4f6]">
                        {formatPrice(alert.currentPrice)}원
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#191f28] dark:text-[#f2f4f6]">
                        {alert.user.name || '-'}
                      </p>
                      <p className="text-xs text-[#5c6470]">{alert.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          alert.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {alert.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#5c6470] dark:text-[#5c6470]">
                        {new Date(alert.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
