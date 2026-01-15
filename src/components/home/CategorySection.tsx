'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

// 메인 카테고리 (8개 - 기본 표시)
const CATEGORY_MAIN = [
  { id: 1016, name: '가전', emoji: '📺' },
  { id: 1012, name: '식품', emoji: '🍎' },
  { id: 1010, name: '뷰티', emoji: '💄' },
  { id: 1014, name: '생활용품', emoji: '🧹' },
  { id: 1013, name: '주방', emoji: '🍳' },
  { id: 1017, name: '스포츠', emoji: '⚽' },
  { id: 1024, name: '건강', emoji: '💊' },
  { id: 1029, name: '반려동물', emoji: '🐶' },
];

// 추가 카테고리 (더보기 시 표시)
const CATEGORY_MORE = [
  { id: 1001, name: '여성패션', emoji: '👗' },
  { id: 1002, name: '남성패션', emoji: '👔' },
  { id: 1011, name: '출산/유아', emoji: '👶' },
  { id: 1015, name: '인테리어', emoji: '🛋️' },
  { id: 1020, name: '완구/취미', emoji: '🎮' },
  { id: 1018, name: '자동차', emoji: '🚗' },
  { id: 1019, name: '도서', emoji: '📚' },
  { id: 1021, name: '문구', emoji: '✏️' },
];

export default function CategorySection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="bg-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-[15px] font-bold text-[#191f28] text-center mb-6 px-2">
          🔍 찾고 싶은 카테고리를 선택해 보세요!
        </h2>

        {/* 메인 카테고리 */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {CATEGORY_MAIN.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[28px] bg-[#f8f9fa] group-hover:scale-110 group-hover:bg-[#e8f3ff] transition-all duration-200">
                {cat.emoji}
              </div>
              <span className="text-[12px] text-[#4e5968] font-medium group-hover:text-[#3182f6] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* 추가 카테고리 (토글) */}
        {showMore && (
          <div className="grid grid-cols-4 gap-4 mb-4 animate-fadeIn">
            {CATEGORY_MORE.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[28px] bg-[#f8f9fa] group-hover:scale-110 group-hover:bg-[#e8f3ff] transition-all duration-200">
                  {cat.emoji}
                </div>
                <span className="text-[12px] text-[#4e5968] font-medium group-hover:text-[#3182f6] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* 더보기/접기 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 px-5 py-2 text-[13px] text-[#4e5968] bg-[#f2f4f6] hover:bg-[#e5e8eb] rounded-full transition-colors"
          >
            {showMore ? (
              <>
                접기
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                더보기
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
