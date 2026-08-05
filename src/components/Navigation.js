import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { byMode } from '../data/games';

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

// Games grouped by HOW people pick one: alone right now, today's daily, with
// friends, or for work.
//
// The item lists come from the game registry (src/data/games.js) so adding a
// game never means editing this file. Crucially the dropdowns show a FEW games
// plus a "see all" link rather than the whole catalogue — that is what lets the
// hub grow to dozens of games without the nav becoming unusable on a phone.
const toItems = (games) => games.map((g) => ({ to: g.slug, label: g.name }));

const MENU = [
  {
    label: 'Solo',
    items: toItems(byMode('solo')),
    more: { to: '/solo-games', label: 'All games to play alone' },
  },
  {
    label: 'Daily',
    items: toItems(byMode('daily')),
  },
  {
    // NOTE: every party game stays listed here on purpose. These pages are
    // already indexed, and the nav is a sitewide internal link to each one —
    // trimming the list to "featured + see all" would quietly drop that link
    // equity. Only split this out if the list genuinely stops fitting.
    label: 'Party',
    items: toItems(byMode('party')),
    more: { to: '/all-games', label: 'See all games' },
  },
  {
    label: 'Teams',
    items: [
      ...toItems(byMode('work')),
      { to: '/office-games/virtual-holiday-party-games-for-work', label: 'Holiday Party Games' },
      { to: '/office-games/halloween-games-for-virtual-teams', label: 'Halloween Games' },
      { to: '/team-trivia', label: 'Team Trivia' },
    ],
  },
  {
    label: 'More',
    items: [
      { to: '/all-games', label: 'All games' },
      { to: '/blog', label: 'Blog' },
      { to: '/faq', label: 'FAQ' },
      { to: '/about-contact', label: 'About' },
    ],
  },
];

const Navigation = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null); // desktop dropdown

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus whenever the route changes
  useEffect(() => { setMenuOpen(false); setOpenGroup(null); }, [pathname]);

  const groupActive = (group) => group.items.some((i) => i.to === pathname);

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
      // Column flexbox capped to the viewport so the open mobile menu can never
      // extend past the fold. Measuring the header with flex rather than
      // subtracting a guessed height matters: the row is 68px, not the 4rem you
      // would assume from its padding, so a hardcoded cap left the last few
      // pixels of the panel unreachable.
      //
      // 100dvh inline, 100vh via max-h-screen as the fallback: on mobile the URL
      // bar collapses and 100vh is the LARGEST viewport, which overflows while
      // the bar is visible. Browsers without dvh discard the inline value and
      // fall back to the class.
      style={{ maxHeight: '100dvh' }}
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col max-h-screen transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-[#FFF8E7]/95 backdrop-blur-md shadow-[0_2px_18px_-10px_rgba(45,24,16,0.35)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-3 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="transition-transform group-hover:-rotate-6 group-hover:scale-110">
            <CowHeadLogo size={36} />
          </span>
          <span style={fredoka} className="text-2xl font-bold text-[#2D1810] tracking-tight">
            Herd <span className="text-[#3D8B5A]">Game</span>
          </span>
        </Link>

        {/* Desktop grouped dropdowns */}
        <div style={quicksand} className="hidden md:flex items-center gap-2 text-base font-semibold">
          {MENU.map((group) => {
            const open = openGroup === group.label;
            const active = groupActive(group);
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup((g) => (g === group.label ? null : g))}
              >
                <button
                  type="button"
                  onClick={() => setOpenGroup((g) => (g === group.label ? null : group.label))}
                  aria-haspopup="true"
                  aria-expanded={open}
                  className={`flex items-center gap-1 px-2 py-1 transition-colors ${
                    active || open ? 'text-[#3D8B5A]' : 'text-[#2D1810] hover:text-[#3D8B5A]'
                  }`}
                >
                  {group.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  {active && <Underline />}
                </button>

                {/* dropdown panel (no gap so hover bridges) */}
                {open && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3">
                    {/* Same reachability problem as the mobile panel, on a
                        short desktop window: Solo alone has 23 games, so the
                        tail of the list fell below the fold with no way to get
                        at it. Cap to the space under the header and scroll. */}
                    <div
                      style={{ maxHeight: 'calc(100dvh - 6rem)' }}
                      className="min-w-[12rem] max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border-2 border-[#FFE8C8] bg-[#FFF8E7] shadow-[0_18px_40px_-18px_rgba(45,24,16,0.4)] p-2"
                    >
                      {group.items.map(({ to, label }) => (
                        <Link
                          key={to + label}
                          to={to}
                          className={`block px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                            pathname === to ? 'bg-[#FFE8C8] text-[#3D8B5A]' : 'text-[#2D1810] hover:bg-[#FFF1DC] hover:text-[#3D8B5A]'
                          }`}
                        >
                          {label}
                        </Link>
                      ))}
                      {group.more && (
                        <Link
                          to={group.more.to}
                          className="mt-1 block whitespace-nowrap rounded-xl border-t-2 border-[#FFE8C8] px-3 py-2 text-sm font-bold text-[#3D8B5A] transition-colors hover:bg-[#FFF1DC]"
                        >
                          {group.more.label} →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
          // The panel lives inside a position:fixed nav, so anything taller than
          // the viewport is simply unreachable — the page behind cannot scroll
          // it. With 40+ games in MENU that was everything below "Aim Trainer".
          //
          // flex-1 takes whatever height the header leaves, min-h-0 is what
          // actually permits a flex child to shrink below its content and
          // scroll (without it the panel keeps its full content height and
          // overflows again), and overscroll-contain stops the scroll chaining
          // to the page behind when you reach the end of the list.
          style={quicksand}
          className="md:hidden border-t border-[#FFE8C8] bg-[#FFF8E7]/95 backdrop-blur-md px-4 pb-4 pt-2 font-semibold flex-1 min-h-0 overflow-y-auto overscroll-contain"
        >
          <div className="flex flex-col gap-2">
            <Link to="/" className={`py-2.5 px-2 ${pathname === '/' ? 'text-[#3D8B5A]' : 'text-[#2D1810]'}`}>Home</Link>
            {MENU.map((group) => (
              <div key={group.label}>
                <p className="px-2 pt-2 pb-1 text-xs font-bold uppercase tracking-widest text-[#A89A78]">{group.label}</p>
                {group.items.map(({ to, label }) => {
                  const active = pathname === to;
                  return (
                    <Link
                      key={to + label}
                      to={to}
                      className={`block py-2.5 px-4 rounded-xl ${active ? 'bg-[#FFE8C8] text-[#3D8B5A]' : 'text-[#2D1810]'}`}
                    >
                      {label}
                    </Link>
                  );
                })}
                {group.more && (
                  <Link to={group.more.to} className="block px-4 py-2.5 text-sm font-bold text-[#3D8B5A]">
                    {group.more.label} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
