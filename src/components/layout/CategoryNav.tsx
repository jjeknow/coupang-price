'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 카테고리 이모지 매핑
const categoryEmojis: Record<number, string> = {
  1001: '👗',
  1002: '👔',
  1010: '💄',
  1011: '👶',
  1012: '🍎',
  1013: '🍳',
  1014: '🧹',
  1015: '🛋️',
  1016: '📺',
  1017: '⚽',
  1018: '🚗',
  1019: '📚',
  1020: '🎮',
  1021: '✏️',
  1024: '💊',
  1029: '🐶',
  1030: '👶',
};

// 쿠팡 인기순 정렬
const categories = [
  { id: 1012, name: '식품' },
  { id: 1014, name: '생활용품' },
  { id: 1010, name: '뷰티' },
  { id: 1016, name: '가전디지털' },
  { id: 1013, name: '주방용품' },
  { id: 1001, name: '여성패션' },
  { id: 1002, name: '남성패션' },
  { id: 1017, name: '스포츠/레저' },
  { id: 1024, name: '헬스/건강' },
  { id: 1029, name: '반려동물' },
  { id: 1011, name: '출산/유아동' },
  { id: 1015, name: '홈인테리어' },
  { id: 1020, name: '완구/취미' },
  { id: 1018, name: '자동차용품' },
  { id: 1019, name: '도서/음반' },
  { id: 1021, name: '문구/오피스' },
];

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-[#e5e8eb] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto relative">
        {/* 좌측 그라데이션 힌트 */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* 우측 그라데이션 힌트 */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* 스크롤 스냅 + 터치 스크롤 최적화 */}
        <div
          className="flex overflow-x-auto scrollbar-hide py-2 px-4 gap-2"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth'
          }}
        >
          {categories.map((category) => {
            const isActive = pathname === `/category/${category.id}`;

            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className={`group flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-full whitespace-nowrap transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3182f6] to-[#6366f1] text-white shadow-md shadow-blue-200'
                    : 'bg-[#f2f4f6] text-[#4e5968] active:scale-95 active:bg-[#e5e8eb]'
                }`}
                style={{ scrollSnapAlign: 'center' }}
              >
                <span className="text-[14px]">
                  {categoryEmojis[category.id] || '📦'}
                </span>
                <span className="text-[12px] font-medium">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
