import type { FeedArticle } from "@/lib/news/types";

const DEFAULT_TIMEOUT_MS = 10_000;

export async function fetchFeedArticles(
  feedUrl: string,
  limit: number,
): Promise<FeedArticle[]> {
  const xml = await fetchText(feedUrl);
  const items = parseRssOrAtom(xml);

  return items
    .filter((item) => item.url && item.title)
    .sort((a, b) => {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, limit);
}

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "signal-weekly-newsletter/1.0",
      },
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Feed request failed: ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function parseRssOrAtom(xml: string): FeedArticle[] {
  const itemBlocks = matchBlocks(xml, "item");
  if (itemBlocks.length > 0) {
    return itemBlocks
      .map((block) => parseRssItem(block))
      .filter((item): item is FeedArticle => Boolean(item));
  }

  const entryBlocks = matchBlocks(xml, "entry");
  return entryBlocks
    .map((block) => parseAtomEntry(block))
    .filter((item): item is FeedArticle => Boolean(item));
}

function matchBlocks(xml: string, tag: string): string[] {
  const expression = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi");
  return [...xml.matchAll(expression)].map((match) => match[0]);
}

function parseRssItem(block: string): FeedArticle | null {
  const title = normalizeText(readTag(block, "title"));
  const link = normalizeUrl(normalizeText(readTag(block, "link")));
  const description = normalizeText(
    readTag(block, "description") || readTag(block, "content:encoded"),
  );
  const publishedRaw = normalizeText(readTag(block, "pubDate"));
  const publishedAt = normalizeDate(publishedRaw);

  if (!title || !link) {
    return null;
  }

  return {
    title,
    url: link,
    snippet: description || title,
    publishedAt,
  };
}

function parseAtomEntry(block: string): FeedArticle | null {
  const title = normalizeText(readTag(block, "title"));
  const url = normalizeUrl(readAtomLink(block));
  const summary = normalizeText(
    readTag(block, "summary") || readTag(block, "content"),
  );
  const publishedRaw = normalizeText(
    readTag(block, "updated") || readTag(block, "published"),
  );
  const publishedAt = normalizeDate(publishedRaw);

  if (!title || !url) {
    return null;
  }

  return {
    title,
    url,
    snippet: summary || title,
    publishedAt,
  };
}

function readTag(xml: string, tag: string): string {
  const escapedTag = tag.replace(":", "\\:");
  const expression = new RegExp(
    `<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`,
    "i",
  );
  const match = xml.match(expression);
  return match?.[1] ?? "";
}

function readAtomLink(block: string): string {
  const expression = /<link\b([^>]*)\/?>/gi;
  const matches = [...block.matchAll(expression)];

  for (const match of matches) {
    const attrs = match[1] ?? "";
    const relation = readAttribute(attrs, "rel");
    const href = readAttribute(attrs, "href");
    if (!href) {
      continue;
    }
    if (!relation || relation === "alternate") {
      return href;
    }
  }

  return "";
}

function readAttribute(value: string, name: string): string {
  const expression = new RegExp(`${name}="([^"]+)"`, "i");
  const match = value.match(expression);
  return match?.[1] ?? "";
}

function normalizeText(value: string): string {
  if (!value) {
    return "";
  }

  const withoutCdata = value
    .replace(/^<!\[CDATA\[/i, "")
    .replace(/\]\]>$/i, "");

  const withoutTags = withoutCdata
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  const decoded = decodeEntities(withoutTags);
  return decoded.replace(/\s+/g, " ").trim();
}

function normalizeUrl(value: string): string {
  const decoded = decodeEntities(value).trim();
  if (!decoded) {
    return "";
  }

  if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
    return decoded;
  }

  return "";
}

function normalizeDate(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return new Date().toISOString();
  }
  return new Date(parsed).toISOString();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, decimal: string) =>
      String.fromCodePoint(parseInt(decimal, 10)),
    );
}
