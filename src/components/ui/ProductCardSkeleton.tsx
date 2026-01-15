'use client';

export default function ProductCardSkeleton() {
  return (
    <div className="toss-card overflow-hidden" aria-hidden="true">
      {/* 이미지 영역 스켈레톤 */}
      <div className="relative aspect-square bg-[#f2f4f6] overflow-hidden">
        <div className="absolute inset-0 skeleton" />
        {/* 배지 스켈레톤 */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className="w-16 h-5 skeleton rounded-md" />
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="w-20 h-5 skeleton rounded-md" />
        </div>
      </div>

      {/* 정보 영역 스켈레톤 */}
      <div className="p-4">
        {/* 카테고리 */}
        <div className="w-16 h-3 skeleton rounded mb-2" />

        {/* 상품명 */}
        <div className="space-y-1.5 mb-3">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-3/4" />
        </div>

        {/* 가격 */}
        <div className="flex items-baseline gap-1">
          <div className="h-6 w-24 skeleton rounded" />
          <div className="h-4 w-6 skeleton rounded" />
        </div>
      </div>

      {/* 버튼 스켈레톤 */}
      <div className="px-4 pb-4">
        <div className="h-10 skeleton rounded-xl w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="status"
      aria-label="상품 로딩 중"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
      <span className="sr-only">상품을 불러오는 중입니다...</span>
    </div>
  );
}
