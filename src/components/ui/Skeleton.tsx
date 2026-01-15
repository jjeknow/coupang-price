'use client';

import { memo } from 'react';

// 기본 스켈레톤 컴포넌트
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#f2f4f6] via-[#e5e8eb] to-[#f2f4f6] bg-[length:200%_100%] rounded-lg ${className}`}
      style={{
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

// 상품 카드 스켈레톤
export function ProductCardSkeleton() {
  return (
    <div className="animate-fadeIn">
      {/* 이미지 영역 */}
      <div className="relative aspect-square bg-[#f2f4f6] rounded-xl overflow-hidden mb-2 border border-[#e5e8eb]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#f2f4f6] via-[#e5e8eb] to-[#f2f4f6] bg-[length:200%_100%] animate-shimmer" />
      </div>

      {/* 상품명 */}
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* 가격 */}
      <div className="mt-2 px-1">
        <Skeleton className="h-5 w-24" />
      </div>

      {/* 배지 영역 */}
      <div className="mt-2 flex gap-1.5 px-1">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
    </div>
  );
}

// 상품 그리드 스켈레톤
export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 상품 상세 페이지 스켈레톤
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid gap-4">
          {/* 이미지 영역 */}
          <div className="aspect-square bg-white rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full rounded-none" />
          </div>

          {/* 상품 정보 영역 */}
          <div className="space-y-6">
            {/* 카테고리 */}
            <Skeleton className="h-5 w-20" />

            {/* 상품명 */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-3/4" />
            </div>

            {/* 가격 */}
            <Skeleton className="h-10 w-32" />

            {/* 가격 정보 테이블 */}
            <div className="border border-[#e5e8eb] rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 gap-px bg-[#e5e8eb]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white p-4">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 w-14 rounded-xl" />
            </div>
          </div>
        </div>

        {/* 가격 차트 영역 */}
        <div className="mt-8 bg-white rounded-2xl p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// 카테고리 네비게이션 스켈레톤
export function CategoryNavSkeleton() {
  return (
    <div className="bg-white border-b border-[#e5e8eb] py-3 px-4">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

// 검색 결과 스켈레톤
export function SearchResultSkeleton() {
  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProductGridSkeleton count={10} />
      </div>
    </div>
  );
}

// 홈페이지 섹션 스켈레톤
export function HomeSectionSkeleton() {
  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>

        {/* 상품 그리드 */}
        <ProductGridSkeleton count={10} />
      </div>
    </div>
  );
}

export default memo(Skeleton);
