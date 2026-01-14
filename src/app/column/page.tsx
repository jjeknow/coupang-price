import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ChevronRight, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: '똑체크 칼럼 | 쿠팡 상품 추천 & 구매 가이드',
  description: '전문가가 엄선한 쿠팡 상품 추천, 가격대별 구매 가이드, 카테고리별 비교 분석 칼럼을 확인하세요. 똑똑한 쇼핑을 위한 필수 정보!',
  openGraph: {
    title: '똑체크 칼럼 | 쿠팡 상품 추천 & 구매 가이드',
    description: '전문가가 엄선한 쿠팡 상품 추천, 가격대별 구매 가이드를 확인하세요.',
    type: 'website',
  },
};

// 칼럼 데이터 (추후 DB나 CMS로 관리 가능)
const columns = [
  {
    slug: '50만원대-노트북-추천-2026',
    title: '2026년 50만원대 노트북 추천 TOP 5',
    subtitle: '전문가가 직접 비교한 가성비 최강 가이드',
    excerpt: '50만원대에서 라이젠7을 만나다! ASUS 비보북, HP, 레노버 아이디어패드를 실사용 관점에서 비교 분석했습니다.',
    category: '노트북',
    categoryColor: 'bg-blue-500',
    thumbnail: '/images/column/notebook-thumbnail.jpg',
    author: '똑체크 에디터',
    publishedAt: '2026-01-14',
    readTime: 12,
    tags: ['노트북', '가성비', '50만원대', '레노버', 'ASUS', 'HP'],
    featured: true,
  },
  // 추후 칼럼 추가
];

// 카테고리 목록
const categories = [
  { name: '전체', slug: 'all', count: columns.length },
  { name: '노트북', slug: 'notebook', count: 1 },
  { name: '가전', slug: 'appliance', count: 0 },
  { name: '생활용품', slug: 'living', count: 0 },
  { name: '식품', slug: 'food', count: 0 },
];

export default function ColumnListPage() {
  const featuredColumn = columns.find(c => c.featured);
  const otherColumns = columns.filter(c => !c.featured);

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-[#3182f6] to-[#1b64da] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <Link href="/" className="hover:text-white">홈</Link>
            <ChevronRight size={14} />
            <span>칼럼</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            똑체크 칼럼
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            전문가가 엄선한 쿠팡 상품 추천과 구매 가이드.
            가격대별, 용도별 최적의 제품을 찾아드립니다.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                cat.slug === 'all'
                  ? 'bg-[#3182f6] text-white'
                  : 'bg-white text-[#4e5968] hover:bg-[#e5e8eb]'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 칼럼 목록 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured 칼럼 */}
            {featuredColumn && (
              <Link href={`/column/${featuredColumn.slug}`} className="block group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#e5e8eb]">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-[#3182f6] to-[#1b64da]">
                    {/* 썸네일 대신 그라데이션 배경 + 아이콘 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TrendingUp size={40} />
                        </div>
                        <span className="text-lg font-medium opacity-90">추천 칼럼</span>
                      </div>
                    </div>
                    {/* Featured 배지 */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#f04452] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        FEATURED
                      </span>
                    </div>
                    {/* 카테고리 */}
                    <div className="absolute top-4 right-4">
                      <span className={`${featuredColumn.categoryColor} text-white text-xs font-medium px-3 py-1.5 rounded-full`}>
                        {featuredColumn.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-[#191f28] mb-2 group-hover:text-[#3182f6] transition-colors">
                      {featuredColumn.title}
                    </h2>
                    <p className="text-[#6b7684] mb-4 line-clamp-2">
                      {featuredColumn.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-[#8b95a1]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {featuredColumn.publishedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {featuredColumn.readTime}분
                        </span>
                      </div>
                      <span className="text-[#3182f6] font-medium group-hover:underline">
                        자세히 보기 →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* 다른 칼럼들 */}
            {otherColumns.map((column) => (
              <Link key={column.slug} href={`/column/${column.slug}`} className="block group">
                <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#e5e8eb] flex">
                  <div className="relative w-32 md:w-48 flex-shrink-0 bg-gradient-to-br from-[#6b7684] to-[#4e5968]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TrendingUp size={24} className="text-white/50" />
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${column.categoryColor} text-white text-[10px] font-medium px-2 py-0.5 rounded`}>
                        {column.category}
                      </span>
                      <span className="text-[#8b95a1] text-xs">{column.publishedAt}</span>
                    </div>
                    <h3 className="font-bold text-[#191f28] mb-1 group-hover:text-[#3182f6] transition-colors line-clamp-1">
                      {column.title}
                    </h3>
                    <p className="text-sm text-[#6b7684] line-clamp-2">
                      {column.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}

            {/* 칼럼이 없을 때 */}
            {columns.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#e5e8eb]">
                <div className="w-16 h-16 bg-[#f2f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-[#adb5bd]" />
                </div>
                <h3 className="text-lg font-semibold text-[#191f28] mb-2">
                  곧 새로운 칼럼이 올라옵니다
                </h3>
                <p className="text-[#6b7684]">
                  유용한 쇼핑 가이드를 준비하고 있어요!
                </p>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <aside className="space-y-6">
            {/* 인기 태그 */}
            <div className="bg-white rounded-xl p-6 border border-[#e5e8eb]">
              <h3 className="font-bold text-[#191f28] mb-4">인기 태그</h3>
              <div className="flex flex-wrap gap-2">
                {['노트북', '가성비', '에어프라이어', '로봇청소기', '무선청소기', '모니터'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-[#f2f4f6] text-[#4e5968] text-sm rounded-full hover:bg-[#e5e8eb] cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 똑체크 소개 */}
            <div className="bg-gradient-to-br from-[#3182f6] to-[#1b64da] rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2">가격 추적은 똑체크!</h3>
              <p className="text-sm text-white/90 mb-4">
                쿠팡 가격 변동을 실시간으로 추적하고, 최저가에 알림을 받으세요.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-[#3182f6] font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
              >
                지금 시작하기
              </Link>
            </div>

            {/* 칼럼 요청 */}
            <div className="bg-white rounded-xl p-6 border border-[#e5e8eb]">
              <h3 className="font-bold text-[#191f28] mb-2">원하는 칼럼이 있나요?</h3>
              <p className="text-sm text-[#6b7684] mb-4">
                어떤 상품 추천 글이 필요하신지 알려주세요!
              </p>
              <a
                href="mailto:help@ddokcheck.com?subject=칼럼 요청"
                className="inline-block bg-[#f2f4f6] text-[#4e5968] font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#e5e8eb] transition-colors"
              >
                칼럼 요청하기
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
