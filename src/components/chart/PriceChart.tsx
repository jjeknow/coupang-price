'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, AreaSeries, LineData, Time } from 'lightweight-charts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface PriceData {
  time: string;
  price: number;
}

interface PriceChartProps {
  data: PriceData[];
  currentPrice: number;
  lowestPrice?: number;
  highestPrice?: number;
  height?: number;
}

export default function PriceChart({
  data,
  currentPrice,
  lowestPrice,
  highestPrice,
  height = 280,
}: PriceChartProps) {
  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일에서 높이 조정
  const chartHeight = isMobile ? 220 : height;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 토스 스타일 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#8b95a1',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: '#f2f4f6' },
        horzLines: { color: '#f2f4f6' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartHeight,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.15,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        tickMarkFormatter: (time: Time) => {
          const date = new Date(time as string);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
      },
      localization: {
        locale: 'ko-KR',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#3182f6',
          style: 2,
          labelBackgroundColor: '#3182f6',
        },
        horzLine: {
          width: 1,
          color: '#3182f6',
          style: 2,
          labelBackgroundColor: '#3182f6',
        },
      },
      handleScale: {
        axisPressedMouseMove: false,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });

    chartRef.current = chart;

    // 가격 범위 계산 (Y축 스케일용)
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // 가격 변동이 거의 없으면 최소 5% 마진 적용
    const minMargin = minPrice * 0.05;
    const actualMargin = Math.max(priceRange * 0.1, minMargin);

    // 토스 블루 그라데이션 Area 시리즈
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#3182f6',
      topColor: 'rgba(49, 130, 246, 0.3)',
      bottomColor: 'rgba(49, 130, 246, 0.02)',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => `${Math.round(price).toLocaleString('ko-KR')}원`,
      },
      autoscaleInfoProvider: () => ({
        priceRange: {
          minValue: minPrice - actualMargin,
          maxValue: maxPrice + actualMargin,
        },
      }),
    });

    seriesRef.current = areaSeries;

    if (data && data.length > 0) {
      const chartData: LineData<Time>[] = data.map((item) => ({
        time: item.time as Time,
        value: item.price,
      }));
      areaSeries.setData(chartData);

      // 최저가 라인
      if (lowestPrice) {
        areaSeries.createPriceLine({
          price: lowestPrice,
          color: '#0ca678',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          axisLabelColor: '#0ca678',
          title: '',
        });
      }

      // 최고가 라인
      if (highestPrice) {
        areaSeries.createPriceLine({
          price: highestPrice,
          color: '#f59f00',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          axisLabelColor: '#f59f00',
          title: '',
        });
      }
    }

    chart.timeScale().fitContent();
    setIsLoading(false);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, lowestPrice, highestPrice, chartHeight]);

  // 7일 전 가격 찾기
  const getComparisonPrice = () => {
    if (data.length < 2) return null;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 7일 전 또는 그 이전 데이터 중 가장 가까운 것
    const comparisonData = data.find(d => {
      const date = new Date(d.time);
      return date <= sevenDaysAgo;
    });

    return comparisonData || null;
  };

  const comparisonData = getComparisonPrice();

  const stats = {
    current: currentPrice,
    lowest: lowestPrice || currentPrice,
    highest: highestPrice || currentPrice,
    average: data.length > 0
      ? Math.round(data.reduce((sum, d) => sum + d.price, 0) / data.length)
      : currentPrice,
    change: comparisonData
      ? currentPrice - comparisonData.price
      : 0,
    changePercent: comparisonData
      ? ((currentPrice - comparisonData.price) / comparisonData.price * 100)
      : 0,
  };

  const isLowest = lowestPrice && currentPrice <= lowestPrice;

  const getTrendIcon = () => {
    if (stats.change > 0) return <TrendingUp size={14} className="text-[#f04452]" />;
    if (stats.change < 0) return <TrendingDown size={14} className="text-[#00c471]" />;
    return <Minus size={14} className="text-[#5c6470]" />;
  };

  const getTrendColor = () => {
    if (stats.change > 0) return 'text-[#f04452]';
    if (stats.change < 0) return 'text-[#00c471]';
    return 'text-[#5c6470]';
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#191f28] mb-0.5">가격 변동 추이</h3>
          <p className="text-[11px] text-[#5c6470]">전체 가격 히스토리</p>
        </div>
        <div className="flex items-center gap-1.5">
          {isLowest && (
            <span className="flex items-center gap-1 px-2 py-1 bg-[#fff0f0] text-[#c92a2a] text-[10px] font-semibold rounded-md">
              <TrendingDown size={10}  />
              역대 최저가
            </span>
          )}
          {stats.changePercent < -5 && !isLowest && (
            <span className="flex items-center gap-1 px-2 py-1 bg-[#e6f9ed] text-[#0ca678] text-[10px] font-semibold rounded-md">
              구매 적기
            </span>
          )}
        </div>
      </div>

      {/* 가격 변동 요약 - 반응형 그리드 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2.5 bg-[#f2f4f6] rounded-lg text-center">
          <p className="text-[10px] text-[#5c6470] mb-0.5">7일 전 대비</p>
          <div className="flex items-center justify-center gap-0.5">
            {comparisonData ? (
              <>
                {getTrendIcon()}
                <span className={`text-[13px] font-bold ${getTrendColor()}`}>
                  {stats.changePercent > 0 ? '+' : ''}{stats.changePercent.toFixed(1)}%
                </span>
              </>
            ) : (
              <span className="text-[13px] font-bold text-[#5c6470]">-</span>
            )}
          </div>
        </div>
        <div className="p-2.5 bg-[#e8f3ff] rounded-lg text-center">
          <p className="text-[10px] text-[#1d4ed8] mb-0.5">평균가</p>
          <p className="text-[12px] font-bold text-[#1d4ed8]">
            {stats.average.toLocaleString('ko-KR')}원
          </p>
        </div>
        <div className="p-2.5 bg-[#fff0f0] rounded-lg text-center">
          <p className="text-[10px] text-[#c92a2a] mb-0.5">최저가</p>
          <p className="text-[12px] font-bold text-[#c92a2a]">
            {stats.lowest.toLocaleString('ko-KR')}원
          </p>
        </div>
      </div>

      {/* 차트 */}
      <div
        ref={chartContainerRef}
        className="w-full relative rounded-xl overflow-hidden bg-white"
        style={{ height: `${chartHeight}px` }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f2f4f6]">
            <div className="spinner" />
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3182f6]" />
          <span className="text-[10px] text-[#5c6470]">가격</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5" style={{ borderTop: '2px dashed #0ca678' }} />
          <span className="text-[10px] text-[#5c6470]">최저가</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5" style={{ borderTop: '2px dashed #f59f00' }} />
          <span className="text-[10px] text-[#5c6470]">최고가</span>
        </div>
      </div>

      {/* 안내 */}
      <p className="text-[10px] text-[#5c6470] text-center mt-4">
        가격 정보는 실시간으로 업데이트됩니다. 정확한 가격은 쿠팡에서 확인해주세요.
      </p>
    </div>
  );
}
