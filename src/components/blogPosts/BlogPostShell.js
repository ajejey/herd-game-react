import React from 'react';
import { Link } from 'react-router-dom';
import MeadowLayout, { GrassStrip } from '../MeadowLayout';

/**
 * Wrapper for individual blog post pages.
 * Provides the shared meadow background, nav, themed article card, and footer.
 *
 * Usage:
 *   <BlogPostShell>
 *     <h2>...</h2>
 *     <p>...</p>
 *   </BlogPostShell>
 *
 * The article body content (children) is rendered inside the prose card. The
 * existing markup (h2/h3/p) inside each post stays untouched — only colors
 * inherit via the wrapping `text-[#4A2D1B]` and accent classes will visually
 * blend with the theme. Posts can also import `fredokaStyle` if they want the
 * playful display font on titles.
 */
const BlogPostShell = ({ children }) => {
  return (
    <MeadowLayout>
      <article className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8 herd-blog-prose">
        <div className="mb-4 flex justify-end">
          <Link to="/blog" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold text-sm">
            &larr; All articles
          </Link>
        </div>

        {children}

        <div className="mt-10 pt-6 border-t border-[#FFE8C8] flex flex-wrap gap-3 justify-between items-center text-sm">
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
