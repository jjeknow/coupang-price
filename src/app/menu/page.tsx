'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

// 아이콘 컴포넌트
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>
  </svg>
);

const HelpCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function MenuPage() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const menuItems = [
    {
      title: '내 활동',
      items: [
        { href: session ? '/mypage/favorites' : '/favorites', icon: HeartIcon, label: '관심상품' },
        { href: session ? '/mypage/alerts' : '/auth/login?callbackUrl=/mypage/alerts', icon: BellIcon, label: '가격 알림' },
        { href: '/search', icon: SearchIcon, label: '상품 검색' },
      ],
    },
    {
      title: '서비스 정보',
      items: [
        { href: '/about', icon: InfoIcon, label: '서비스 소개' },
        { href: '/about#faq', icon: HelpCircleIcon, label: '자주 묻는 질문' },
        { href: '/terms', icon: FileTextIcon, label: '이용약관' },
        { href: '/privacy', icon: ShieldIcon, label: '개인정보처리방침' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 프로필 섹션 */}
      <div className="bg-white px-4 py-6 border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto">
          {session?.user ? (
            <Link href="/mypage" className="flex items-center gap-4">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="프로필"
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              ) : (
                <div className="w-14 h-14 bg-[#3182f6] rounded-full flex items-center justify-center">
                  <UserIcon />
                </div>
              )}
              <div className="flex-1">
                <p className="text-lg font-bold text-[#191f28]">{session.user.name || '사용자'}</p>
                <p className="text-sm text-[#6b7684]">{session.user.email}</p>
              </div>
              <ChevronRightIcon />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-[#f2f4f6] rounded-full flex items-center justify-center text-[#6b7684]">
                <UserIcon />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-[#191f28]">로그인하세요</p>
                <p className="text-sm text-[#6b7684]">관심상품, 가격 알림 기능을 이용할 수 있어요</p>
              </div>
              <ChevronRightIcon />
            </Link>
          )}
        </div>
      </div>

      {/* 메뉴 섹션들 */}
      <div className="max-w-6xl mx-auto">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mt-4">
            <div className="px-4 py-2">
              <p className="text-xs font-medium text-[#6b7684]">{section.title}</p>
            </div>
            <div className="bg-white">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center gap-4 px-4 py-4 border-b border-[#f2f4f6] last:border-b-0 active:bg-[#f8f9fa]"
                  >
                    <div className="w-10 h-10 bg-[#f2f4f6] rounded-full flex items-center justify-center text-[#4e5968]">
                      <IconComponent />
                    </div>
                    <span className="flex-1 text-[15px] text-[#191f28]">{item.label}</span>
                    <ChevronRightIcon />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* 로그아웃 버튼 */}
        {session?.user && (
          <div className="mt-4 bg-white">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-4 px-4 py-4 w-full active:bg-red-50"
            >
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#c92a2a]">
                <LogOutIcon />
              </div>
              <span className="flex-1 text-left text-[15px] text-[#c92a2a]">로그아웃</span>
            </button>
          </div>
        )}

        {/* 버전 정보 */}
        <div className="py-8 text-center">
          <p className="text-xs text-[#6b7684]">똑체크 v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
