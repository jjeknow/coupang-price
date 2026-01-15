'use client';

import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#191f28] dark:text-[#f2f4f6] mb-8">
        설정
      </h1>

      <div className="bg-white dark:bg-[#1e2024] rounded-2xl border border-[#e5e8eb] dark:border-[#3a3d42] p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#f2f4f6] dark:bg-[#2a2d32] rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings size={32} className="text-[#5c6470]" />
          </div>
          <h2 className="text-xl font-bold text-[#191f28] dark:text-[#f2f4f6] mb-2">
            설정 페이지 준비 중
          </h2>
          <p className="text-[#5c6470] dark:text-[#5c6470] max-w-md mx-auto">
            API 키 관리, 알림 설정, 사이트 설정 등 다양한 설정 기능이 곧 추가될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
