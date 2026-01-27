import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * 계정 삭제 API (Guideline 5.1.1(v) 준수)
 *
 * 사용자의 모든 데이터를 삭제합니다:
 * - 계정 정보
 * - 연결된 OAuth 계정
 * - 관심상품
 * - 가격 알림
 * - 세션
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 트랜잭션으로 모든 관련 데이터 삭제
    await prisma.$transaction(async (tx) => {
      // 1. 가격 알림 삭제
      await tx.alert.deleteMany({
        where: { userId },
      });

      // 2. 관심상품 삭제
      await tx.favorite.deleteMany({
        where: { userId },
      });

      // 3. 세션 삭제
      await tx.session.deleteMany({
        where: { userId },
      });

      // 4. OAuth 계정 연결 삭제
      await tx.account.deleteMany({
        where: { userId },
      });

      // 5. 사용자 삭제
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({
      success: true,
      message: '계정이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('계정 삭제 오류:', error);
    return NextResponse.json(
      { error: '계정 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
