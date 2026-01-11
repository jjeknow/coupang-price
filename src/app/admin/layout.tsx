'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Bell,
  Users,
  Settings,
  ArrowLeft,
} from 'lucide-react';

const ADMIN_EMAILS = ['admin@example.com']; // 관리자 이메일 목록

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6b7684] mb-4">접근 권한이 없습니다</p>
          <Link href="/" className="text-[#3182f6] hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f6] dark:bg-[#121417]">
      {/* 사이드바 */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#1e2024] border-r border-[#e5e8eb] dark:border-[#3a3d42]">
        <div className="p-4 border-b border-[#e5e8eb] dark:border-[#3a3d42]">
          <Link href="/" className="flex items-center gap-2 text-[#6b7684] hover:text-[#3182f6]">
            <ArrowLeft size={18} />
            <span className="text-sm">사이트로 돌아가기</span>
          </Link>
        </div>

        <div className="p-4">
          <h1 className="text-lg font-bold text-[#191f28] dark:text-[#f2f4f6]">관리자</h1>
          <p className="text-sm text-[#6b7684]">{session.user.email}</p>
        </div>

        <nav className="p-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-[#4e5968] dark:text-[#b0b8c1] hover:bg-[#f2f4f6] dark:hover:bg-[#2a2d32] rounded-xl transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>대시보드</span>
          </Link>
          <Link
            href="/admin/alerts"
            className="flex items-center gap-3 px-4 py-3 text-[#4e5968] dark:text-[#b0b8c1] hover:bg-[#f2f4f6] dark:hover:bg-[#2a2d32] rounded-xl transition-colors"
          >
            <Bell size={20} />
            <span>가격 알림</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 text-[#4e5968] dark:text-[#b0b8c1] hover:bg-[#f2f4f6] dark:hover:bg-[#2a2d32] rounded-xl transition-colors"
          >
            <Users size={20} />
            <span>사용자</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 text-[#4e5968] dark:text-[#b0b8c1] hover:bg-[#f2f4f6] dark:hover:bg-[#2a2d32] rounded-xl transition-colors"
          >
            <Settings size={20} />
            <span>설정</span>
          </Link>
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
