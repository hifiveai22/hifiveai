import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter
 * Subscribe an email to the newsletter.
 * Body: { email: string, source?: string }
 * Returns: { success: true, id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { email, source } = body as { email?: string; source?: string };

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "You're already subscribed to our newsletter.",
        },
        { status: 409 }
      );
    }

    const finalSource =
      typeof source === 'string' && source.trim() !== ''
        ? source.trim()
        : 'footer';

    const subscriber = await db.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        source: finalSource,
      },
    });

    return NextResponse.json({ success: true, id: subscriber.id });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsletter
 * Returns the total subscriber count (admin purposes).
 * Returns: { count: number }
 */
export async function GET() {
  try {
    const count = await db.newsletterSubscriber.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Newsletter count error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch subscriber count.' },
      { status: 500 }
    );
  }
}
