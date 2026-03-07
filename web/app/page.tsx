import { createNewsDigest } from "@/lib/news/digest";
import { NEWS_CATEGORY_LABELS } from "@/lib/news/types";

export const revalidate = 21600;

export default async function Home() {
  const digest = await createNewsDigest({
    maxArticlesPerCategory: 4,
  });
  const forestTrees = [
    { id: "t1", left: "4%", bottom: "78%", scale: 0.56, tone: "tree-soft" },
    { id: "t2", left: "12%", bottom: "74%", scale: 0.68, tone: "tree-soft" },
    { id: "t3", left: "20%", bottom: "76%", scale: 0.62, tone: "tree-mid" },
    { id: "t4", left: "30%", bottom: "73%", scale: 0.75, tone: "tree-mid" },
    { id: "t5", left: "40%", bottom: "77%", scale: 0.6, tone: "tree-soft" },
    { id: "t6", left: "50%", bottom: "72%", scale: 0.78, tone: "tree-mid" },
    { id: "t7", left: "60%", bottom: "75%", scale: 0.64, tone: "tree-soft" },
    { id: "t8", left: "69%", bottom: "73%", scale: 0.83, tone: "tree-dark" },
    { id: "t9", left: "78%", bottom: "76%", scale: 0.66, tone: "tree-mid" },
    { id: "t10", left: "88%", bottom: "72%", scale: 0.8, tone: "tree-dark" },
    { id: "t11", left: "8%", bottom: "52%", scale: 0.76, tone: "tree-mid" },
    { id: "t12", left: "19%", bottom: "49%", scale: 0.94, tone: "tree-dark" },
    { id: "t13", left: "32%", bottom: "54%", scale: 0.82, tone: "tree-mid" },
    { id: "t14", left: "46%", bottom: "50%", scale: 1.02, tone: "tree-dark" },
    { id: "t15", left: "61%", bottom: "53%", scale: 0.86, tone: "tree-mid" },
    { id: "t16", left: "74%", bottom: "49%", scale: 1.04, tone: "tree-dark" },
    { id: "t17", left: "86%", bottom: "52%", scale: 0.88, tone: "tree-mid" },
    { id: "t18", left: "6%", bottom: "24%", scale: 1.04, tone: "tree-dark" },
    { id: "t19", left: "17%", bottom: "19%", scale: 1.2, tone: "tree-dark" },
    { id: "t20", left: "29%", bottom: "25%", scale: 1.06, tone: "tree-mid" },
    { id: "t21", left: "44%", bottom: "20%", scale: 1.25, tone: "tree-dark" },
    { id: "t22", left: "56%", bottom: "24%", scale: 1.08, tone: "tree-mid" },
    { id: "t23", left: "68%", bottom: "18%", scale: 1.28, tone: "tree-dark" },
    { id: "t24", left: "80%", bottom: "23%", scale: 1.1, tone: "tree-mid" },
    { id: "t25", left: "91%", bottom: "19%", scale: 1.22, tone: "tree-dark" },
  ] as const;

  return (
    <div className="relative overflow-hidden">
      <div className="forest-backdrop" aria-hidden="true">
        <div className="forest-glow" />
        <div className="forest-ridge ridge-a" />
        <div className="forest-ridge ridge-b" />
        <div className="forest-ridge ridge-c" />
        <div className="forest-ridge ridge-d" />
        {forestTrees.map((tree) => (
          <div
            key={tree.id}
            className={`forest-tree ${tree.tone}`}
            style={{
              left: tree.left,
              bottom: tree.bottom,
              transform: `scale(${tree.scale})`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-10">
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
              className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-8"
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

        <footer className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 backdrop-blur-sm">
          <p>
            Generated: {new Date(digest.generatedAt).toLocaleString()} · Week
            ending: {digest.weekEnding}
          </p>
          <p className="mt-2">
            Selection policy: {digest.sourcePolicy.selectionPrinciples.join(" ")}
          </p>
          <p className="mt-2">{digest.sourcePolicy.antiAlarmismRule}</p>
        </footer>
      </div>
    </div>
  );
}
