import { createHash } from "node:crypto";

import { fetchFeedArticles } from "@/lib/news/feed";
import { isNonAlarmist } from "@/lib/news/filter";
import {
  getSourcesForCategories,
  parseCategoryList,
} from "@/lib/news/sources";
import { summarizeDigest } from "@/lib/news/summarize";
import {
  NEWS_CATEGORIES,
  NEWS_CATEGORY_LABELS,
  type DigestArticle,
  type DigestSection,
  type NewsCategory,
  type NewsDigest,
  type NewsSource,
} from "@/lib/news/types";

interface BuildDigestOptions {
  categories?: NewsCategory[];
  maxArticlesPerCategory?: number;
}

type UnsummarizedArticle = Omit<DigestArticle, "summary" | "keyPoints">;

const DEFAULT_MAX_ARTICLES_PER_CATEGORY = 6;
const SOURCE_FETCH_LIMIT = 4;
const FRESHNESS_DAYS = 21;

export async function createNewsDigest(
  options: BuildDigestOptions = {},
): Promise<NewsDigest> {
  const categories = options.categories?.length
    ? options.categories
    : [...NEWS_CATEGORIES];
  const maxArticlesPerCategory =
    options.maxArticlesPerCategory ?? DEFAULT_MAX_ARTICLES_PER_CATEGORY;

  const sources = getSourcesForCategories(categories);
  const fetched = await Promise.all(
    sources.map((source) => collectArticlesFromSource(source)),
  );

  const unsummarized = fetched
    .flat()
    .filter((article) => isNonAlarmist(article.title, article.snippet))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const selected = selectArticlesByCategory(
    unsummarized,
    categories,
    maxArticlesPerCategory,
  );

  const summary = await summarizeDigest(
    selected.map((item) => ({
      id: item.id,
      title: item.title,
      sourceName: item.sourceName,
      url: item.url,
      snippet: item.snippet,
      category: item.category,
      publishedAt: item.publishedAt,
    })),
  );

  const summarizedArticles: DigestArticle[] = selected.map((item) => ({
    ...item,
    summary: summary.articleSummaries[item.id]?.summary ?? item.snippet,
    keyPoints: summary.articleSummaries[item.id]?.keyPoints ?? [item.snippet],
  }));

  const sections: DigestSection[] = categories.map((category) => ({
    category,
    categoryLabel: NEWS_CATEGORY_LABELS[category],
    summary: summary.categorySummaries[category],
    articles: summarizedArticles.filter((article) => article.category === category),
  }));

  return {
    generatedAt: new Date().toISOString(),
    weekEnding: getUpcomingFridayIsoDate(),
    categories,
    sections,
    overallSummary: summary.overallSummary,
    articleCount: summarizedArticles.length,
    sourcePolicy: {
      selectionPrinciples: [
        "Prefer primary sources (official release notes, peer-reviewed journals, standards organizations).",
        "Prefer evidence-backed reporting over opinion-led commentary.",
        "Use PDF-recommended sources first, then accredited alternatives only when needed.",
      ],
      antiAlarmismRule:
        "Exclude items with sensational or fear-based framing and prioritize objective language.",
    },
  };
}

export function categoriesFromEnv(): NewsCategory[] {
  return parseCategoryList(process.env.NEWSLETTER_CATEGORIES);
}

async function collectArticlesFromSource(
  source: NewsSource,
): Promise<UnsummarizedArticle[]> {
  const fromFeed = await getFeedArticles(source);
  if (fromFeed.length > 0) {
    return fromFeed;
  }

  return source.fallbackItems.map((item) => {
    const publishedAt = item.publishedAt ?? new Date().toISOString();
    return {
      id: toStableId(item.url, source.id),
      title: item.title,
      url: item.url,
      snippet: item.snippet,
      publishedAt,
      sourceId: source.id,
      sourceName: source.name,
      sourceHomepageUrl: source.homepageUrl,
      category: source.category,
      recommendedFromPdf: source.recommendedFromPdf,
    };
  });
}

async function getFeedArticles(source: NewsSource): Promise<UnsummarizedArticle[]> {
  if (!source.feedUrl) {
    return [];
  }

  try {
    const feedItems = await fetchFeedArticles(source.feedUrl, SOURCE_FETCH_LIMIT);
    const freshnessThreshold = Date.now() - FRESHNESS_DAYS * 24 * 60 * 60 * 1000;

    return feedItems
      .filter((item) => new Date(item.publishedAt).getTime() >= freshnessThreshold)
      .map((item) => ({
        id: toStableId(item.url, source.id),
        title: item.title,
        url: item.url,
        snippet: item.snippet,
        publishedAt: item.publishedAt,
        sourceId: source.id,
        sourceName: source.name,
        sourceHomepageUrl: source.homepageUrl,
        category: source.category,
        recommendedFromPdf: source.recommendedFromPdf,
      }));
  } catch {
    return [];
  }
}

function selectArticlesByCategory(
  articles: UnsummarizedArticle[],
  categories: NewsCategory[],
  maxArticlesPerCategory: number,
): UnsummarizedArticle[] {
  const selected: UnsummarizedArticle[] = [];

  for (const category of categories) {
    const categoryArticles = articles
      .filter((item) => item.category === category)
      .slice(0, maxArticlesPerCategory);
    selected.push(...categoryArticles);
  }

  return selected;
}

function toStableId(url: string, sourceId: string): string {
  const digest = createHash("sha1").update(`${sourceId}:${url}`).digest("hex");
  return digest.slice(0, 16);
}

function getUpcomingFridayIsoDate(fromDate = new Date()): string {
  const day = fromDate.getUTCDay();
  const daysUntilFriday = (5 - day + 7) % 7;
  const friday = new Date(fromDate);
  friday.setUTCDate(fromDate.getUTCDate() + daysUntilFriday);
  return friday.toISOString().slice(0, 10);
}
