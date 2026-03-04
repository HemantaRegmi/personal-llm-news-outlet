import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/news/types";

export interface SummaryInputArticle {
  id: string;
  title: string;
  sourceName: string;
  url: string;
  snippet: string;
  category: NewsCategory;
  publishedAt: string;
}

export interface SummaryOutput {
  overallSummary: string;
  categorySummaries: Record<NewsCategory, string>;
  articleSummaries: Record<
    string,
    {
      summary: string;
      keyPoints: string[];
    }
  >;
}

interface ModelDigestResponse {
  overallSummary?: string;
  categorySummaries?: Partial<Record<NewsCategory, string>>;
  articleSummaries?: Array<{
    id?: string;
    summary?: string;
    keyPoints?: string[];
  }>;
}

export async function summarizeDigest(
  articles: SummaryInputArticle[],
): Promise<SummaryOutput> {
  const fallback = fallbackSummary(articles);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || articles.length === 0) {
    return fallback;
  }

  try {
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You produce objective, evidence-first technical summaries. Avoid hype, fear language, or speculative certainty. Respond only in JSON.",
          },
          {
            role: "user",
            content: buildPrompt(articles),
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return fallback;
    }

    const parsed = safeJsonParse<ModelDigestResponse>(content);
    if (!parsed) {
      return fallback;
    }

    return mergeWithFallback(articles, parsed, fallback);
  } catch {
    return fallback;
  }
}

function buildPrompt(articles: SummaryInputArticle[]): string {
  return JSON.stringify(
    {
      task: "Summarize technical news articles",
      rules: [
        "Keep all summaries concise, neutral, and factual.",
        "No sensational wording.",
        "Each article summary should be 2-3 sentences.",
        "Each article should have 2-3 concrete key points.",
        "Category and overall summaries should synthesize themes and changes.",
      ],
      outputSchema: {
        overallSummary: "string",
        categorySummaries: {
          "software-development": "string",
          "computer-science": "string",
          "ai-ml": "string",
        },
        articleSummaries: [
          {
            id: "string",
            summary: "string",
            keyPoints: ["string", "string"],
          },
        ],
      },
      articles,
    },
    null,
    2,
  );
}

function mergeWithFallback(
  articles: SummaryInputArticle[],
  parsed: ModelDigestResponse,
  fallback: SummaryOutput,
): SummaryOutput {
  const articleSummaries = { ...fallback.articleSummaries };
  for (const item of parsed.articleSummaries ?? []) {
    if (!item.id || !articleSummaries[item.id]) {
      continue;
    }

    const summary = normalizeSentence(
      item.summary ?? articleSummaries[item.id].summary,
    );
    const points =
      item.keyPoints
        ?.map((point) => normalizeSentence(point))
        .filter(Boolean)
        .slice(0, 3) ?? articleSummaries[item.id].keyPoints;

    articleSummaries[item.id] = {
      summary,
      keyPoints: points.length > 0 ? points : articleSummaries[item.id].keyPoints,
    };
  }

  const categorySummaries = { ...fallback.categorySummaries };
  for (const category of NEWS_CATEGORIES) {
    const fromModel = parsed.categorySummaries?.[category];
    if (fromModel) {
      categorySummaries[category] = normalizeSentence(fromModel);
    }
  }

  const overallSummary = normalizeSentence(
    parsed.overallSummary ?? fallback.overallSummary,
  );

  if (articles.length === 0) {
    return fallback;
  }

  return {
    overallSummary,
    categorySummaries,
    articleSummaries,
  };
}

function fallbackSummary(articles: SummaryInputArticle[]): SummaryOutput {
  const grouped = groupByCategory(articles);
  const categorySummaries: Record<NewsCategory, string> = {
    "software-development": makeCategorySummary(
      grouped["software-development"],
      "engineering practice, tooling changes, and production operations updates",
    ),
    "computer-science": makeCategorySummary(
      grouped["computer-science"],
      "research direction, theory progress, and durable foundational work",
    ),
    "ai-ml": makeCategorySummary(
      grouped["ai-ml"],
      "model research, evaluation quality, and deployment governance",
    ),
  };

  const articleSummaries: SummaryOutput["articleSummaries"] = {};
  for (const article of articles) {
    const summary = summarizeSnippet(article.snippet, article.title);
    articleSummaries[article.id] = {
      summary,
      keyPoints: buildKeyPoints(article.snippet, article.title),
    };
  }

  const total = articles.length;
  const overallSummary =
    total === 0
      ? "No qualifying articles were available for this cycle."
      : `This issue includes ${total} evidence-oriented updates across software development, computer science, and AI/ML, focused on releases, peer-reviewed work, and standards-based reporting.`;

  return {
    overallSummary,
    categorySummaries,
    articleSummaries,
  };
}

function groupByCategory(
  articles: SummaryInputArticle[],
): Record<NewsCategory, SummaryInputArticle[]> {
  const grouped: Record<NewsCategory, SummaryInputArticle[]> = {
    "software-development": [],
    "computer-science": [],
    "ai-ml": [],
  };

  for (const article of articles) {
    grouped[article.category].push(article);
  }

  return grouped;
}

function makeCategorySummary(
  articles: SummaryInputArticle[],
  fallbackTheme: string,
): string {
  if (articles.length === 0) {
    return `No new items were selected this week for ${fallbackTheme}.`;
  }

  const topTitles = articles.slice(0, 2).map((item) => item.title).join("; ");
  return `Coverage emphasizes ${fallbackTheme}. Key items include: ${topTitles}.`;
}

function summarizeSnippet(snippet: string, title: string): string {
  const normalized = normalizeSentence(snippet);
  if (!normalized) {
    return `This update covers ${title.toLowerCase()} with source-backed context and links.`;
  }

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (sentences.length === 0) {
    return normalized.slice(0, 220);
  }

  return sentences.join(" ");
}

function buildKeyPoints(snippet: string, title: string): string[] {
  const normalized = normalizeSentence(snippet);
  if (!normalized) {
    return [
      `Primary source: ${title}`,
      "Summary derived from available source metadata.",
    ];
  }

  const rawPoints = normalized
    .split(/[.;•]/)
    .map((point) => normalizeSentence(point))
    .filter(Boolean);

  if (rawPoints.length === 0) {
    return [normalized.slice(0, 140)];
  }

  return rawPoints.slice(0, 3);
}

function normalizeSentence(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function safeJsonParse<T>(content: string): T | null {
  try {
    return JSON.parse(content) as T;
  } catch {
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }
    try {
      return JSON.parse(content.slice(firstBrace, lastBrace + 1)) as T;
    } catch {
      return null;
    }
  }
}
