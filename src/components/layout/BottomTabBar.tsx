'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// SVG 아이콘 컴포넌트들
const HomeIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" stroke="none" />
    ) : (
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    )}
  </svg>
);

const HotDealIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" />
        <polygon points="2 12 12 17 22 12 12 7" fill="currentColor" />
        <polygon points="2 17 12 22 22 17 12 12" fill="currentColor" />
      </>
    ) : (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </>
    )}
  </svg>
);

const CategoryIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" stroke="none" />
        <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" stroke="none" />
        <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" stroke="none" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" stroke="none" />
      </>
    ) : (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    )}
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const MenuIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={filled ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

interface TabItem {
  href: string;
  label: string;
  icon: (props: { filled?: boolean }) => React.ReactElement;
  matchPaths?: string[];
}

export default function BottomTabBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const tabs: TabItem[] = [
    {
      href: '/',
      label: '홈',
      icon: HomeIcon,
      matchPaths: ['/'],
    },
    {
      href: '/goldbox',
      label: '핫딜',
      icon: HotDealIcon,
      matchPaths: ['/goldbox'],
    },
    {
      href: '/categories',
      label: '카테고리',
      icon: CategoryIcon,
      matchPaths: ['/categories', '/category'],
    },
    {
      href: session ? '/mypage/favorites' : '/favorites',
      label: '관심',
      icon: HeartIcon,
      matchPaths: ['/favorites', '/mypage/favorites'],
    },
    {
      href: '/menu',
      label: '전체',
      icon: MenuIcon,
      matchPaths: ['/menu', '/mypage', '/auth'],
    },
  ];

  const isActive = (tab: TabItem) => {
    if (tab.matchPaths) {
      return tab.matchPaths.some(path =>
        path === '/' ? pathname === '/' : pathname.startsWith(path)
      );
    }
    return pathname === tab.href;
  };

  return (
    <nav className="fixed bottom-0 z-50 bg-[#f8f9fa] border-t border-[#e5e8eb] safe-area-bottom bottom-tab-bar">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const IconComponent = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full pt-1.5 pb-1 transition-colors ${
                active ? 'text-[#191f28]' : 'text-[#6b7684]'
              }`}
            >
              <IconComponent filled={active} />
              <span className={`text-[10px] mt-0.5 ${active ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
