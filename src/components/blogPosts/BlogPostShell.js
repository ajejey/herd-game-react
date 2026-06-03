import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { GrassStrip, fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';

const SITE = 'https://herdgamesonline.com';

/**
 * Wrapper for individual blog post pages — now owns all per-post SEO.
 *
 * Props:
 *   slug          — path under /blog (e.g. "1" → /blog/1)
 *   title         — full <title> (click-optimized, ~55-60 chars)
 *   description   — meta description (~150-160 chars)
 *   h1            — visible H1 (defaults to title without the " - Herd Game" suffix)
 *   datePublished — ISO date string (e.g. "2025-04-12")
 *   dateModified  — ISO date string (optional; defaults to datePublished)
 *   image         — OG image URL (optional; defaults to the site OG image)
 *   children      — article body (h2/h3/p…)
 *
 * Renders Helmet (title/desc/canonical/OG/Twitter), an H1 + published date,
 * and BlogPosting JSON-LD. Body content (children) renders inside the card.
 */
const BlogPostShell = ({ slug, title, description, h1, datePublished, dateModified, image, children }) => {
  const canonical = slug ? `${SITE}/blog/${slug}` : `${SITE}/blog`;
  const ogImage = image || `${SITE}/og-image.png`;
  const heading = h1 || (title ? title.replace(/\s*[-|]\s*Herd Game.*$/i, '') : undefined);

  const articleSchema = title
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: heading,
        description,
        image: ogImage,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        author: { '@type': 'Organization', name: 'Herd Game' },
        publisher: {
          '@type': 'Organization',
          name: 'Herd Game',
          logo: { '@type': 'ImageObject', url: `${SITE}/logo512.png` },
        },
        ...(datePublished ? { datePublished } : {}),
        dateModified: dateModified || datePublished,
      }
    : null;

  const prettyDate = datePublished
    ? new Date(datePublished + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <MeadowLayout>
      {title && (
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={canonical} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={canonical} />
          <meta property="og:image" content={ogImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={ogImage} />
          {articleSchema && <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>}
        </Helmet>
      )}
      <article className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8 herd-blog-prose">
        <div className="mb-4 flex justify-end">
          <Link to="/blog" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold text-sm">
            &larr; All articles
          </Link>
        </div>

        {heading && <h1 style={fredokaStyle}>{heading}</h1>}
        {prettyDate && <p className="text-sm text-[#8B6347] mb-6">Published {prettyDate}</p>}

        {children}

        {/* Ad — end of article, before footer nav */}
        <div className="mt-10 max-h-[300px] overflow-hidden">
          <AdSlot slot="5698170537" />
        </div>

        <div className="mt-6 pt-6 border-t border-[#FFE8C8] flex flex-wrap gap-3 justify-between items-center text-sm">
          <Link to="/blog" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Back to all articles</Link>
          <Link to="/" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">Play Herd Game &rarr;</Link>
        </div>

        <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
      </article>

      <style>{`
        .herd-blog-prose h1 { font-family: 'Fredoka', system-ui, sans-serif; color: #2D1810; font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; line-height: 1.15; }
        @media (min-width: 768px) { .herd-blog-prose h1 { font-size: 2.5rem; } }
        .herd-blog-prose h2 { font-family: 'Fredoka', system-ui, sans-serif; color: #2D1810; font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.2; }
        .herd-blog-prose h3 { font-family: 'Fredoka', system-ui, sans-serif; color: #3D8B5A; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .herd-blog-prose h4 { font-family: 'Fredoka', system-ui, sans-serif; color: #2D1810; font-weight: 600; margin-top: 1rem; margin-bottom: 0.4rem; }
        .herd-blog-prose p, .herd-blog-prose li { color: #4A2D1B; line-height: 1.7; }
        .herd-blog-prose p { margin-bottom: 1rem; }
        .herd-blog-prose a { color: #E84A8B; font-weight: 600; }
        .herd-blog-prose a:hover { color: #C73B73; }
        .herd-blog-prose strong { color: #2D1810; }
        .herd-blog-prose ul, .herd-blog-prose ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .herd-blog-prose ul { list-style: disc; }
        .herd-blog-prose ol { list-style: decimal; }
        .herd-blog-prose blockquote { border-left: 4px solid #FFD56B; background: #FFFBE8; padding: 0.75rem 1rem; border-radius: 0.5rem; margin: 1rem 0; color: #2D1810; }
      `}</style>
    </MeadowLayout>
  );
};

export default BlogPostShell;
