import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const ADMIN_EMAILS = ['admin@example.com'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalUsers, totalAlerts, activeAlerts, totalFavorites] = await Promise.all([
      prisma.user.count(),
      prisma.alert.count(),
      prisma.alert.count({ where: { isActive: true } }),
      prisma.favorite.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalAlerts,
      activeAlerts,
      totalFavorites,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
