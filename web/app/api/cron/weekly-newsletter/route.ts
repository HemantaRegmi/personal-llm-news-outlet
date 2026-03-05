import { NextRequest, NextResponse } from "next/server";

import { categoriesFromEnv, createNewsDigest } from "@/lib/news/digest";
import { sendDigestEmail } from "@/lib/news/email";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return runWeeklyNewsletter(request);
}

export async function POST(request: NextRequest) {
  return runWeeklyNewsletter(request);
}

async function runWeeklyNewsletter(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = categoriesFromEnv();
  const digest = await createNewsDigest({
    categories,
    maxArticlesPerCategory: 5,
  });

  const emailResult = await sendDigestEmail(digest);

  return NextResponse.json({
    ok: emailResult.status !== "failed",
    emailStatus: emailResult.status,
    detail: emailResult.detail,
    generatedAt: digest.generatedAt,
    weekEnding: digest.weekEnding,
    articleCount: digest.articleCount,
    categories: digest.categories,
  });
}

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return true;
  }

  const querySecret = request.nextUrl.searchParams.get("secret");
  const headerSecret = request.headers.get("x-cron-secret");
  const bearer = request.headers.get("authorization");
  const bearerToken = bearer?.startsWith("Bearer ")
    ? bearer.slice("Bearer ".length)
    : null;

  return (
    querySecret === expected ||
    headerSecret === expected ||
    bearerToken === expected
  );
}
