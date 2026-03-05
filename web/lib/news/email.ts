import type { NewsDigest } from "@/lib/news/types";

interface EmailResult {
  status: "sent" | "skipped" | "failed";
  detail: string;
}

export async function sendDigestEmail(digest: NewsDigest): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NEWSLETTER_TO_EMAIL;
  const from = process.env.NEWSLETTER_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return {
      status: "skipped",
      detail:
        "Missing RESEND_API_KEY, NEWSLETTER_TO_EMAIL, or NEWSLETTER_FROM_EMAIL.",
    };
  }

  const subject = `Weekly Engineering Briefing - Week Ending ${digest.weekEnding}`;
  const { html, text } = buildEmailBody(digest);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        status: "failed",
        detail: `Email provider returned ${response.status}: ${body.slice(0, 200)}`,
      };
    }

    return {
      status: "sent",
      detail: "Weekly digest email was sent.",
    };
  } catch (error) {
    return {
      status: "failed",
      detail: `Email send failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    };
  }
}

function buildEmailBody(digest: NewsDigest): { html: string; text: string } {
  const htmlSections = digest.sections
    .map((section) => {
      const articles = section.articles
        .map((article) => {
          const keyPoints = article.keyPoints
            .map((point) => `<li>${escapeHtml(point)}</li>`)
            .join("");

          return `
            <article style="padding:14px 0;border-bottom:1px solid #d9e1e7;">
              <p style="margin:0 0 6px;color:#0f1720;font-size:16px;font-weight:600;">${escapeHtml(article.title)}</p>
              <p style="margin:0 0 4px;color:#3a4d5f;font-size:12px;">${escapeHtml(article.sourceName)} • ${new Date(article.publishedAt).toLocaleDateString()}</p>
              <p style="margin:0 0 8px;color:#1f2d3a;font-size:14px;line-height:1.45;">${escapeHtml(article.summary)}</p>
              <ul style="margin:0 0 8px 18px;color:#34465a;font-size:13px;">${keyPoints}</ul>
              <a href="${escapeHtml(article.url)}" style="color:#0f766e;font-size:13px;">Read source</a>
            </article>
          `;
        })
        .join("");

      return `
        <section style="margin-top:24px;">
          <h2 style="margin:0 0 6px;color:#0f1720;font-size:18px;">${escapeHtml(section.categoryLabel)}</h2>
          <p style="margin:0 0 12px;color:#425467;font-size:14px;line-height:1.5;">${escapeHtml(section.summary)}</p>
          ${articles || '<p style="color:#607386;font-size:14px;">No qualifying items this week.</p>'}
        </section>
      `;
    })
    .join("");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f2f6f8; padding:24px;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #d9e1e7;border-radius:14px;padding:24px;">
        <p style="margin:0;color:#0f1720;font-size:22px;font-weight:700;">Signal Weekly</p>
        <p style="margin:8px 0 0;color:#425467;font-size:14px;">Week ending ${digest.weekEnding}</p>
        <p style="margin:16px 0 0;color:#1f2d3a;font-size:15px;line-height:1.6;">${escapeHtml(digest.overallSummary)}</p>
        ${htmlSections}
      </div>
    </div>
  `;

  const lines: string[] = [
    `Signal Weekly - Week ending ${digest.weekEnding}`,
    "",
    digest.overallSummary,
    "",
  ];

  for (const section of digest.sections) {
    lines.push(`${section.categoryLabel}`);
    lines.push(section.summary);
    for (const article of section.articles) {
      lines.push(`- ${article.title} (${article.sourceName})`);
      lines.push(`  Summary: ${article.summary}`);
      for (const point of article.keyPoints) {
        lines.push(`  * ${point}`);
      }
      lines.push(`  Link: ${article.url}`);
    }
    lines.push("");
  }

  return {
    html,
    text: lines.join("\n"),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
