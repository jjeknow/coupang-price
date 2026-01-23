import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Native Apple Sign In API
 * Handles authentication from iOS native Sign in with Apple
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, email, givenName, familyName, identityToken } = body;

    if (!user || !identityToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Apple user ID is unique and stable
    const appleUserId = `apple_${user}`;

    // Find or create user
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: appleUserId },
          { email: email || undefined },
        ],
      },
    });

    if (!dbUser) {
      // Create new user
      const name = [givenName, familyName].filter(Boolean).join(' ') || 'Apple 사용자';

      dbUser = await prisma.user.create({
        data: {
          id: appleUserId,
          email: email || `${user}@privaterelay.appleid.com`,
          name,
          emailVerified: new Date(), // Apple verifies email
        },
      });
    }

    // Create or update account link
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: 'apple',
          providerAccountId: user,
        },
      },
      update: {
        id_token: identityToken,
      },
      create: {
        userId: dbUser.id,
        type: 'oauth',
        provider: 'apple',
        providerAccountId: user,
        id_token: identityToken,
      },
    });

    // Return success - the client will need to handle session creation
    // For native apps, we'll use a different session mechanism
    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
      },
    });
  } catch (error) {
    console.error('Apple native auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
