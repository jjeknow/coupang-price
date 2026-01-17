'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider
      // 세션 fetch 실패 시 재시도 간격 (5분)
      refetchInterval={5 * 60}
      // 포커스 시 세션 재확인 비활성화 (불필요한 요청 감소)
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
