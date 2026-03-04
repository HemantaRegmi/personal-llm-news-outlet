import { NextRequest, NextResponse } from "next/server";

import { createNewsDigest } from "@/lib/news/digest";
import { parseCategoryList } from "@/lib/news/sources";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const categoriesQuery = request.nextUrl.searchParams.get("categories");
  const categories = parseCategoryList(categoriesQuery);
  const digest = await createNewsDigest({ categories });

  return NextResponse.json(digest);
}
