import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import WaitlistCTA from './WaitlistCTA';
import { GAMES, SPOKES } from './officeData';

const BASE = 'https://herdgamesonline.com/office-games';
const OG = 'https://herdgamesonline.com/og-image.png';

function GamesRoster({ heading = 'Pick a game — free, no download, play in seconds' }) {
  return (
    <section className="not-prose my-6">
      <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] mb-3">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GAMES.map((g) => (
          <Link key={g.to} to={g.to}
            className="group bg-white rounded-2xl border-4 p-4 flex flex-col transition-transform hover:-translate-y-0.5"
            style={{ borderColor: g.accent + '55' }}>
            <div className="flex items-center justify-between">
              <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">{g.name}</h3>
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: g.accent }}>{g.players}</span>
            </div>
            <p className="text-sm text-[#6B4226] mt-1 flex-1">{g.blurb}</p>
            <span className="mt-2 inline-flex items-center gap-1 font-semibold" style={{ color: g.accent }}>
              Play now <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function OfficeLayout({ slug = '', title, description, h1, keywords, faqs = [], children }) {
  const canonical = slug ? `${BASE}/${slug}` : BASE;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://herdgamesonline.com/' },
      { '@type': 'ListItem', position: 2, name: 'Office Games', item: BASE },
      ...(slug ? [{ '@type': 'ListItem', position: 3, name: h1, item: canonical }] : []),
    ],
  };
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: GAMES.map((g, i) => ({
      '@type': 'ListItem', position: i + 1, name: g.name, url: `https://herdgamesonline.com${g.to}`,
    })),
  };
  const faqSchema = faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  } : null;

  const related = SPOKES.filter((s) => s.slug !== slug);

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
        <meta property="og:type" content="website" />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-[#8B6347] mb-4 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#2D1810]">Home</Link>
          <span>›</span>
          {slug ? <Link to="/office-games" className="hover:text-[#2D1810]">Office Games</Link> : <span className="text-[#2D1810] font-semibold">Office Games</span>}
          {slug && <><span>›</span><span className="text-[#2D1810] font-semibold">{h1}</span></>}
        </nav>

        <article className="bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-10 mb-8">
          <h1 style={fredokaStyle} className="text-3xl md:text-5xl font-bold text-[#2D1810] mb-4 leading-tight">{h1}</h1>

          <GamesRoster />

          <div className="of-prose text-[#4A2D1B] text-base md:text-lg leading-relaxed">{children}</div>

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

          <div className="mt-10 max-h-[300px] overflow-hidden"><AdSlot slot="5969633275" /></div>
        </article>

        <WaitlistCTA source={slug || 'office-games'} />

        {related.length > 0 && (
          <section className="bg-white/70 rounded-3xl border-2 border-[#FFE8C8] p-5 md:p-7 mb-4">
            <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] mb-4">More office &amp; team games</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {related.map((s) => (
                <li key={s.slug}>
                  <Link to={`/office-games/${s.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFE8C8] text-[#2D1810] font-semibold transition-colors">
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-sm md:text-base">{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <style>{`
        .of-prose h2 { font-family: 'Fredoka', system-ui, sans-serif; color: #2D1810; font-size: 1.65rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.2; }
        @media (min-width: 768px) { .of-prose h2 { font-size: 1.875rem; } }
        .of-prose h3 { font-family: 'Fredoka', system-ui, sans-serif; color: #3D8B5A; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .of-prose p { margin-bottom: 1rem; }
        .of-prose a { color: #E84A8B; font-weight: 600; }
        .of-prose a:hover { color: #C73B73; text-decoration: underline; }
        .of-prose strong { color: #2D1810; }
        .of-prose ul, .of-prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .of-prose ul { list-style: disc; }
        .of-prose ol { list-style: decimal; }
        .of-prose li { margin-bottom: 0.4rem; }
      `}</style>
    </MeadowLayout>
  );
}
