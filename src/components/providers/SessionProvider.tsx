'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider
      // 세션 재확인 비활성화 (로드 시에만 확인)
      refetchInterval={0}
      // 포커스 시 세션 재확인 비활성화 (불필요한 요청 감소)
      refetchOnWindowFocus={false}
      // 초기 세션 상태: undefined로 설정하여 불필요한 요청 방지
      session={undefined}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
