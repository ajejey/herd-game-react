import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const quicksand = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const CowHeadLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <ellipse cx="32" cy="36" rx="22" ry="20" fill="#FFFFFF" stroke="#2D1810" strokeWidth="2.5" />
    <ellipse cx="32" cy="44" rx="13" ry="10" fill="#FFE8C8" stroke="#2D1810" strokeWidth="2" />
    <ellipse cx="27" cy="46" rx="1.4" ry="1.8" fill="#2D1810" />
    <ellipse cx="37" cy="46" rx="1.4" ry="1.8" fill="#2D1810" />
    <path d="M28 51 Q32 53 36 51" stroke="#2D1810" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <ellipse cx="20" cy="28" rx="6" ry="9" fill="#FFFFFF" stroke="#2D1810" strokeWidth="2" transform="rotate(-25 20 28)" />
    <ellipse cx="44" cy="28" rx="6" ry="9" fill="#FFFFFF" stroke="#2D1810" strokeWidth="2" transform="rotate(25 44 28)" />
    <ellipse cx="22" cy="32" rx="3" ry="4" fill="#FFB6C1" transform="rotate(-25 22 32)" />
    <ellipse cx="42" cy="32" rx="3" ry="4" fill="#FFB6C1" transform="rotate(25 42 32)" />
    <path d="M22 18 Q18 12 14 14" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M42 18 Q46 12 50 14" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="22" cy="28" rx="3" ry="4" fill="#2D1810" />
    <ellipse cx="44" cy="32" rx="2.5" ry="3" fill="#2D1810" />
    <circle cx="29" cy="40" r="0.9" fill="#2D1810" />
    <circle cx="35" cy="40" r="0.9" fill="#2D1810" />
  </svg>
);

const navLinkClass = (active) =>
  `relative px-2 py-1 transition-colors ${
    active ? 'text-[#3D8B5A]' : 'text-[#2D1810] hover:text-[#3D8B5A]'
  }`;

const Navigation = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/daily', label: 'Daily Herd' },
    { to: '/say-anything', label: 'Say Anything 💬' },
    { to: '/guesstimate', label: 'Guesstimate 🎯' },
    { to: '/blog', label: 'Blog' },
    { to: '/faq', label: 'FAQ' },
    { to: '/about-contact', label: 'About' }
  ];

  const Underline = () => (
    <svg
      className="absolute left-1 right-1 -bottom-1 w-[calc(100%-0.5rem)] h-2"
      viewBox="0 0 60 6"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 3 Q15 -1 30 3 T60 3" fill="none" stroke="#E84A8B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-[#FFF8E7]/95 backdrop-blur-md shadow-[0_2px_18px_-10px_rgba(45,24,16,0.35)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="transition-transform group-hover:-rotate-6 group-hover:scale-110">
            <CowHeadLogo size={36} />
          </span>
          <span style={fredoka} className="text-2xl font-bold text-[#2D1810] tracking-tight">
            Herd <span className="text-[#3D8B5A]">Game</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={quicksand} className="hidden md:flex items-center gap-3 text-base font-semibold">
          {links.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} className={navLinkClass(active)}>
                {label}
                {active && <Underline />}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="md:hidden p-2 -mr-2 text-[#2D1810]"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div
          style={quicksand}
          className="md:hidden border-t border-[#FFE8C8] bg-[#FFF8E7]/95 backdrop-blur-md px-4 pb-4 pt-2 font-semibold"
        >
          <div className="flex flex-col">
            {links.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`py-3 px-2 border-b border-[#FFE8C8]/70 last:border-0 ${
                    active ? 'text-[#3D8B5A]' : 'text-[#2D1810]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
