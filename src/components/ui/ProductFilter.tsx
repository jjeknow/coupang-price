'use client';

import { Zap, Truck } from 'lucide-react';

export type FilterOption = {
  rocketOnly: boolean;
  freeShippingOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
};

interface ProductFilterProps {
  filter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  totalCount: number;
}

export default function ProductFilter({
  filter,
  onFilterChange,
  totalCount,
}: ProductFilterProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-[14px] text-[#5c6470]">
        총 <span className="font-semibold text-[#191f28]">{totalCount}</span>개 상품
      </p>

      <div className="flex items-center gap-2">
        {/* 로켓배송 필터 */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filter, rocketOnly: !filter.rocketOnly })}
          className={`flex items-center gap-1.5 px-3 py-2 text-[13px] rounded-lg border transition-colors ${
            filter.rocketOnly
              ? 'bg-[#3182f6] text-white border-[#3182f6]'
              : 'bg-white text-[#4e5968] border-[#e5e8eb] hover:border-[#3182f6]'
          }`}
        >
          <Zap size={14} />
          로켓배송
        </button>

        {/* 무료배송 필터 */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filter, freeShippingOnly: !filter.freeShippingOnly })}
          className={`flex items-center gap-1.5 px-3 py-2 text-[13px] rounded-lg border transition-colors ${
            filter.freeShippingOnly
              ? 'bg-[#3182f6] text-white border-[#3182f6]'
              : 'bg-white text-[#4e5968] border-[#e5e8eb] hover:border-[#3182f6]'
          }`}
        >
          <Truck size={14} />
          무료배송
        </button>
      </div>
    </div>
  );
}
