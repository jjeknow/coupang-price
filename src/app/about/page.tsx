import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import {
  TrendingDown,
  Bell,
  Search,
  Shield,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Clock,
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';

export const metadata: Metadata = {
  title: '서비스 소개 | 쿠팡 가격 추적 - 최저가 알림 서비스',
  description:
    '쿠팡 상품의 가격 변동을 실시간으로 추적하고, 원하는 가격이 되면 알림을 받아보세요. 스마트한 쇼핑을 위한 무료 가격 추적 서비스입니다.',
  keywords: [
    '쿠팡 가격 추적',
    '최저가 알림',
    '가격 변동',
    '쿠팡 할인',
    '스마트 쇼핑',
    '가격 비교',
    '쿠팡 로켓배송',
  ],
  openGraph: {
    title: '서비스 소개 | 쿠팡 가격 추적',
    description: '쿠팡 상품 가격 변동 추적 및 최저가 알림 서비스',
    type: 'website',
    url: `${BASE_URL}/about`,
  },
  twitter: {
    card: 'summary_large_image',
    title: '서비스 소개 | 쿠팡 가격 추적',
    description: '쿠팡 상품 가격 변동 추적 및 최저가 알림 서비스',
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

const features = [
  {
    icon: TrendingDown,
    title: '실시간 가격 추적',
    description:
      '관심 상품의 가격 변동을 실시간으로 모니터링합니다. 가격이 내려가면 바로 확인할 수 있어요.',
    color: 'text-[#c92a2a]',
    bgColor: 'bg-[#fff0f0]',
  },
  {
    icon: Bell,
    title: '최저가 알림',
    description:
      '원하는 가격을 설정해두면, 해당 가격 이하로 내려갈 때 알림을 보내드립니다.',
    color: 'text-[#3182f6]',
    bgColor: 'bg-[#e8f3ff]',
  },
  {
    icon: BarChart3,
    title: '가격 히스토리',
    description:
      '과거 가격 변동 추이를 그래프로 확인하고, 최적의 구매 시점을 파악하세요.',
    color: 'text-[#7c3aed]',
    bgColor: 'bg-[#f3e8ff]',
  },
  {
    icon: Search,
    title: '스마트 검색',
    description:
      '상품명이나 쿠팡 URL을 입력하면 자동으로 상품을 찾아 가격 추적을 시작합니다.',
    color: 'text-[#0ca678]',
    bgColor: 'bg-[#e6f9ed]',
  },
  {
    icon: Heart,
    title: '관심 상품 관리',
    description:
      '자주 확인하는 상품을 관심 목록에 저장하고 한눈에 가격 변동을 확인하세요.',
    color: 'text-[#f04452]',
    bgColor: 'bg-[#ffefef]',
  },
  {
    icon: Zap,
    title: '빠른 속도',
    description:
      '최적화된 시스템으로 빠르게 상품 정보를 불러오고 가격을 비교합니다.',
    color: 'text-[#fab005]',
    bgColor: 'bg-[#fff9db]',
  },
];

const benefits = [
  '매일 수천 개의 상품 가격을 자동으로 체크',
  '가격 하락 시 즉시 알림 발송',
  '과거 가격 데이터로 구매 타이밍 분석',
  '무료로 무제한 상품 추적 가능',
  '쿠팡 공식 API 연동으로 정확한 정보 제공',
  '로켓배송/무료배송 상품 필터링',
];

const faqs = [
  {
    question: '서비스 이용료가 있나요?',
    answer:
      '완전 무료입니다. 모든 기능을 무료로 이용하실 수 있습니다.',
  },
  {
    question: '어떤 상품을 추적할 수 있나요?',
    answer:
      '쿠팡에서 판매되는 모든 상품의 가격을 추적할 수 있습니다. 상품명 검색 또는 쿠팡 URL 입력으로 상품을 등록하세요.',
  },
  {
    question: '가격 알림은 어떻게 받나요?',
    answer:
      '관심 상품에 목표 가격을 설정하면, 해당 가격 이하로 내려갈 때 브라우저 알림 또는 이메일로 알려드립니다.',
  },
  {
    question: '가격 정보는 얼마나 자주 업데이트되나요?',
    answer:
      '쿠팡 공식 API를 통해 실시간으로 가격 정보를 가져옵니다. 대부분의 가격 변동을 빠르게 반영합니다.',
  },
];

// FAQPage JSON-LD 스키마
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

// BreadcrumbList JSON-LD 스키마
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '서비스 소개',
      item: `${BASE_URL}/about`,
    },
  ],
};

// AboutPage JSON-LD 스키마
const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: '쿠팡 최저가 서비스 소개',
  description: '쿠팡 상품의 가격 변동을 실시간으로 추적하고, 원하는 가격이 되면 알림을 받아보세요.',
  url: `${BASE_URL}/about`,
  mainEntity: {
    '@type': 'WebApplication',
    name: '쿠팡 최저가',
    applicationCategory: 'ShoppingApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD 구조화 데이터 */}
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]">
          <div className="absolute top-0 left-0 w-48 h-48 bg-[#3b82f6]/30 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#6366f1]/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-4">
            <Shield size={14} className="text-[#60a5fa]" />
            <span className="text-[12px] text-white/80">안전하고 신뢰할 수 있는 서비스</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4 leading-tight">
            쿠팡 가격 추적으로
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#a78bfa]">
              스마트한 쇼핑
            </span>
            을 시작하세요
          </h1>

          <p className="text-[#94a3b8] text-base mb-8 max-w-2xl mx-auto">
            원하는 상품의 가격 변동을 실시간으로 추적하고,
            <br />
            최저가가 되면 알림을 받아 현명하게 쇼핑하세요.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            지금 시작하기
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#191f28] mb-3">
              주요 기능
            </h2>
            <p className="text-[#6b7684] text-[14px] max-w-xl mx-auto">
              스마트한 쇼핑을 위한 다양한 기능을 무료로 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="text-lg font-bold text-[#191f28] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#6b7684] text-[14px] leading-relaxed">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 장점 섹션 */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#191f28] mb-3">
              왜 우리 서비스를 사용해야 할까요?
            </h2>
            <p className="text-[#6b7684] text-[14px]">
              매일 수많은 사용자들이 현명한 쇼핑을 위해 이용하고 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-[#f8f9fa] rounded-xl"
              >
                <CheckCircle2
                  size={20}
                  className="text-[#0ca678] flex-shrink-0 mt-0.5"
                />
                <span className="text-[#333d4b] text-[15px]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#191f28] mb-3">
              이용 방법
            </h2>
            <p className="text-[#6b7684] text-[14px]">3단계로 간단하게 시작하세요</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3182f6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-white" />
              </div>
              <div className="text-[#3182f6] font-bold text-sm mb-2">
                STEP 1
              </div>
              <h3 className="text-lg font-bold text-[#191f28] mb-2">
                상품 검색
              </h3>
              <p className="text-[#6b7684] text-[14px]">
                상품명이나 쿠팡 URL을 입력해서 추적할 상품을 찾으세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#f04452] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={28} className="text-white" />
              </div>
              <div className="text-[#f04452] font-bold text-sm mb-2">
                STEP 2
              </div>
              <h3 className="text-lg font-bold text-[#191f28] mb-2">
                관심 등록
              </h3>
              <p className="text-[#6b7684] text-[14px]">
                하트 버튼을 눌러 관심 상품으로 등록하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0ca678] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-white" />
              </div>
              <div className="text-[#0ca678] font-bold text-sm mb-2">
                STEP 3
              </div>
              <h3 className="text-lg font-bold text-[#191f28] mb-2">
                알림 대기
              </h3>
              <p className="text-[#6b7684] text-[14px]">
                가격이 내려가면 알림을 받고 최적의 타이밍에 구매하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section id="faq" className="py-12 scroll-mt-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#191f28] mb-3">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-[#f8f9fa] rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-semibold text-[#191f28]">
                    {faq.question}
                  </span>
                  <span className="text-[#6b7684] group-open:rotate-180 transition-transform">
                    <ArrowRight size={18} className="rotate-90" />
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[#6b7684] text-[14px] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-12 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-4">
            지금 바로 가격 추적을 시작하세요
          </h2>
          <p className="text-[#94a3b8] mb-8">
            회원가입 없이 무료로 이용할 수 있습니다
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-lg"
          >
            시작하기
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 파트너스 고지 */}
      <section className="py-6 bg-[#f8f9fa] border-t border-[#e5e8eb]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#6b7684] text-[12px]">
            본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다
          </p>
        </div>
      </section>
    </div>
  );
}
