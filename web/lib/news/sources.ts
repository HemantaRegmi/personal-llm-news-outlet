import {
  NEWS_CATEGORIES,
  type NewsCategory,
  type NewsSource,
} from "@/lib/news/types";

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "github-blog",
    name: "GitHub Blog",
    category: "software-development",
    homepageUrl: "https://github.blog/",
    feedUrl: "https://github.blog/feed/",
    credibility: "Official engineering and platform source",
    rationale:
      "High-signal engineering updates, language ecosystem trends, and platform-level changes.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review GitHub engineering and ecosystem updates",
        url: "https://github.blog/",
        snippet:
          "Use this source to monitor production engineering trends and developer workflow changes.",
      },
    ],
  },
  {
    id: "aws-whats-new",
    name: "AWS What's New",
    category: "software-development",
    homepageUrl: "https://aws.amazon.com/new/",
    feedUrl: "https://aws.amazon.com/about-aws/whats-new/recent/feed/",
    credibility: "Official vendor release channel",
    rationale:
      "Primary-source release notes with concrete product and API changes.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review AWS platform release notes",
        url: "https://aws.amazon.com/new/",
        snippet:
          "Track infrastructure and developer tooling updates from first-party release announcements.",
      },
    ],
  },
  {
    id: "kubernetes-blog",
    name: "Kubernetes Blog",
    category: "software-development",
    homepageUrl: "https://kubernetes.io/releases/release/",
    feedUrl: "https://kubernetes.io/feed.xml",
    credibility: "Official CNCF project publication",
    rationale:
      "Reliable release and architecture updates from maintainers and SIG contributors.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review Kubernetes release and ecosystem changes",
        url: "https://kubernetes.io/releases/release/",
        snippet:
          "Follow release-level changes that affect platform teams and cloud-native architecture.",
      },
    ],
  },
  {
    id: "acm-queue",
    name: "ACM Queue",
    category: "software-development",
    homepageUrl: "https://queue.acm.org/",
    feedUrl: "https://queue.acm.org/rss/feeds/queuecontent.xml",
    credibility: "ACM editorial and practitioner publication",
    rationale:
      "Practice-focused engineering essays with high editorial standards and low hype.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Read current ACM Queue engineering essays",
        url: "https://queue.acm.org/",
        snippet:
          "Queue is useful for architecture and software engineering depth over trend-chasing.",
      },
    ],
  },
  {
    id: "python-whats-new",
    name: "Python Release Notes",
    category: "software-development",
    homepageUrl: "https://docs.python.org/3/whatsnew/index.html",
    credibility: "Official language documentation",
    rationale:
      "Canonical changes to the Python runtime and standard library.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review latest Python release notes",
        url: "https://docs.python.org/3/whatsnew/index.html",
        snippet:
          "Use official release notes for language-level changes instead of secondary commentary.",
      },
    ],
  },
  {
    id: "arxiv-cs",
    name: "arXiv Computer Science",
    category: "computer-science",
    homepageUrl: "https://info.arxiv.org/help/moderation/index.html",
    feedUrl: "https://export.arxiv.org/rss/cs",
    credibility: "Primary preprint archive with moderation",
    rationale:
      "Broad CS paper stream, useful for tracking research direction before secondary summaries.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review moderated arXiv CS submissions",
        url: "https://info.arxiv.org/help/moderation/index.html",
        snippet:
          "Use moderation policy and paper metadata to prioritize credible and relevant work.",
      },
    ],
  },
  {
    id: "acm-jacm",
    name: "Journal of the ACM",
    category: "computer-science",
    homepageUrl: "https://dl.acm.org/journal/jacm",
    feedUrl: "https://dl.acm.org/action/showFeed?type=etoc&feed=rss&jc=jaco",
    credibility: "Peer-reviewed flagship CS journal",
    rationale:
      "High-rigor theoretical and systems work with strong academic review quality.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review Journal of the ACM latest issues",
        url: "https://dl.acm.org/journal/jacm",
        snippet:
          "Use peer-reviewed journal publications for foundational and durable computer science signals.",
      },
    ],
  },
  {
    id: "theory-of-computing",
    name: "Theory of Computing",
    category: "computer-science",
    homepageUrl: "https://theoryofcomputing.org/introduction.html",
    feedUrl: "https://theoryofcomputing.org/rss.xml",
    credibility: "Peer-reviewed open-access theory journal",
    rationale:
      "Focused source for foundational algorithms and complexity research.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review new Theory of Computing publications",
        url: "https://theoryofcomputing.org/introduction.html",
        snippet:
          "Track foundational CS developments through formal theory publications.",
      },
    ],
  },
  {
    id: "usenix-publications",
    name: "USENIX Publications",
    category: "computer-science",
    homepageUrl: "https://www.usenix.org/publications",
    feedUrl: "https://www.usenix.org/blog/feed",
    credibility: "Respected systems conference and publication organization",
    rationale:
      "Pragmatic systems research and operations-focused empirical engineering content.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review recent USENIX publications",
        url: "https://www.usenix.org/publications",
        snippet:
          "Use systems-focused conference proceedings for practical and evidence-heavy insights.",
      },
    ],
  },
  {
    id: "jmlr",
    name: "Journal of Machine Learning Research",
    category: "ai-ml",
    homepageUrl: "https://www.jmlr.org/",
    feedUrl: "https://www.jmlr.org/jmlr.xml",
    credibility: "Peer-reviewed ML journal",
    rationale:
      "Established venue for high-quality machine learning research publications.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review latest JMLR papers",
        url: "https://www.jmlr.org/",
        snippet:
          "Monitor peer-reviewed ML outputs to stay grounded in validated methods and results.",
      },
    ],
  },
  {
    id: "aclanthology",
    name: "ACL Anthology",
    category: "ai-ml",
    homepageUrl: "https://aclanthology.org/",
    credibility: "Primary archival source for NLP research",
    rationale:
      "Direct conference paper archive with citations and metadata.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review recent ACL Anthology papers",
        url: "https://aclanthology.org/",
        snippet:
          "Use official NLP publication archives for paper-level context and references.",
      },
    ],
  },
  {
    id: "mlcommons",
    name: "MLCommons Benchmarks",
    category: "ai-ml",
    homepageUrl: "https://mlcommons.org/benchmarks/training/",
    credibility: "Industry benchmark consortium",
    rationale:
      "Standardized benchmark reports for model training performance and reproducibility discussion.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review MLCommons training benchmark updates",
        url: "https://mlcommons.org/benchmarks/training/",
        snippet:
          "Track benchmark methodology and results through official consortium reports.",
      },
    ],
  },
  {
    id: "stanford-ai-index",
    name: "Stanford HAI AI Index",
    category: "ai-ml",
    homepageUrl: "https://hai.stanford.edu/ai-index/2025-ai-index-report",
    credibility: "Academic institutional report",
    rationale:
      "Evidence-driven annual benchmarking of AI progress across research and industry.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review Stanford AI Index annual report",
        url: "https://hai.stanford.edu/ai-index/2025-ai-index-report",
        snippet:
          "Use annual evidence-based metrics to calibrate narrative claims about AI trends.",
      },
    ],
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI Risk Management Framework",
    category: "ai-ml",
    homepageUrl: "https://www.nist.gov/itl/ai-risk-management-framework",
    credibility: "Standards and guidance publication",
    rationale:
      "Policy and governance baseline grounded in risk management methodology.",
    recommendedFromPdf: true,
    fallbackItems: [
      {
        title: "Review NIST AI RMF updates and guidance",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        snippet:
          "Use standards-based guidance as a counterweight to hype-driven safety narratives.",
      },
    ],
  },
];

export function parseCategoryList(
  raw: string | null | undefined,
): NewsCategory[] {
  if (!raw) {
    return [...NEWS_CATEGORIES];
  }

  const selected = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const unique = new Set<NewsCategory>();
  for (const category of NEWS_CATEGORIES) {
    if (selected.includes(category)) {
      unique.add(category);
    }
  }

  if (unique.size === 0) {
    return [...NEWS_CATEGORIES];
  }

  return [...unique];
}

export function getSourcesForCategories(
  categories: readonly NewsCategory[],
): NewsSource[] {
  const categorySet = new Set(categories);
  return NEWS_SOURCES.filter((source) => categorySet.has(source.category));
}
