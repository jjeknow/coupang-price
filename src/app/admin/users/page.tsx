'use client';

import { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Mail } from 'lucide-react';
import Image from 'next/image';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  createdAt: string;
  _count: {
    favorites: number;
    alerts: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#191f28] dark:text-[#f2f4f6]">
          사용자 관리
        </h1>
        <button
          onClick={fetchUsers}
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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b95a1]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1e2024] border border-[#e5e8eb] dark:border-[#3a3d42] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3182f6] text-[#191f28] dark:text-[#f2f4f6]"
        />
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-[#e5e8eb] dark:border-[#3a3d42] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <Users size={48} className="text-[#d1d6db] dark:text-[#4e5968] mx-auto mb-4" />
            <p className="text-[#6b7684] dark:text-[#8b95a1]">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 사용자가 없습니다'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e8eb] dark:border-[#3a3d42] bg-[#f9fafb] dark:bg-[#2a2d32]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6b7684] dark:text-[#8b95a1]">
                    사용자
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6b7684] dark:text-[#8b95a1]">
                    이메일
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-[#6b7684] dark:text-[#8b95a1]">
                    관심상품
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-[#6b7684] dark:text-[#8b95a1]">
                    알림
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#6b7684] dark:text-[#8b95a1]">
                    가입일
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#e5e8eb] dark:border-[#3a3d42] last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || ''}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#3182f6] rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {(user.name || user.email || '?')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-[#191f28] dark:text-[#f2f4f6]">
                          {user.name || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-[#8b95a1]" />
                        <span className="text-sm text-[#6b7684] dark:text-[#8b95a1]">
                          {user.email || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-[#191f28] dark:text-[#f2f4f6]">
                        {user._count.favorites}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-[#191f28] dark:text-[#f2f4f6]">
                        {user._count.alerts}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#6b7684] dark:text-[#8b95a1]">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
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
