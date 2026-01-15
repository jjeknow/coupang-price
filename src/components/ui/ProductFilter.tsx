'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Zap, Truck, X } from 'lucide-react';

export type SortOption = 'default' | 'price_asc' | 'price_desc';
export type FilterOption = {
  rocketOnly: boolean;
  freeShippingOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
};

interface ProductFilterProps {
  sort: SortOption;
  filter: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  totalCount: number;
}

const SORT_OPTIONS = [
  { value: 'default', label: '기본순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
];

export default function ProductFilter({
  sort,
  filter,
  onSortChange,
  onFilterChange,
  totalCount,
}: ProductFilterProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const activeFilterCount = [
    filter.rocketOnly,
    filter.freeShippingOnly,
    filter.minPrice !== undefined,
    filter.maxPrice !== undefined,
  ].filter(Boolean).length;

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || '기본순';

  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-[14px] text-[#6b7684]">
        총 <span className="font-semibold text-[#191f28]">{totalCount}</span>개 상품
      </p>

      <div className="flex items-center gap-2">
        {/* 필터 버튼 */}
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`flex items-center gap-1.5 px-3 py-2 text-[13px] rounded-lg border transition-colors ${
            activeFilterCount > 0
              ? 'bg-[#3182f6] text-white border-[#3182f6]'
              : 'bg-white text-[#4e5968] border-[#e5e8eb] hover:border-[#3182f6]'
          }`}
        >
          <SlidersHorizontal size={14} />
          필터
          {activeFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 bg-white text-[#3182f6] text-[11px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* 정렬 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] bg-white text-[#4e5968] border border-[#e5e8eb] rounded-lg hover:border-[#3182f6] transition-colors"
          >
            {currentSortLabel}
            <ChevronDown size={14} className={showSortDropdown ? 'rotate-180' : ''} />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#e5e8eb] rounded-lg shadow-lg z-10 min-w-[120px]">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value as SortOption);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-[13px] hover:bg-[#f2f4f6] first:rounded-t-lg last:rounded-b-lg ${
                    sort === option.value ? 'text-[#3182f6] font-medium' : 'text-[#4e5968]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilterPanel && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end items-center justify-center">
          <div className="bg-white w-full  rounded-t-xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#e5e8eb]">
              <h3 className="text-[16px] font-bold text-[#191f28]">필터</h3>
              <button onClick={() => setShowFilterPanel(false)}>
                <X size={20} className="text-[#6b7684]" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* 배송 필터 */}
              <div>
                <h4 className="text-[14px] font-medium text-[#191f28] mb-3">배송</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onFilterChange({ ...filter, rocketOnly: !filter.rocketOnly })}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] border transition-colors ${
                      filter.rocketOnly
                        ? 'bg-[#3182f6] text-white border-[#3182f6]'
                        : 'bg-white text-[#4e5968] border-[#e5e8eb]'
                    }`}
                  >
                    <Zap size={14} />
                    로켓배송
                  </button>
                  <button
                    onClick={() => onFilterChange({ ...filter, freeShippingOnly: !filter.freeShippingOnly })}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] border transition-colors ${
                      filter.freeShippingOnly
                        ? 'bg-[#3182f6] text-white border-[#3182f6]'
                        : 'bg-white text-[#4e5968] border-[#e5e8eb]'
                    }`}
                  >
                    <Truck size={14} />
                    무료배송
                  </button>
                </div>
              </div>

              {/* 가격 필터 */}
              <div>
                <h4 className="text-[14px] font-medium text-[#191f28] mb-3">가격</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="최소"
                    value={filter.minPrice || ''}
                    onChange={(e) => onFilterChange({
                      ...filter,
                      minPrice: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="flex-1 px-3 py-2 border border-[#e5e8eb] rounded-lg text-[14px] focus:outline-none focus:border-[#3182f6]"
                  />
                  <span className="text-[#8b95a1]">~</span>
                  <input
                    type="number"
                    placeholder="최대"
                    value={filter.maxPrice || ''}
                    onChange={(e) => onFilterChange({
                      ...filter,
                      maxPrice: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="flex-1 px-3 py-2 border border-[#e5e8eb] rounded-lg text-[14px] focus:outline-none focus:border-[#3182f6]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#e5e8eb] flex gap-3">
              <button
                onClick={() => {
                  onFilterChange({ rocketOnly: false, freeShippingOnly: false });
                  setShowFilterPanel(false);
                }}
                className="flex-1 py-3 text-[14px] text-[#4e5968] border border-[#e5e8eb] rounded-xl hover:bg-[#f2f4f6]"
              >
                초기화
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="flex-1 py-3 text-[14px] text-white bg-[#3182f6] rounded-xl hover:bg-[#1b64da]"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
