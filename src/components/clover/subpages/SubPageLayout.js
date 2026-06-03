import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../../MeadowLayout';
import AdSlot from '../../AdSlot';

export default function SubPageLayout({ slug, title, description, h1, keywords, faqs = [], children }) {
  const canonical = `https://herdgamesonline.com/clover/${slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://herdgamesonline.com/' },
      { '@type': 'ListItem', position: 2, name: 'Clover Clues', item: 'https://herdgamesonline.com/clover' },
      { '@type': 'ListItem', position: 3, name: h1, item: canonical },
    ],
  };

  const faqSchema = faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  } : null;

  return (
    <MeadowLayout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://herdgamesonline.com/og-clover.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://herdgamesonline.com/og-clover.png" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-[#8B6347] mb-4 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#2D1810]">Home</Link>
          <span>›</span>
          <Link to="/clover" className="hover:text-[#2D1810]">Clover Clues</Link>
          <span>›</span>
          <span className="text-[#2D1810] font-semibold">{h1}</span>
        </nav>

        <article className="bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-10 mb-8">
          <h1 style={fredokaStyle} className="text-3xl md:text-5xl font-bold text-[#2D1810] mb-4 leading-tight">{h1}</h1>
          <div className="cl-prose text-[#4A2D1B] text-base md:text-lg leading-relaxed">{children}</div>

          {faqs.length > 0 && (
            <section className="mt-10 pt-8 border-t-2 border-[#FFE8C8]">
              <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-4">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqs.map(({ q, a }, i) => (
                  <div key={i}>
                    <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">{q}</h3>
                    <p className="text-[#4A2D1B] mt-1">{a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 max-h-[300px] overflow-hidden">
            <AdSlot slot="5698170537" />
          </div>

          <section className="mt-8 pt-8 border-t-2 border-[#FFE8C8] text-center">
            <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-2">Ready to play?</h2>
            <p className="text-[#4A2D1B] mb-4">Free, no download, no signup. 3–6 players.</p>
            <Link to="/clover" style={fredokaStyle}
              className="inline-block px-8 py-3 rounded-2xl bg-[#3D8B5A] hover:bg-[#2F6E45] text-white font-bold text-lg transition-colors">
              Start a Clover Clues game →
            </Link>
          </section>
        </article>

        <RelatedGuides currentSlug={slug} />

        <p className="text-[#8B6347] text-xs italic text-center mb-6">
          Clover Clues is an original game inspired by the co-op word-game genre. Not affiliated with or endorsed by Repos Production. So Clover! is a trademark of its respective owner.
        </p>
      </div>

      <style>{`
        .cl-prose h2 { font-family: 'Fredoka', system-ui, sans-serif; color: #2D1810; font-size: 1.65rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.2; }
        @media (min-width: 768px) { .cl-prose h2 { font-size: 1.875rem; } }
        .cl-prose h3 { font-family: 'Fredoka', system-ui, sans-serif; color: #3D8B5A; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .cl-prose p { margin-bottom: 1rem; }
        .cl-prose a { color: #E84A8B; font-weight: 600; }
        .cl-prose a:hover { color: #C73B73; text-decoration: underline; }
        .cl-prose strong { color: #2D1810; }
        .cl-prose ul, .cl-prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .cl-prose ul { list-style: disc; }
        .cl-prose ol { list-style: decimal; }
        .cl-prose li { margin-bottom: 0.4rem; }
        .cl-prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .cl-prose th, .cl-prose td { padding: 0.6rem; border-bottom: 1px solid #FFE8C8; text-align: left; }
        .cl-prose th { background: #FFF5E8; font-weight: 700; color: #2D1810; }
      `}</style>
    </MeadowLayout>
  );
}

const ALL_GUIDES = [
  { slug: 'how-to-play-clover-clues', title: 'How to Play Clover Clues', emoji: '📖' },
  { slug: 'free-so-clover-alternative-online', title: 'Free So Clover Alternative', emoji: '🍀' },
  { slug: 'cooperative-word-games-online', title: 'Co-op Word Games Online', emoji: '🤝' },
];

function RelatedGuides({ currentSlug }) {
  const others = ALL_GUIDES.filter((g) => g.slug !== currentSlug);
  return (
    <section className="bg-white/70 rounded-3xl border-2 border-[#FFE8C8] p-5 md:p-7 mb-4">
      <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] mb-4">More Clover Clues guides</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {others.map((g) => (
          <li key={g.slug}>
            <Link to={`/clover/${g.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFE8C8] text-[#2D1810] font-semibold transition-colors">
              <span className="text-xl">{g.emoji}</span>
              <span className="text-sm md:text-base">{g.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
