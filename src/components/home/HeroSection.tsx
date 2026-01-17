import { Sparkles } from 'lucide-react';
import HeroSearchForm from './HeroSearchForm';

/**
 * 히어로 섹션 (서버 컴포넌트)
 * LCP 최적화: 정적 콘텐츠는 서버에서 렌더링
 */
export default function HeroSection() {
  return (
    <section className="relative">
      {/* 다크 블루 그라데이션 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      </div>

      {/* 글로우 이펙트 - animate-pulse 제거 (리플로우 방지) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#3b82f6]/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6366f1]/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#0ea5e9]/20 rounded-full blur-[80px]" />
        </div>
      </div>

      {/* 그리드 패턴 오버레이 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* 뱃지 */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-3">
            <Sparkles size={12} className="text-[#60a5fa]" />
            <span className="text-[12px] text-white/80">쿠팡 가격변동 알리미</span>
          </div>

          {/* 타이틀 - LCP 요소 */}
          <h1 className="text-[22px] font-bold leading-tight mb-2 tracking-tight text-white">
            쿠팡 가격변동 추적{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#a78bfa] to-[#60a5fa]">
              &amp; 최저가 알림
            </span>
          </h1>
          <p className="text-[#94a3b8] text-[13px] mb-5 max-w-md">
            쿠팡 가격비교, 실시간 가격 그래프로 최적의 구매 타이밍을 찾아보세요.
          </p>

          {/* 검색창 (클라이언트 컴포넌트) */}
          <HeroSearchForm />

          {/* 파트너스 고지 */}
          <div className="mx-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
            <p className="text-[#94a3b8] text-[10px]">
              본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
