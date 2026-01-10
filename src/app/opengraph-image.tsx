import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '쿠팡 최저가 - 실시간 가격 추적 서비스';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f04452 0%, #ff6b6b 50%, #3182f6 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 메인 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px 80px',
            background: 'white',
            borderRadius: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* 로고 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#3182f6',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                <polyline points="17 18 23 18 23 12" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#191f28',
              }}
            >
              최저가
            </span>
          </div>

          {/* 타이틀 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#191f28',
                textAlign: 'center',
              }}
            >
              쿠팡 최저가 추적
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#6b7684',
                textAlign: 'center',
              }}
            >
              실시간 가격 변동 추적 & 역대 최저가 알림
            </span>
          </div>

          {/* 태그 */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '40px',
            }}
          >
            {['가격 추적', '최저가 알림', '골드박스'].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '12px 24px',
                  background: '#f2f4f6',
                  borderRadius: '999px',
                  fontSize: '20px',
                  color: '#4e5968',
                  fontWeight: '500',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 하단 텍스트 */}
        <span
          style={{
            marginTop: '32px',
            fontSize: '20px',
            color: 'white',
            opacity: 0.9,
          }}
        >
          스마트한 쇼핑의 시작
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
