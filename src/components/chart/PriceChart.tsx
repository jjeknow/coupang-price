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
  height = 300,
}: PriceChartProps) {
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
      height: height,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.15,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
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

    // 토스 블루 그라데이션 Area 시리즈
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#3182f6',
      topColor: 'rgba(49, 130, 246, 0.3)',
      bottomColor: 'rgba(49, 130, 246, 0.02)',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => `${price.toLocaleString('ko-KR')}원`,
      },
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
          color: '#00c471',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: '',
        });
      }

      // 최고가 라인
      if (highestPrice) {
        areaSeries.createPriceLine({
          price: highestPrice,
          color: '#ff8b00',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
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
  }, [data, lowestPrice, highestPrice, height]);

  const stats = {
    current: currentPrice,
    lowest: lowestPrice || currentPrice,
    highest: highestPrice || currentPrice,
    average: data.length > 0
      ? Math.round(data.reduce((sum, d) => sum + d.price, 0) / data.length)
      : currentPrice,
    change: data.length >= 2
      ? currentPrice - data[0].price
      : 0,
    changePercent: data.length >= 2
      ? ((currentPrice - data[0].price) / data[0].price * 100)
      : 0,
  };

  const isLowest = lowestPrice && currentPrice <= lowestPrice;

  const getTrendIcon = () => {
    if (stats.change > 0) return <TrendingUp size={14} className="text-[#f04452]" />;
    if (stats.change < 0) return <TrendingDown size={14} className="text-[#00c471]" />;
    return <Minus size={14} className="text-[#8b95a1]" />;
  };

  const getTrendColor = () => {
    if (stats.change > 0) return 'text-[#f04452]';
    if (stats.change < 0) return 'text-[#00c471]';
    return 'text-[#8b95a1]';
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="toss-title-3 mb-1">가격 변동 추이</h3>
          <p className="toss-caption">최근 30일간 가격 변동</p>
        </div>
        {isLowest && (
          <span className="toss-badge toss-badge-red flex items-center gap-1 px-3 py-1.5">
            <TrendingDown size={12} />
            역대 최저가
          </span>
        )}
      </div>

      {/* 가격 변동 요약 */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-[#f2f4f6] rounded-xl">
        <div>
          <p className="toss-caption mb-0.5">30일 전 대비</p>
          <div className="flex items-center gap-1.5">
            {getTrendIcon()}
            <span className={`text-[15px] font-bold ${getTrendColor()}`}>
              {stats.change > 0 ? '+' : ''}{stats.change.toLocaleString('ko-KR')}원
            </span>
            <span className={`text-[13px] ${getTrendColor()}`}>
              ({stats.changePercent > 0 ? '+' : ''}{stats.changePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="w-px h-8 bg-[#e5e8eb]" />
        <div>
          <p className="toss-caption mb-0.5">평균가</p>
          <p className="text-[15px] font-bold text-[#191f28]">
            {stats.average.toLocaleString('ko-KR')}원
          </p>
        </div>
      </div>

      {/* 차트 */}
      <div
        ref={chartContainerRef}
        className="w-full relative rounded-xl overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f2f4f6]">
            <div className="spinner" />
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3182f6]" />
          <span className="toss-caption">가격</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#00c471]" style={{ borderTop: '2px dashed #00c471' }} />
          <span className="toss-caption">최저가</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#ff8b00]" style={{ borderTop: '2px dashed #ff8b00' }} />
          <span className="toss-caption">최고가</span>
        </div>
      </div>

      {/* 안내 */}
      <p className="toss-caption text-center mt-6">
        가격 정보는 실시간으로 업데이트됩니다. 정확한 가격은 쿠팡에서 확인해주세요.
      </p>
    </div>
  );
}
