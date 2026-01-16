import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '똑체크 - 쿠팡 가격변동 추적 & 최저가 알림';
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
          background: 'linear-gradient(145deg, #1a1f36 0%, #2d3561 50%, #1a1f36 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 장식 원들 */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(49,130,246,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(240,68,82,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          {/* 로고 & 브랜드 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #3182f6 0%, #1d4ed8 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 40px rgba(49,130,246,0.4)',
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-2px',
              }}
            >
              똑체크
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
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                letterSpacing: '-1px',
              }}
            >
              쿠팡 가격변동 추적
            </span>
            <span
              style={{
                fontSize: '26px',
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
              }}
            >
              실시간 가격 그래프 · 역대 최저가 알림 · 무료
            </span>
          </div>

          {/* 기능 태그들 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '48px',
            }}
          >
            {[
              { icon: '📊', text: '가격 그래프' },
              { icon: '🔔', text: '최저가 알림' },
              { icon: '⚡', text: '골드박스' },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: '20px',
                    color: 'white',
                    fontWeight: '500',
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 URL */}
        <span
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '1px',
          }}
        >
          ddokcheck.com
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
