export const NEWS_CATEGORIES = [
  "software-development",
  "computer-science",
  "ai-ml",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  "software-development": "Software Development",
  "computer-science": "Computer Science",
  "ai-ml": "AI / ML",
};

export interface SourceFallbackItem {
  title: string;
  url: string;
  snippet: string;
  publishedAt?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  category: NewsCategory;
  homepageUrl: string;
  feedUrl?: string;
  credibility: string;
  rationale: string;
  recommendedFromPdf: boolean;
  fallbackItems: SourceFallbackItem[];
}

export interface FeedArticle {
  title: string;
  url: string;
  snippet: string;
  publishedAt: string;
}

export interface DigestArticle {
  id: string;
  title: string;
  url: string;
  snippet: string;
  publishedAt: string;
  sourceId: string;
  sourceName: string;
  sourceHomepageUrl: string;
  category: NewsCategory;
  recommendedFromPdf: boolean;
  summary: string;
  keyPoints: string[];
}

export interface DigestSection {
  category: NewsCategory;
  categoryLabel: string;
  summary: string;
  articles: DigestArticle[];
}

export interface NewsDigest {
  generatedAt: string;
  weekEnding: string;
  categories: NewsCategory[];
  sections: DigestSection[];
  overallSummary: string;
  articleCount: number;
  sourcePolicy: {
    selectionPrinciples: string[];
    antiAlarmismRule: string;
  };
}
