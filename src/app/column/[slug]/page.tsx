import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Calendar, Clock, ChevronRight, Share2, Bookmark, ArrowLeft, ExternalLink } from 'lucide-react';
import { columnData } from '@/data/columns';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com';

interface Props {
  params: Promise<{ slug: string }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const column = columnData[slug];

  if (!column) {
    return {
      title: '칼럼을 찾을 수 없습니다',
    };
  }

  return {
    title: column.meta.title,
    description: column.meta.description,
    keywords: column.meta.keywords,
    authors: [{ name: column.author }],
    openGraph: {
      title: column.meta.title,
      description: column.meta.description,
      type: 'article',
      publishedTime: column.publishedAt,
      modifiedTime: column.updatedAt,
      authors: [column.author],
      tags: column.tags,
      images: [
        {
          url: column.meta.ogImage || '/og-image-v2.png',
          width: 1200,
          height: 630,
          alt: column.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: column.meta.title,
      description: column.meta.description,
    },
    alternates: {
      canonical: `${BASE_URL}/column/${slug}`,
    },
  };
}

// 정적 경로 생성
export async function generateStaticParams() {
  return Object.keys(columnData).map((slug) => ({
    slug,
  }));
}

export default async function ColumnDetailPage({ params }: Props) {
  const { slug } = await params;
  const column = columnData[slug];

  if (!column) {
    notFound();
  }

  // Article Schema.org
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: column.title,
    description: column.meta.description,
    image: column.meta.ogImage || `${BASE_URL}/og-image-v2.png`,
    author: {
      '@type': 'Organization',
      name: column.author,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: '똑체크',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    datePublished: column.publishedAt,
    dateModified: column.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/column/${slug}`,
    },
  };

  // FAQ Schema.org (FAQ가 있는 경우)
  const faqJsonLd = column.faq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: column.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  // Product Schema.org (상품 추천이 있는 경우)
  const productJsonLd = column.products
    ? column.products.map((product) => ({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'KRW',
          price: product.price,
          availability: 'https://schema.org/InStock',
          url: product.url,
        },
        aggregateRating: product.rating
          ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              bestRating: 5,
              worstRating: 1,
              ratingCount: product.reviewCount || 100,
            }
          : undefined,
      }))
    : null;

  // BreadcrumbList Schema.org
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
        name: '칼럼',
        item: `${BASE_URL}/column`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: column.title,
        item: `${BASE_URL}/column/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {productJsonLd && (
        <Script
          id="products-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}

      <div className="min-h-screen bg-[#f2f4f6]">
        {/* 헤더 네비게이션 */}
        <div className="bg-white border-b border-[#e5e8eb] sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link
                href="/column"
                className="flex items-center gap-2 text-[#4e5968] hover:text-[#191f28] transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">칼럼 목록</span>
              </Link>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#6b7684] hover:bg-[#f2f4f6] rounded-lg transition-colors">
                  <Share2 size={20} />
                </button>
                <button className="p-2 text-[#6b7684] hover:bg-[#f2f4f6] rounded-lg transition-colors">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* 브레드크럼 */}
          <nav className="flex items-center gap-2 text-sm text-[#8b95a1] mb-6">
            <Link href="/" className="hover:text-[#4e5968]">
              홈
            </Link>
            <ChevronRight size={14} />
            <Link href="/column" className="hover:text-[#4e5968]">
              칼럼
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#4e5968]">{column.category}</span>
          </nav>

          {/* 헤더 */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`${column.categoryColor} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                {column.category}
              </span>
              {column.featured && (
                <span className="bg-[#f04452] text-white text-xs font-bold px-3 py-1 rounded-full">
                  FEATURED
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#191f28] mb-4 leading-tight">
              {column.title}
            </h1>
            <p className="text-lg text-[#6b7684] mb-6">{column.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8b95a1]">
              <span>{column.author}</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {column.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {column.readTime}분 소요
              </span>
            </div>
          </header>

          {/* 요약 박스 */}
          {column.summary && (
            <div className="bg-[#e8f3ff] border-l-4 border-[#3182f6] rounded-r-xl p-6 mb-8">
              <h2 className="font-bold text-[#191f28] mb-2">요약</h2>
              <p className="text-[#4e5968]">{column.summary}</p>
            </div>
          )}

          {/* 목차 */}
          {column.toc && column.toc.length > 0 && (
            <nav className="bg-white rounded-xl border border-[#e5e8eb] p-6 mb-8">
              <h2 className="font-bold text-[#191f28] mb-4">목차</h2>
              <ol className="space-y-2">
                {column.toc.map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.id}`}
                      className="text-[#3182f6] hover:underline flex items-center gap-2"
                    >
                      <span className="text-[#8b95a1] text-sm">{index + 1}.</span>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* 본문 컨텐츠 */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-[#191f28] prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-[#e5e8eb]
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-[#4e5968] prose-p:leading-relaxed
              prose-a:text-[#3182f6] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#191f28]
              prose-ul:my-4 prose-li:text-[#4e5968]
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-[#f8f9fa] prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-[#e5e8eb]
              prose-td:p-3 prose-td:border prose-td:border-[#e5e8eb]
              prose-blockquote:border-l-4 prose-blockquote:border-[#3182f6] prose-blockquote:bg-[#f8f9fa] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-code:bg-[#f2f4f6] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#e03131] prose-code:before:content-none prose-code:after:content-none
            "
            dangerouslySetInnerHTML={{ __html: column.content }}
          />

          {/* 상품 추천 카드 (있는 경우) */}
          {column.products && column.products.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-[#191f28] mb-6 pb-3 border-b border-[#e5e8eb]">
                추천 상품 바로가기
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {column.products.slice(0, 4).map((product, index) => (
                  <a
                    key={index}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl border border-[#e5e8eb] p-4 flex gap-4 hover:shadow-md transition-all group"
                  >
                    <div className="w-20 h-20 bg-[#f8f9fa] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-[#3182f6]">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#191f28] mb-1 group-hover:text-[#3182f6] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#6b7684] mb-2 line-clamp-1">{product.brand}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#e03131]">
                          {product.price.toLocaleString()}원
                        </span>
                        <span className="text-[#3182f6] text-sm flex items-center gap-1">
                          쿠팡 <ExternalLink size={14} />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* FAQ 섹션 */}
          {column.faq && column.faq.length > 0 && (
            <section className="mt-12" id="faq">
              <h2 className="text-2xl font-bold text-[#191f28] mb-6 pb-3 border-b border-[#e5e8eb]">
                자주 묻는 질문 (FAQ)
              </h2>
              <div className="space-y-4">
                {column.faq.map((item, index) => (
                  <details
                    key={index}
                    className="bg-white rounded-xl border border-[#e5e8eb] overflow-hidden group"
                  >
                    <summary className="p-4 cursor-pointer font-semibold text-[#191f28] hover:bg-[#f8f9fa] transition-colors list-none flex items-center justify-between">
                      <span>Q{index + 1}. {item.question}</span>
                      <ChevronRight
                        size={20}
                        className="text-[#8b95a1] transform group-open:rotate-90 transition-transform"
                      />
                    </summary>
                    <div className="px-4 pb-4 text-[#4e5968]">
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* 태그 */}
          <div className="mt-12 pt-8 border-t border-[#e5e8eb]">
            <div className="flex flex-wrap gap-2">
              {column.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-[#f2f4f6] text-[#4e5968] text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 파트너스 고지 */}
          <div className="mt-8 p-4 bg-[#f8f9fa] rounded-xl text-sm text-[#6b7684]">
            <p>
              이 글은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다. 구매자에게 추가 비용은
              없습니다. 가격 정보는 {column.updatedAt} 기준이며, 실시간 가격은{' '}
              <Link href="/" className="text-[#3182f6] hover:underline">
                똑체크
              </Link>
              에서 확인하세요.
            </p>
          </div>
        </article>

        {/* 관련 칼럼 */}
        <section className="bg-white border-t border-[#e5e8eb] py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-[#191f28] mb-6">다른 칼럼도 확인해보세요</h2>
            <div className="text-center py-8 text-[#6b7684]">
              <p>곧 더 많은 칼럼이 업데이트됩니다!</p>
              <Link href="/column" className="text-[#3182f6] hover:underline mt-2 inline-block">
                칼럼 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
