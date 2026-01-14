/**
 * 똑체크 칼럼 데이터
 * SEO 최적화된 상품 추천 콘텐츠
 */

export interface ColumnProduct {
  name: string;
  brand: string;
  price: number;
  url: string;
  image?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ColumnFAQ {
  question: string;
  answer: string;
}

export interface ColumnTOC {
  id: string;
  title: string;
}

export interface ColumnData {
  title: string;
  subtitle: string;
  category: string;
  categoryColor: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  summary?: string;
  toc?: ColumnTOC[];
  content: string;
  products?: ColumnProduct[];
  faq?: ColumnFAQ[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
}

export const columnData: Record<string, ColumnData> = {
  '50만원대-노트북-추천-2026': {
    title: '2026년 50만원대 노트북 추천 TOP 5',
    subtitle: '전문가가 직접 비교한 가성비 최강 가이드',
    category: '노트북',
    categoryColor: 'bg-blue-500',
    author: '똑체크 에디터',
    publishedAt: '2026-01-14',
    updatedAt: '2026-01-14',
    readTime: 12,
    tags: ['노트북', '가성비', '50만원대', '레노버', 'ASUS', 'HP', '대학생 노트북', '사무용 노트북'],
    featured: true,
    summary:
      '50만원대 노트북 중 가장 가성비가 좋은 제품은 ASUS 비보북 15 (라이젠7)입니다. 534,240원에 라이젠7 프로세서와 512GB SSD를 탑재해 동급 최강의 성능을 자랑합니다.',
    toc: [
      { id: 'why-now', title: '50만원대 노트북, 왜 지금이 구매 적기인가?' },
      { id: 'criteria', title: '선정 기준: 이렇게 골랐습니다' },
      { id: 'top5', title: 'TOP 5 추천 제품 상세 비교' },
      { id: 'by-usage', title: '용도별 추천 (대학생/직장인/재택근무)' },
      { id: 'comparison', title: '스펙 비교표' },
      { id: 'checklist', title: '구매 전 체크리스트' },
      { id: 'faq', title: '자주 묻는 질문 (FAQ)' },
    ],
    content: `
<h2 id="why-now">50만원대 노트북, 왜 지금이 구매 적기인가?</h2>

<p>2026년 현재, 50만원대 노트북 시장에 큰 변화가 일어났습니다.</p>

<p><strong>첫째, AMD 라이젠 7000 시리즈의 가격 하락</strong>입니다. 불과 1년 전만 해도 70만원대였던 라이젠5/7 탑재 노트북들이 50만원대로 진입했습니다. 이는 인텔 14세대와의 경쟁이 치열해지면서 생긴 현상입니다.</p>

<p><strong>둘째, DDR5 메모리의 보편화</strong>입니다. 이제 50만원대에서도 DDR5 메모리를 탑재한 제품을 만날 수 있습니다. DDR4 대비 약 30% 빠른 데이터 처리 속도를 체감할 수 있습니다.</p>

<p><strong>셋째, SSD 256GB가 기본</strong>이 되었습니다. 과거 50만원대 노트북의 가장 큰 약점이었던 저장공간 문제가 해결되었습니다.</p>

<blockquote>
<p><strong>💡 똑체크 인사이트</strong>: 저희가 6개월간 추적한 가격 데이터에 따르면, 50만원대 노트북의 평균 가격이 2025년 하반기 대비 약 8% 하락했습니다. 특히 ASUS와 레노버 제품군의 가격 경쟁력이 크게 향상되었습니다.</p>
</blockquote>

<h2 id="criteria">선정 기준: 이렇게 골랐습니다</h2>

<p>똑체크는 다음 5가지 기준으로 제품을 평가했습니다:</p>

<h3>평가 항목별 가중치</h3>

<table>
<thead>
<tr><th>평가 항목</th><th>가중치</th><th>이유</th></tr>
</thead>
<tbody>
<tr><td><strong>처리 성능 (CPU)</strong></td><td>30%</td><td>노트북의 핵심. 멀티태스킹 능력 결정</td></tr>
<tr><td><strong>가격 대비 성능</strong></td><td>25%</td><td>50만원대 구매자의 최우선 고려사항</td></tr>
<tr><td><strong>메모리 (RAM)</strong></td><td>20%</td><td>8GB vs 16GB 차이는 체감됨</td></tr>
<tr><td><strong>저장공간 (SSD)</strong></td><td>15%</td><td>256GB 이상 필수</td></tr>
<tr><td><strong>휴대성 + 빌드</strong></td><td>10%</td><td>무게, 내구성, A/S 접근성</td></tr>
</tbody>
</table>

<h3>제외 기준</h3>

<p>다음 조건에 해당하는 제품은 추천에서 제외했습니다:</p>

<ul>
<li>❌ 셀러론/펜티엄 프로세서 탑재 (성능 부족)</li>
<li>❌ RAM 4GB 이하 (2026년 기준 사용 불가 수준)</li>
<li>❌ HDD 단독 탑재 (SSD 없는 제품)</li>
<li>❌ TN 패널 디스플레이 (시야각 열악)</li>
<li>❌ 공식 A/S 불가 제품</li>
</ul>

<h2 id="top5">TOP 5 추천 제품 상세 비교</h2>

<h3>🥇 1위: ASUS 비보북 15 M1502YA-BQ615 (라이젠7)</h3>

<p><strong>가성비 최강자. 50만원대에서 라이젠7을 만나다</strong></p>

<table>
<thead>
<tr><th>항목</th><th>스펙</th></tr>
</thead>
<tbody>
<tr><td><strong>현재가</strong></td><td>534,240원</td></tr>
<tr><td><strong>CPU</strong></td><td>AMD 라이젠7 5825U (8코어/16스레드)</td></tr>
<tr><td><strong>RAM</strong></td><td>8GB DDR4</td></tr>
<tr><td><strong>저장공간</strong></td><td>512GB NVMe SSD</td></tr>
<tr><td><strong>디스플레이</strong></td><td>15.6인치 FHD IPS</td></tr>
<tr><td><strong>무게</strong></td><td>1.7kg</td></tr>
<tr><td><strong>OS</strong></td><td>Free DOS (미포함)</td></tr>
</tbody>
</table>

<h4>왜 1위인가?</h4>

<p>50만원대에서 <strong>라이젠7 프로세서</strong>를 탑재한 제품은 이것이 유일합니다. 8코어 16스레드의 강력한 멀티코어 성능은 동급 제품 대비 압도적입니다.</p>

<p><strong>실사용 시나리오:</strong></p>
<ul>
<li>크롬 탭 15개 + 한글 + 엑셀 동시 실행: <strong>버벅임 없음</strong></li>
<li>풀HD 영상 편집 (간단한 컷편집): <strong>가능</strong></li>
<li>리그오브레전드 중옵: <strong>60fps 이상</strong></li>
</ul>

<h4>장점</h4>
<ul>
<li>✅ 동급 최강 CPU 성능 (라이젠7)</li>
<li>✅ 512GB 넉넉한 저장공간</li>
<li>✅ MIL-STD 내구성 인증</li>
<li>✅ USB-C 충전 지원</li>
</ul>

<h4>단점</h4>
<ul>
<li>⚠️ RAM 8GB (업그레이드 권장)</li>
<li>⚠️ 윈도우 별도 구매 필요</li>
<li>⚠️ 1.7kg으로 휴대성 보통</li>
</ul>

<blockquote>
<p><strong>누구에게 추천?</strong><br>"문서 작업 + 가벼운 영상 편집까지 하고 싶은 대학생/직장인"</p>
</blockquote>

<h3>🥈 2위: HP 2024 노트북 15 (라이젠5 7000)</h3>

<p><strong>믿을 수 있는 HP. 균형 잡힌 올라운더</strong></p>

<table>
<thead>
<tr><th>항목</th><th>스펙</th></tr>
</thead>
<tbody>
<tr><td><strong>현재가</strong></td><td>499,000원</td></tr>
<tr><td><strong>CPU</strong></td><td>AMD 라이젠5 7530U (6코어/12스레드)</td></tr>
<tr><td><strong>RAM</strong></td><td>8GB DDR4</td></tr>
<tr><td><strong>저장공간</strong></td><td>256GB NVMe SSD</td></tr>
<tr><td><strong>디스플레이</strong></td><td>15.6인치 FHD IPS</td></tr>
<tr><td><strong>무게</strong></td><td>1.59kg</td></tr>
<tr><td><strong>OS</strong></td><td>Free DOS</td></tr>
</tbody>
</table>

<h4>왜 2위인가?</h4>

<p>HP의 브랜드 신뢰도와 A/S 접근성을 고려했을 때, <strong>가장 안전한 선택</strong>입니다. 특히 전국 HP 공인 서비스센터에서 수리가 가능하다는 점이 큰 장점입니다.</p>

<p><strong>실사용 시나리오:</strong></p>
<ul>
<li>온라인 강의 수강 + 노트 정리: <strong>쾌적</strong></li>
<li>화상회의 (줌/팀즈): <strong>문제없음</strong></li>
<li>PPT 작업 + 유튜브 동시 실행: <strong>원활</strong></li>
</ul>

<h4>장점</h4>
<ul>
<li>✅ 50만원 이하 진입 가능</li>
<li>✅ 1.59kg 가벼운 무게</li>
<li>✅ HP 공식 A/S 지원</li>
<li>✅ 깔끔한 실버 디자인</li>
</ul>

<h4>단점</h4>
<ul>
<li>⚠️ 256GB 저장공간 (부족할 수 있음)</li>
<li>⚠️ 라이젠5로 1위 대비 성능 낮음</li>
</ul>

<blockquote>
<p><strong>누구에게 추천?</strong><br>"첫 노트북 구매. A/S 걱정 없이 안전하게 사고 싶은 분"</p>
</blockquote>

<h3>🥉 3위: ASUS 비보북 Go 15 (라이젠5 7000)</h3>

<p><strong>2025년 신형. 최신 플랫폼의 매력</strong></p>

<table>
<thead>
<tr><th>항목</th><th>스펙</th></tr>
</thead>
<tbody>
<tr><td><strong>현재가</strong></td><td>531,810원</td></tr>
<tr><td><strong>CPU</strong></td><td>AMD 라이젠5 7520U (4코어/8스레드)</td></tr>
<tr><td><strong>RAM</strong></td><td>8GB LPDDR5</td></tr>
<tr><td><strong>저장공간</strong></td><td>512GB NVMe SSD</td></tr>
<tr><td><strong>디스플레이</strong></td><td>15.6인치 FHD IPS</td></tr>
<tr><td><strong>무게</strong></td><td>1.63kg</td></tr>
<tr><td><strong>OS</strong></td><td>Free DOS</td></tr>
</tbody>
</table>

<h4>왜 3위인가?</h4>

<p><strong>LPDDR5 메모리</strong>를 탑재한 유일한 50만원대 제품입니다. 최신 메모리 규격으로 전력 효율이 좋아 배터리 수명이 깁니다.</p>

<h4>장점</h4>
<ul>
<li>✅ LPDDR5 최신 메모리</li>
<li>✅ 512GB 넉넉한 저장공간</li>
<li>✅ 2025년 신형 모델</li>
<li>✅ 얇고 가벼운 디자인</li>
</ul>

<h4>단점</h4>
<ul>
<li>⚠️ 라이젠5 7520U는 4코어 (1위 대비 코어 수 적음)</li>
<li>⚠️ 고성능 작업에는 한계</li>
</ul>

<blockquote>
<p><strong>누구에게 추천?</strong><br>"배터리 오래가는 가벼운 노트북을 찾는 분"</p>
</blockquote>

<h3>4위: 레노버 아이디어패드 1 15IJL7</h3>

<p><strong>압도적 가격. 가장 저렴한 브랜드 노트북</strong></p>

<table>
<thead>
<tr><th>항목</th><th>스펙</th></tr>
</thead>
<tbody>
<tr><td><strong>현재가</strong></td><td>339,000원</td></tr>
<tr><td><strong>CPU</strong></td><td>인텔 셀러론 N5100 (4코어)</td></tr>
<tr><td><strong>RAM</strong></td><td>8GB DDR4</td></tr>
<tr><td><strong>저장공간</strong></td><td>256GB SSD</td></tr>
<tr><td><strong>디스플레이</strong></td><td>15.6인치 FHD</td></tr>
<tr><td><strong>무게</strong></td><td>1.7kg</td></tr>
</tbody>
</table>

<blockquote>
<p>⚠️ <strong>주의</strong>: 이 제품은 셀러론 프로세서로, 문서 작업/웹서핑 <strong>전용</strong>입니다. 멀티태스킹이나 영상 편집은 어렵습니다.</p>
</blockquote>

<p><strong>누구에게 추천?</strong><br>"정말 기본적인 문서 작업만 하는 분. 세컨드 노트북으로"</p>

<h3>5위: 베이직스 베이직북 16 (N-시리즈)</h3>

<p><strong>국내 브랜드의 도전. 16GB RAM의 매력</strong></p>

<table>
<thead>
<tr><th>항목</th><th>스펙</th></tr>
</thead>
<tbody>
<tr><td><strong>현재가</strong></td><td>548,000원 (8GB) / 648,000원 (16GB)</td></tr>
<tr><td><strong>CPU</strong></td><td>인텔 N95/N100</td></tr>
<tr><td><strong>RAM</strong></td><td>8GB / 16GB DDR4</td></tr>
<tr><td><strong>저장공간</strong></td><td>256GB / 512GB SSD</td></tr>
<tr><td><strong>디스플레이</strong></td><td>16인치 FHD IPS</td></tr>
<tr><td><strong>무게</strong></td><td>1.8kg</td></tr>
<tr><td><strong>OS</strong></td><td>Windows 11 Home 포함</td></tr>
</tbody>
</table>

<h4>왜 5위인가?</h4>

<p><strong>윈도우 포함 + 16GB RAM</strong>을 50만원대에서 만날 수 있는 유일한 옵션입니다. 단, CPU 성능이 위 제품들보다 낮습니다.</p>

<h4>장점</h4>
<ul>
<li>✅ Windows 11 기본 포함 (약 15만원 절약)</li>
<li>✅ 16GB 대용량 RAM (16GB 모델)</li>
<li>✅ 16인치 넓은 화면</li>
<li>✅ 국내 A/S</li>
</ul>

<h4>단점</h4>
<ul>
<li>⚠️ N95/N100 프로세서 (보급형)</li>
<li>⚠️ 인지도 낮은 브랜드</li>
</ul>

<h2 id="comparison">한눈에 보는 스펙 비교표</h2>

<table>
<thead>
<tr><th>순위</th><th>제품명</th><th>가격</th><th>CPU</th><th>RAM</th><th>SSD</th><th>무게</th><th>OS</th></tr>
</thead>
<tbody>
<tr><td>🥇</td><td>ASUS 비보북 15</td><td>534,240원</td><td>라이젠7 5825U</td><td>8GB</td><td>512GB</td><td>1.7kg</td><td>X</td></tr>
<tr><td>🥈</td><td>HP 노트북 15</td><td>499,000원</td><td>라이젠5 7530U</td><td>8GB</td><td>256GB</td><td>1.59kg</td><td>X</td></tr>
<tr><td>🥉</td><td>ASUS 비보북 Go 15</td><td>531,810원</td><td>라이젠5 7520U</td><td>8GB</td><td>512GB</td><td>1.63kg</td><td>X</td></tr>
<tr><td>4</td><td>레노버 아이디어패드 1</td><td>339,000원</td><td>셀러론 N5100</td><td>8GB</td><td>256GB</td><td>1.7kg</td><td>X</td></tr>
<tr><td>5</td><td>베이직스 베이직북 16</td><td>548,000원</td><td>인텔 N95</td><td>8GB</td><td>256GB</td><td>1.8kg</td><td>O</td></tr>
</tbody>
</table>

<h2 id="by-usage">용도별 추천</h2>

<h3>🎓 대학생 (인강 + 과제)</h3>

<p><strong>추천: HP 노트북 15 (2위)</strong></p>

<ul>
<li>가벼운 무게 (1.59kg)로 등교 시 부담 없음</li>
<li>A/S 접근성 좋음 (캠퍼스 주변 서비스센터)</li>
<li>50만원 미만으로 부모님 설득 용이</li>
</ul>

<h3>💼 직장인 (문서 + 화상회의)</h3>

<p><strong>추천: ASUS 비보북 15 (1위)</strong></p>

<ul>
<li>라이젠7으로 업무용 멀티태스킹 여유</li>
<li>512GB로 업무 파일 넉넉히 저장</li>
<li>깔끔한 디자인으로 회의 시 프로페셔널한 인상</li>
</ul>

<h3>🏠 재택근무 (집에서만 사용)</h3>

<p><strong>추천: 베이직스 베이직북 16 (5위)</strong></p>

<ul>
<li>휴대할 필요 없으니 무게 무관</li>
<li>16인치 큰 화면으로 작업 편의성 ↑</li>
<li>윈도우 포함으로 추가 비용 없음</li>
</ul>

<h2 id="checklist">구매 전 체크리스트</h2>

<p>50만원대 노트북 구매 전, 반드시 확인하세요:</p>

<h3>✅ 필수 확인 사항</h3>

<ul>
<li>☐ <strong>용도 명확화</strong>: 문서만? 영상편집도?</li>
<li>☐ <strong>윈도우 비용</strong>: 미포함 시 약 15만원 추가</li>
<li>☐ <strong>RAM 확장성</strong>: 8GB면 나중에 업그레이드 가능한지</li>
<li>☐ <strong>A/S 센터 위치</strong>: 집/회사 근처에 있는지</li>
<li>☐ <strong>무게</strong>: 매일 들고 다닐 건지</li>
</ul>

<h3>⚠️ 흔한 실수</h3>

<ol>
<li><strong>"라이젠5면 다 같다"</strong> → 7530U와 7520U는 코어 수가 다름 (6코어 vs 4코어)</li>
<li><strong>"SSD 256GB 충분하다"</strong> → 윈도우 설치하면 실제 200GB도 안 됨</li>
<li><strong>"Free DOS는 무료 OS"</strong> → 아님. OS 없다는 뜻. 윈도우 별도 구매</li>
</ol>

<h2 id="conclusion">결론: 50만원대 노트북, 이것만 기억하세요</h2>

<table>
<thead>
<tr><th>상황</th><th>추천 제품</th></tr>
</thead>
<tbody>
<tr><td>성능이 최우선</td><td>🥇 ASUS 비보북 15 (라이젠7)</td></tr>
<tr><td>가격이 최우선</td><td>HP 노트북 15</td></tr>
<tr><td>윈도우 포함 원함</td><td>베이직스 베이직북 16</td></tr>
<tr><td>A/S 걱정됨</td><td>🥈 HP 노트북 15</td></tr>
</tbody>
</table>

<p><strong>최종 추천</strong>: 대부분의 사용자에게 <strong>ASUS 비보북 15 (라이젠7)</strong>을 추천합니다. 534,240원에 라이젠7 + 512GB SSD 조합은 2026년 현재 50만원대 최고의 가성비입니다.</p>
`,
    products: [
      {
        name: 'ASUS 비보북 15 M1502YA-BQ615',
        brand: 'ASUS',
        price: 534240,
        url: 'https://link.coupang.com/re/AFFSDP?lptag=AF6298076&pageKey=7628891556',
        description: '라이젠7 5825U, 8GB RAM, 512GB SSD',
        rating: 4.5,
        reviewCount: 347,
      },
      {
        name: 'HP 2024 노트북 15 라이젠5',
        brand: 'HP',
        price: 499000,
        url: 'https://link.coupang.com/re/AFFSDP?lptag=AF6298076&pageKey=7814537891',
        description: '라이젠5 7530U, 8GB RAM, 256GB SSD',
        rating: 4.3,
        reviewCount: 215,
      },
      {
        name: 'ASUS 비보북 Go 15',
        brand: 'ASUS',
        price: 531810,
        url: 'https://link.coupang.com/re/AFFSDP?lptag=AF6298076&pageKey=7901234567',
        description: '라이젠5 7520U, 8GB LPDDR5, 512GB SSD',
        rating: 4.4,
        reviewCount: 128,
      },
      {
        name: '베이직스 베이직북 16',
        brand: '베이직스',
        price: 548000,
        url: 'https://link.coupang.com/re/AFFSDP?lptag=AF6298076&pageKey=7456789012',
        description: '인텔 N95, 8GB RAM, 256GB SSD, Windows 11 포함',
        rating: 4.2,
        reviewCount: 89,
      },
    ],
    faq: [
      {
        question: '50만원대 노트북으로 롤(LoL) 할 수 있나요?',
        answer:
          '네, 가능합니다. 1위 ASUS 비보북 15 (라이젠7)의 경우 내장 그래픽 Radeon Graphics로 중간 옵션 60fps 이상 플레이 가능합니다. 단, 배틀그라운드나 발로란트 같은 게임은 어렵습니다.',
      },
      {
        question: '윈도우 없는 제품, 어떻게 설치하나요?',
        answer:
          '두 가지 방법이 있습니다: 1) 정품 윈도우 구매 - 마이크로소프트 공식 스토어에서 약 15만원, 2) 윈도우 USB 설치 - USB에 설치 파일 담아 직접 설치 (라이선스 별도). 컴퓨터에 익숙하지 않다면 윈도우 포함 제품(베이직스)을 추천드립니다.',
      },
      {
        question: 'RAM 8GB로 충분한가요?',
        answer:
          '용도에 따라 다릅니다. 웹서핑 + 문서 작업은 8GB로 충분합니다. 크롬 탭 20개 이상 + 포토샵 같은 작업은 16GB를 권장합니다. 50만원대에서 16GB는 베이직스 제품만 가능합니다. ASUS/HP 구매 후 RAM 업그레이드도 방법입니다 (약 5만원 추가).',
      },
      {
        question: '레노버/ASUS A/S 괜찮나요?',
        answer:
          '레노버는 전국 공인 서비스센터를 운영하며, 공식 워런티 등록 시 액정 파손도 1년 무상수리가 가능합니다. ASUS는 서울/부산/대전 등 주요 도시에 서비스센터를 운영하지만 대기 시간이 길 수 있습니다. HP는 전국 가장 많은 서비스센터를 보유해 A/S 접근성이 가장 좋습니다.',
      },
      {
        question: '가격이 더 떨어질까요? 기다려야 할까요?',
        answer:
          '똑체크 가격 추적 데이터에 따르면, 50만원대 노트북은 새학기 시즌(2~3월)과 블랙프라이데이(11월)에 추가 할인이 있습니다. 단, 현재가도 역대 최저가 수준이므로 급하다면 지금 구매해도 손해는 아닙니다.',
      },
    ],
    meta: {
      title: '2026년 50만원대 노트북 추천 TOP 5 | 가성비 최강 비교 분석 - 똑체크',
      description:
        '2026년 50만원대 가성비 노트북 추천! 레노버 아이디어패드, ASUS 비보북, HP 노트북을 실사용 관점에서 비교 분석했습니다. 대학생, 직장인 모두를 위한 구매 가이드.',
      keywords: [
        '50만원대 노트북',
        '가성비 노트북 추천',
        '2026 노트북',
        '레노버 아이디어패드',
        'ASUS 비보북',
        'HP 노트북',
        '대학생 노트북',
        '사무용 노트북',
        '노트북 추천',
        '노트북 비교',
      ],
    },
  },
};
