import { createNewsDigest } from "@/lib/news/digest";
import { NEWS_CATEGORY_LABELS } from "@/lib/news/types";

export const revalidate = 21600;

export default async function Home() {
  const digest = await createNewsDigest({
    maxArticlesPerCategory: 4,
  });

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8">
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-teal-700">
          Signal Weekly
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Evidence-Based Engineering News
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {digest.overallSummary}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {digest.categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800"
            >
              {NEWS_CATEGORY_LABELS[category]}
            </span>
          ))}
        </div>
      </header>

      <main className="mt-8 space-y-8">
        {digest.sections.map((section) => (
          <section
            key={section.category}
            className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-8"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              {section.categoryLabel}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {section.summary}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {section.articles.length === 0 ? (
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  No qualifying stories this week for this category.
                </article>
              ) : (
                section.articles.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <p className="text-base font-semibold leading-snug text-slate-900">
                      {article.title}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.08em] text-slate-500">
                      {article.sourceName} •{" "}
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                      {article.summary}
                    </p>

                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {article.keyPoints.slice(0, 3).map((point) => (
                        <li key={`${article.id}-${point.slice(0, 24)}`}>
                          {point}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-medium text-teal-700 underline decoration-teal-300 underline-offset-4 transition hover:text-teal-900"
                    >
                      Open original source
                    </a>
                  </article>
                ))
              )}
            </div>
          </section>
        ))}
      </main>

      <footer className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600">
        <p>
          Generated: {new Date(digest.generatedAt).toLocaleString()} · Week ending:{" "}
          {digest.weekEnding}
        </p>
        <p className="mt-2">
          Selection policy: {digest.sourcePolicy.selectionPrinciples.join(" ")}
        </p>
        <p className="mt-2">{digest.sourcePolicy.antiAlarmismRule}</p>
      </footer>
    </div>
  );
}
