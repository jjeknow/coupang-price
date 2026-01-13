/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true, // 대규모 사이트맵 인덱스 생성

  // 변경 빈도 및 우선순위
  changefreq: 'daily',
  priority: 0.7,

  // 제외할 경로
  exclude: [
    '/api/*',
    '/admin/*',
    '/login',
    '/register',
    '/mypage/*',
    '/auth/*',
    '/404',
    '/500',
  ],

  // robots.txt 옵션
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/mypage/', '/auth/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Yeti', // 네이버
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Daumoa', // 다음
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    additionalSitemaps: [
      'https://ddokcheck.com/sitemap-categories.xml',
    ],
  },

  // 추가 경로 (동적 생성)
  additionalPaths: async () => {
    const result = [];
    const now = new Date().toISOString();

    // 메인 페이지 - 최고 우선순위
    result.push({
      loc: '/',
      changefreq: 'hourly',
      priority: 1.0,
      lastmod: now,
    });

    // 검색 페이지
    result.push({
      loc: '/search',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: now,
    });

    // 카테고리 페이지들
    const categories = [
      { id: 1012, name: '식품', priority: 0.9 },
      { id: 1014, name: '생활용품', priority: 0.9 },
      { id: 1010, name: '뷰티', priority: 0.9 },
      { id: 1016, name: '가전디지털', priority: 0.9 },
      { id: 1013, name: '주방용품', priority: 0.85 },
      { id: 1001, name: '여성패션', priority: 0.85 },
      { id: 1002, name: '남성패션', priority: 0.85 },
      { id: 1017, name: '스포츠레저', priority: 0.85 },
      { id: 1024, name: '헬스건강', priority: 0.85 },
      { id: 1029, name: '반려동물', priority: 0.85 },
      { id: 1011, name: '출산유아동', priority: 0.8 },
      { id: 1015, name: '홈인테리어', priority: 0.8 },
      { id: 1020, name: '완구취미', priority: 0.8 },
      { id: 1018, name: '자동차용품', priority: 0.8 },
      { id: 1019, name: '도서음반', priority: 0.75 },
      { id: 1021, name: '문구오피스', priority: 0.75 },
    ];

    for (const category of categories) {
      result.push({
        loc: `/category/${category.id}`,
        changefreq: 'daily',
        priority: category.priority,
        lastmod: now,
      });
    }

    return result;
  },

  // 변환 함수 - URL별 설정 커스터마이징
  transform: async (config, path) => {
    // 기본 설정
    let priority = config.priority;
    let changefreq = config.changefreq;

    // 경로별 우선순위 조정
    if (path === '/') {
      priority = 1.0;
      changefreq = 'hourly';
    } else if (path.startsWith('/category/')) {
      priority = 0.85;
      changefreq = 'daily';
    } else if (path.startsWith('/search')) {
      priority = 0.8;
      changefreq = 'daily';
    } else if (path.startsWith('/product/')) {
      priority = 0.6;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
};
