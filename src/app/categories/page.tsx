import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '카테고리 - 전체 카테고리',
  description: '쿠팡 전체 카테고리에서 원하는 상품을 찾아보세요. 가전, 식품, 뷰티 등 다양한 카테고리의 가격 변동을 추적합니다.',
  openGraph: {
    title: '카테고리 | 똑체크',
    description: '전체 카테고리에서 원하는 상품을 찾아보세요.',
  },
};

const categories = [
  { id: 1012, name: '식품', emoji: '🍎', color: 'bg-red-50', textColor: 'text-red-600' },
  { id: 1014, name: '생활용품', emoji: '🧹', color: 'bg-green-50', textColor: 'text-green-600' },
  { id: 1010, name: '뷰티', emoji: '💄', color: 'bg-pink-50', textColor: 'text-pink-600' },
  { id: 1016, name: '가전디지털', emoji: '📺', color: 'bg-blue-50', textColor: 'text-blue-600' },
  { id: 1013, name: '주방용품', emoji: '🍳', color: 'bg-orange-50', textColor: 'text-orange-600' },
  { id: 1001, name: '여성패션', emoji: '👗', color: 'bg-purple-50', textColor: 'text-purple-600' },
  { id: 1002, name: '남성패션', emoji: '👔', color: 'bg-indigo-50', textColor: 'text-indigo-600' },
  { id: 1017, name: '스포츠/레저', emoji: '⚽', color: 'bg-emerald-50', textColor: 'text-emerald-600' },
  { id: 1024, name: '헬스/건강', emoji: '💪', color: 'bg-teal-50', textColor: 'text-teal-600' },
  { id: 1029, name: '반려동물', emoji: '🐶', color: 'bg-amber-50', textColor: 'text-amber-600' },
  { id: 1011, name: '출산/유아동', emoji: '👶', color: 'bg-rose-50', textColor: 'text-rose-600' },
  { id: 1015, name: '홈인테리어', emoji: '🛋️', color: 'bg-slate-50', textColor: 'text-slate-600' },
  { id: 1020, name: '완구/취미', emoji: '🎮', color: 'bg-violet-50', textColor: 'text-violet-600' },
  { id: 1018, name: '자동차용품', emoji: '🚗', color: 'bg-gray-50', textColor: 'text-gray-600' },
  { id: 1019, name: '도서/음반', emoji: '📚', color: 'bg-yellow-50', textColor: 'text-yellow-600' },
  { id: 1021, name: '문구/오피스', emoji: '✏️', color: 'bg-cyan-50', textColor: 'text-cyan-600' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb] py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold text-[#191f28]">카테고리</h1>
        </div>
      </div>

      {/* 카테고리 그리드 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-[0.98] border border-[#e5e8eb]"
            >
              <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-2xl`}>
                {category.emoji}
              </div>
              <span className="text-[13px] font-medium text-[#191f28]">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
