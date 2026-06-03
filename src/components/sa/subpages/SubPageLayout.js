import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../../MeadowLayout';

/**
 * Shared shell for all /say-anything/* SEO sub-pages.
 *
 * Props:
 *   slug          — URL path segment (e.g. "how-to-play-say-anything-board-game-online")
 *   title         — full <title> tag (50-60 chars ideal)
 *   description   — meta description (140-160 chars)
 *   h1            — H1 heading on the page
 *   keywords      — comma-separated meta keywords (optional)
 *   faqs          — array of { q, a } for the FAQ + FAQPage schema
 *   children      — main body content
 */
export default function SubPageLayout({ slug, title, description, h1, keywords, faqs = [], children }) {
  const canonical = `https://herdgamesonline.com/say-anything/${slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://herdgamesonline.com/' },
      { '@type': 'ListItem', position: 2, name: 'Say Anything', item: 'https://herdgamesonline.com/say-anything' },
      { '@type': 'ListItem', position: 3, name: h1, item: canonical },
    ],
  };

  const faqSchema = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null;

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
        <meta property="og:image" content="https://herdgamesonline.com/og-say-anything.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://herdgamesonline.com/og-say-anything.png" />

        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#8B6347] mb-4 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#2D1810]">Home</Link>
          <span>›</span>
          <Link to="/say-anything" className="hover:text-[#2D1810]">Say Anything</Link>
          <span>›</span>
          <span className="text-[#2D1810] font-semibold">{h1}</span>
        </nav>

        <article className="bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-10 mb-8">
          <h1 style={fredokaStyle} className="text-3xl md:text-5xl font-bold text-[#2D1810] mb-4 leading-tight">
            {h1}
          </h1>

          {/* Body — caller controls structure */}
          <div className="sa-prose text-[#4A2D1B] text-base md:text-lg leading-relaxed">
            {children}
          </div>

          {/* FAQ block (also fed to schema) */}
          {faqs.length > 0 && (
            <section className="mt-10 pt-8 border-t-2 border-[#FFE8C8]">
              <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-4">
                Frequently asked questions
              </h2>
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

          {/* CTA */}
          <section className="mt-10 pt-8 border-t-2 border-[#FFE8C8] text-center">
            <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-2">
              Ready to play?
            </h2>
            <p className="text-[#4A2D1B] mb-4">Free, no download, no signup. 3–12 players.</p>
            <Link
              to="/say-anything"
              style={fredokaStyle}
              className="inline-block px-8 py-3 rounded-2xl bg-[#E84A8B] hover:bg-[#C73B73] text-white font-bold text-lg transition-colors"
            >
              Start a Say Anything game →
            </Link>
          </section>
        </article>

        {/* Internal links to other sub-pages */}
        <RelatedGuides currentSlug={slug} />
      </div>

      {/* Scoped prose styling */}
      <style>{`
        .sa-prose h2 { font-family: 'Fredoka', system-ui, sans-serif; color: #2D1810; font-size: 1.65rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.2; }
        @media (min-width: 768px) { .sa-prose h2 { font-size: 1.875rem; } }
        .sa-prose h3 { font-family: 'Fredoka', system-ui, sans-serif; color: #3D8B5A; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .sa-prose p { margin-bottom: 1rem; }
        .sa-prose a { color: #E84A8B; font-weight: 600; }
        .sa-prose a:hover { color: #C73B73; text-decoration: underline; }
        .sa-prose strong { color: #2D1810; }
        .sa-prose ul, .sa-prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .sa-prose ul { list-style: disc; }
        .sa-prose ol { list-style: decimal; }
        .sa-prose li { margin-bottom: 0.4rem; }
        .sa-prose blockquote { border-left: 4px solid #FFD56B; background: #FFFBE8; padding: 0.75rem 1rem; border-radius: 0.5rem; margin: 1rem 0; color: #2D1810; }
        .sa-prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .sa-prose th, .sa-prose td { padding: 0.6rem; border-bottom: 1px solid #FFE8C8; text-align: left; }
        .sa-prose th { background: #FFF5E8; font-weight: 700; color: #2D1810; }
      `}</style>
    </MeadowLayout>
  );
}

const ALL_GUIDES = [
  { slug: 'how-to-play-say-anything-board-game-online', title: 'How to Play Say Anything Board Game Online', emoji: '📖' },
  { slug: '100-funny-say-anything-game-questions', title: '100 Funny Say Anything Game Questions', emoji: '🎯' },
  { slug: 'can-you-play-say-anything-with-2-players', title: 'Can You Play Say Anything With 2 Players?', emoji: '👥' },
  { slug: 'free-alternative-to-jackbox-party-pack', title: 'Free Alternative to Jackbox Party Pack', emoji: '🆓' },
  { slug: 'how-to-play-party-games-on-zoom-with-friends', title: 'How to Play Party Games on Zoom With Friends', emoji: '💻' },
  { slug: 'family-friendly-party-games-to-play-online', title: 'Family-Friendly Party Games to Play Online', emoji: '👨‍👩‍👧' },
];

function RelatedGuides({ currentSlug }) {
  const others = ALL_GUIDES.filter(g => g.slug !== currentSlug);
  return (
    <section className="bg-white/70 rounded-3xl border-2 border-[#FFE8C8] p-5 md:p-7 mb-8">
      <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] mb-4">
        More Say Anything guides
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {others.map(g => (
          <li key={g.slug}>
            <Link
              to={`/say-anything/${g.slug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFE8C8] text-[#2D1810] font-semibold transition-colors"
            >
              <span className="text-xl">{g.emoji}</span>
              <span className="text-sm md:text-base">{g.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { ALL_GUIDES };
