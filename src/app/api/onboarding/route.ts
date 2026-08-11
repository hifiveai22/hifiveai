import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const VALID_PLANS = ['Starter', 'Growth', 'Enterprise'] as const;

interface OnboardingRequestBody {
  companySize?: number;
  industry?: string;
  countries?: number;
  challenges?: unknown;
  priorities?: unknown;
  timeline?: string;
  recommendedPlan?: string;
  estimatedCost?: number | null;
  estimatedSetup?: string | null;
  email?: string | null;
  name?: string | null;
  company?: string | null;
  sessionId?: string | null;
}

/**
 * Coerce a value into a string[] (JSON-encodable). Returns null if invalid.
 */
function toStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out: string[] = [];
  for (const item of value) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed !== '') out.push(trimmed);
    } else if (typeof item === 'number' || typeof item === 'boolean') {
      out.push(String(item));
    } else {
      return null; // non-primitive element -> reject
    }
  }
  return out;
}

/**
 * POST /api/onboarding
 * Persist an OnboardingWizard submission.
 * Body: {
 *   companySize, industry, countries, challenges[], priorities[],
 *   timeline, recommendedPlan, estimatedCost?, estimatedSetup?,
 *   email?, name?, company?, sessionId?
 * }
 * Returns: { success: true, id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as OnboardingRequestBody | null;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    // ── Validate Step 1: company profile ──────────────────
    const { companySize, industry, countries } = body;

    if (
      typeof companySize !== 'number' ||
      !Number.isFinite(companySize) ||
      companySize <= 0
    ) {
      return NextResponse.json(
        { success: false, error: 'companySize must be a positive number.' },
        { status: 400 }
      );
    }

    if (typeof industry !== 'string' || industry.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'industry is required.' },
        { status: 400 }
      );
    }

    if (
      typeof countries !== 'number' ||
      !Number.isFinite(countries) ||
      countries < 1
    ) {
      return NextResponse.json(
        { success: false, error: 'countries must be a number >= 1.' },
        { status: 400 }
      );
    }

    // ── Validate Step 2: challenges (string[]) ────────────
    const challengesArr = toStringArray(body.challenges);
    if (!challengesArr || challengesArr.length === 0) {
      return NextResponse.json(
        { success: false, error: 'challenges must be a non-empty array of strings.' },
        { status: 400 }
      );
    }

    // ── Validate Step 3: priorities (string[]) ────────────
    const prioritiesArr = toStringArray(body.priorities);
    if (!prioritiesArr || prioritiesArr.length === 0) {
      return NextResponse.json(
        { success: false, error: 'priorities must be a non-empty array of strings.' },
        { status: 400 }
      );
    }

    // ── Validate Step 4: timeline ─────────────────────────
    const { timeline } = body;
    if (typeof timeline !== 'string' || timeline.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'timeline is required.' },
        { status: 400 }
      );
    }

    // ── Validate recommendedPlan ──────────────────────────
    const { recommendedPlan } = body;
    if (
      typeof recommendedPlan !== 'string' ||
      !VALID_PLANS.includes(recommendedPlan as (typeof VALID_PLANS)[number])
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `recommendedPlan must be one of: ${VALID_PLANS.join(', ')}.`,
        },
        { status: 400 }
      );
    }

    // ── Optional: estimatedCost (Int?) ────────────────────
    let estimatedCost: number | null = null;
    if (body.estimatedCost !== undefined && body.estimatedCost !== null) {
      if (
        typeof body.estimatedCost !== 'number' ||
        !Number.isFinite(body.estimatedCost)
      ) {
        return NextResponse.json(
          { success: false, error: 'estimatedCost must be a number when provided.' },
          { status: 400 }
        );
      }
      estimatedCost = Math.round(body.estimatedCost);
    }

    // ── Optional: estimatedSetup (String?) ────────────────
    let estimatedSetup: string | null = null;
    if (body.estimatedSetup !== undefined && body.estimatedSetup !== null) {
      if (typeof body.estimatedSetup !== 'string') {
        return NextResponse.json(
          { success: false, error: 'estimatedSetup must be a string when provided.' },
          { status: 400 }
        );
      }
      estimatedSetup = body.estimatedSetup.trim() || null;
    }

    // ── Optional: contact info ────────────────────────────
    const trimString = (v: unknown): string | null => {
      if (typeof v !== 'string') return null;
      const t = v.trim();
      return t === '' ? null : t;
    };

    const email = trimString(body.email);
    const name = trimString(body.name);
    const company = trimString(body.company);
    const sessionId = trimString(body.sessionId);

    // ── Persist ───────────────────────────────────────────
    const submission = await db.onboardingSubmission.create({
      data: {
        companySize: Math.round(companySize),
        industry: industry.trim(),
        countries: Math.round(countries),
        challenges: JSON.stringify(challengesArr),
        priorities: JSON.stringify(prioritiesArr),
        timeline: timeline.trim(),
        recommendedPlan,
        estimatedCost,
        estimatedSetup,
        email,
        name,
        company,
        sessionId,
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Onboarding submission error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/onboarding
 * Returns aggregate stats for admin/analytics purposes.
 * Returns: {
 *   success: true,
 *   stats: {
 *     total: number,
 *     last7Days: number,
 *     byPlan: { Starter: number, Growth: number, Enterprise: number },
 *     avgCompanySize: number
 *   }
 * }
 */
export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [total, last7Days, allSubmissions] = await Promise.all([
      db.onboardingSubmission.count(),
      db.onboardingSubmission.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      db.onboardingSubmission.findMany({
        select: { recommendedPlan: true, companySize: true },
      }),
    ]);

    const byPlan: Record<string, number> = {
      Starter: 0,
      Growth: 0,
      Enterprise: 0,
    };

    let companySizeSum = 0;
    for (const s of allSubmissions) {
      const plan = s.recommendedPlan;
      if (Object.prototype.hasOwnProperty.call(byPlan, plan)) {
        byPlan[plan] += 1;
      } else {
        // Defensive: count unknown plans under their own key too
        byPlan[plan] = (byPlan[plan] ?? 0) + 1;
      }
      companySizeSum += s.companySize;
    }

    const avgCompanySize =
      allSubmissions.length > 0
        ? Math.round(companySizeSum / allSubmissions.length)
        : 0;

    return NextResponse.json({
      success: true,
      stats: {
        total,
        last7Days,
        byPlan,
        avgCompanySize,
      },
    });
  } catch (error) {
    console.error('Onboarding stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch onboarding stats.' },
      { status: 500 }
    );
  }
}
