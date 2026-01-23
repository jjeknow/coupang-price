'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Shield,
  Trash2,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/mypage/settings');
    }
  }, [status, router]);

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== '계정삭제') {
      alert('계정삭제를 정확히 입력해주세요.');
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('계정이 삭제되었습니다.');
        signOut({ callbackUrl: '/' });
      } else {
        const data = await res.json();
        alert(data.error || '계정 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('계정 삭제 실패:', error);
      alert('계정 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="px-4">
          <div className="flex items-center h-12">
            <Link href="/mypage" className="p-2 -ml-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg flex items-center gap-2">
              <ArrowLeft size={20} />
              <span className="text-[14px] font-medium">마이페이지</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[#191f28] mb-6">설정</h1>

        {/* 알림 설정 */}
        <div className="bg-white rounded-2xl border border-[#e5e8eb] mb-4">
          <div className="px-6 py-4 border-b border-[#e5e8eb]">
            <h2 className="font-semibold text-[#191f28] flex items-center gap-2">
              <Bell size={18} className="text-[#3182f6]" />
              알림 설정
            </h2>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-[#5c6470]">
              가격 알림은 마이페이지 &gt; 가격 알림에서 개별적으로 관리할 수 있습니다.
            </p>
            <Link
              href="/mypage/alerts"
              className="inline-flex items-center gap-1 mt-3 text-[14px] text-[#3182f6] font-medium"
            >
              알림 관리하기
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* 개인정보 */}
        <div className="bg-white rounded-2xl border border-[#e5e8eb] mb-4">
          <div className="px-6 py-4 border-b border-[#e5e8eb]">
            <h2 className="font-semibold text-[#191f28] flex items-center gap-2">
              <Shield size={18} className="text-[#3182f6]" />
              개인정보
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              href="/privacy"
              className="flex items-center justify-between py-2 text-[14px] text-[#191f28]"
            >
              <span>개인정보처리방침</span>
              <ExternalLink size={16} className="text-[#adb5bd]" />
            </Link>
            <Link
              href="/terms"
              className="flex items-center justify-between py-2 text-[14px] text-[#191f28]"
            >
              <span>이용약관</span>
              <ExternalLink size={16} className="text-[#adb5bd]" />
            </Link>
          </div>
        </div>

        {/* 계정 삭제 */}
        <div className="bg-white rounded-2xl border border-[#e5e8eb]">
          <div className="px-6 py-4 border-b border-[#e5e8eb]">
            <h2 className="font-semibold text-[#c92a2a] flex items-center gap-2">
              <Trash2 size={18} />
              계정 삭제
            </h2>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-[#5c6470] mb-4">
              계정을 삭제하면 모든 데이터(관심상품, 가격 알림 등)가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-[#fee] text-[#c92a2a] rounded-lg text-[14px] font-medium hover:bg-red-100 transition-colors"
            >
              계정 삭제하기
            </button>
          </div>
        </div>

        {/* 버전 정보 */}
        <div className="mt-8 text-center">
          <p className="text-[13px] text-[#8b95a1]">
            똑체크 v1.0.0
          </p>
        </div>
      </div>

      {/* 계정 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#fee] rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-[#c92a2a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#191f28]">계정 삭제</h3>
                <p className="text-[13px] text-[#5c6470]">이 작업은 되돌릴 수 없습니다</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[14px] text-[#5c6470] mb-4">
                삭제를 진행하려면 아래에 <strong className="text-[#c92a2a]">계정삭제</strong>를 입력하세요.
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="계정삭제"
                className="w-full px-4 py-3 border border-[#e5e8eb] rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#c92a2a] focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className="flex-1 py-3 bg-[#f2f4f6] text-[#4e5968] rounded-xl font-medium"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== '계정삭제' || deleting}
                className="flex-1 py-3 bg-[#c92a2a] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? '삭제 중...' : '삭제하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
