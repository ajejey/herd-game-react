import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../../MeadowLayout';
import AdSlot from '../../AdSlot';

export default function SubPageLayout({ slug, title, description, h1, keywords, faqs = [], children }) {
  const canonical = `https://herdgame.vercel.app/guesstimate/${slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://herdgame.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'Guesstimate', item: 'https://herdgame.vercel.app/guesstimate' },
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
        <meta property="og:image" content="https://herdgame.vercel.app/og-guesstimate.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://herdgame.vercel.app/og-guesstimate.png" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-[#8B6347] mb-4 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#2D1810]">Home</Link>
          <span>›</span>
          <Link to="/guesstimate" className="hover:text-[#2D1810]">Guesstimate</Link>
          <span>›</span>
          <span className="text-[#2D1810] font-semibold">{h1}</span>
        </nav>

        <article className="bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-10 mb-8">
          <h1 style={fredokaStyle} className="text-3xl md:text-5xl font-bold text-[#2D1810] mb-4 leading-tight">{h1}</h1>
          <div className="gt-prose text-[#4A2D1B] text-base md:text-lg leading-relaxed">{children}</div>

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

          {/* Ad */}
          <div className="mt-10 max-h-[300px] overflow-hidden">
            <AdSlot slot="5698170537" />
          </div>

          <section className="mt-8 pt-8 border-t-2 border-[#FFE8C8] text-center">
            <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-2">Ready to play?</h2>
            <p className="text-[#4A2D1B] mb-4">Free, no download, no signup. 2–12 players.</p>
            <Link to="/guesstimate" style={fredokaStyle}
              className="inline-block px-8 py-3 rounded-2xl bg-[#E84A8B] hover:bg-[#C73B73] text-white font-bold text-lg transition-colors">
              Start a Guesstimate game →
            </Link>
          </section>
        </article>

        <RelatedGuides currentSlug={slug} />

        <p className="text-[#8B6347] text-xs italic text-center mb-6">
          Not affiliated with North Star Games. Wits &amp; Wagers is a trademark of North Star Games, LLC.
        </p>
      </div>

      <style>{`
        .gt-prose h2 { font-family: 'Fredoka', system-ui, sans-serif; color: #2D1810; font-size: 1.65rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.2; }
        @media (min-width: 768px) { .gt-prose h2 { font-size: 1.875rem; } }
        .gt-prose h3 { font-family: 'Fredoka', system-ui, sans-serif; color: #3D8B5A; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .gt-prose p { margin-bottom: 1rem; }
        .gt-prose a { color: #E84A8B; font-weight: 600; }
        .gt-prose a:hover { color: #C73B73; text-decoration: underline; }
        .gt-prose strong { color: #2D1810; }
        .gt-prose ul, .gt-prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .gt-prose ul { list-style: disc; }
        .gt-prose ol { list-style: decimal; }
        .gt-prose li { margin-bottom: 0.4rem; }
        .gt-prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .gt-prose th, .gt-prose td { padding: 0.6rem; border-bottom: 1px solid #FFE8C8; text-align: left; }
        .gt-prose th { background: #FFF5E8; font-weight: 700; color: #2D1810; }
      `}</style>
    </MeadowLayout>
  );
}

const ALL_GUIDES = [
  { slug: 'how-to-play-online-trivia-betting-game', title: 'How to Play (full rules)', emoji: '📖' },
  { slug: '200-trivia-questions-with-numerical-answers', title: '200 Trivia Questions', emoji: '🎯' },
  { slug: 'free-alternative-to-wits-and-wagers-online', title: 'Free Wits & Wagers Alternative', emoji: '🆓' },
  { slug: 'best-online-trivia-games-for-family-game-night', title: 'Family Trivia Games', emoji: '👨‍👩‍👧' },
  { slug: 'how-to-host-virtual-trivia-night-on-zoom', title: 'Virtual Trivia Night on Zoom', emoji: '💻' },
  { slug: 'online-trivia-betting-game-rules-and-scoring', title: 'Rules & Scoring Explained', emoji: '🎲' },
  { slug: 'free-jackbox-alternative-no-download', title: 'Free Jackbox Alternative', emoji: '📦' },
  { slug: 'kahoot-alternative-for-adults', title: 'Kahoot Alternative for Adults', emoji: '🎓' },
  { slug: 'christmas-and-holiday-trivia-party-games-online', title: 'Holiday Trivia Party Games', emoji: '🎄' },
  { slug: 'price-is-right-style-party-game-online', title: 'Price Is Right Style Game', emoji: '💰' },
  { slug: 'trivia-games-for-2-players-online-free', title: 'Trivia Games for 2 Players', emoji: '👥' },
  { slug: 'virtual-team-building-trivia-game-for-work', title: 'Virtual Team Building Trivia', emoji: '🏢' },
  { slug: 'online-games-for-long-distance-couples-free', title: 'Games for Long-Distance Couples', emoji: '❤️' },
  { slug: 'games-to-play-on-facetime-and-video-calls', title: 'Games for FaceTime & Video Calls', emoji: '📱' },
];

function RelatedGuides({ currentSlug }) {
  const others = ALL_GUIDES.filter(g => g.slug !== currentSlug);
  return (
    <section className="bg-white/70 rounded-3xl border-2 border-[#FFE8C8] p-5 md:p-7 mb-4">
      <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] mb-4">More Guesstimate guides</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {others.map(g => (
          <li key={g.slug}>
            <Link to={`/guesstimate/${g.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFE8C8] text-[#2D1810] font-semibold transition-colors">
              <span className="text-xl">{g.emoji}</span>
              <span className="text-sm md:text-base">{g.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
