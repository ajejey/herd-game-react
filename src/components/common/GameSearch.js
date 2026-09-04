import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiCornerDownLeft } from 'react-icons/fi';
import { GAMES, MODES, aliasesFor } from '../../data/games';
import RotatingHint from './RotatingHint';
import { track } from '../../lib/analytics';

/*
  Find a game by name, on a hub with 43 of them.

  Why this exists: measured 21 Aug 2026, MORE people arrive at this site
  directly than from Google — 360 against 208 over 48 hours. Someone who typed
  the address in came for a game they already know the name of, and until now
  the only way to find it was to scroll four sections or open /all-games. A hub
  you cannot search is a list, not a hub.

  DESIGN INTENT — deliberately not a modal, and not a separate page. It sits in
  the flow of the homepage and turns into a result list underneath itself, so
  nothing is covered up and Escape is never the only way out. On a phone the
  results push the page down rather than floating over it, because an overlay
  that closes when you tap the wrong pixel is how people lose their place.

  Matching is scored rather than filtered, because "word" should put
  Scattergories above Chameleon, and a plain `.includes()` cannot tell you that.
*/

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const quicksand = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/*
  Score a game against the query. Higher is better, 0 means "do not show".

  The weights encode what someone typing into a search box on a games hub
  actually means: a name match is almost always the intent, a tag match is a
  browse ("word games"), and a blurb match is a long shot worth showing but
  never worth ranking above the other two.
*/
function score(game, q) {
  const name = norm(game.name);
  const tags = (game.tags || []).map(norm);
  const blurb = norm(game.blurb);
  const mode = norm(MODES[game.mode]?.label);

  if (name === q) return 1000;
  if (name.startsWith(q)) return 900 - name.length;          // shorter name wins
  if (name.split(' ').some((w) => w.startsWith(q))) return 800;
  if (name.includes(q)) return 700;
  /* An alias IS the name, to the person typing it — "wits and wagers" means
     Guesstimate as surely as "guesstimate" does. Ranked just under our own
     name so a real name always wins a collision. */
  const alias = aliasesFor(game.id);
  if (alias.some((a) => a === q)) return 850;
  if (alias.some((a) => a.startsWith(q) || q.startsWith(a))) return 650;
  if (alias.some((a) => a.includes(q))) return 620;

  if (tags.some((t) => t === q)) return 600;
  if (tags.some((t) => t.startsWith(q))) return 500;
  if (mode.includes(q)) return 400;
  if (blurb.includes(q)) return 300;

  /* Last resort: every letter of the query in order somewhere in the name, so
     "scatt" and even "sctg" still find Scattergories. Typing on a phone is
     inaccurate and a search that punishes a typo is worse than no search. */
  let i = 0;
  for (const ch of name) if (ch === q[i]) i += 1;
  return i === q.length ? 100 : 0;
}

/*
  What the rotating hint offers. EVERY ONE of these must actually return
  results — advertising a search that comes back empty is worse than no hint at
  all, and search-check.js fails if any of them finds nothing.
*/
const HINTS = ['Scattergories', 'word games', 'games for work', 'Caveman Clues', 'trivia', 'bluffing'];

/*
  What to try when nothing matched.

  These are TAG names taken from the registry, not adjectives someone thought
  sounded right. The first version suggested "drawing" — no game has that tag,
  no name or blurb contains it, so the escape hatch from a dead end was itself
  a dead end. search-check.js asserts every one of these returns games, exactly
  as it does for HINTS.
*/
const RESCUE = ['word', 'trivia', 'memory', 'puzzle'];

/*
  Words that carry no intent on a site that is entirely games.

  "word games", "games for work" and "a game to play with friends" all mean the
  same thing as "word", "work" and "friends" — every other token is scaffolding.
  Without this, scoring the whole phrase as one string returns nothing for the
  most natural way to ask, which the hint invariant caught immediately.
*/
const STOPWORDS = new Set([
  'a', 'an', 'the', 'game', 'games', 'play', 'playing', 'to', 'for', 'with',
  'and', 'or', 'of', 'on', 'in', 'my', 'our', 'some', 'any', 'good', 'best',
  'fun', 'free', 'online', 'website', 'app',
]);

/*
  Second pass, used only when the phrase as a whole matched nothing anywhere.

  Kept deliberately strict: a token only counts if it scores 500 or better —
  a name, an alias or a tag — so "a fun game" cannot drag in every entry whose
  blurb happens to contain "fun". A weak partial match on one word of three is
  noise, not a result.
*/
function phraseScore(game, tokens) {
  let best = 0;
  let hits = 0;
  for (const t of tokens) {
    const sc = score(game, t);
    if (sc >= 500) { hits += 1; best = Math.max(best, sc); }
  }
  return hits ? best - 250 + hits * 10 : 0;   // always below a whole-phrase match
}

/*
  ── Somebody pasting a room code into the search box ────────────────────────

  27% of everything typed into this box in Sep 2026 was a room code, not a game
  name. QCGJ, THBZ, LNQP, HRAL and 3QB19F were all verified as live rooms at the
  moment they were typed. Those people had been sent a code, could not find the
  field it goes in, used the only box on the page that looked like one, and were
  told "nothing found" — one field away from a game with friends already waiting
  in it. It was the single largest category of failed search on the site.

  So a code-shaped query asks the server which game it belongs to. The server
  already knows: every room records its namespace, and gameDirectory turns that
  into a name and a path. See backend/src/findRoom.js.

  Shaped as a QUESTION, not a guess. The lookup runs only for something that
  looks like a code, only after typing settles, and a miss changes nothing — the
  normal "nothing found" state still shows, so a genuine search for a short word
  is never hijacked by a failed room lookup.
*/
const CODE_SHAPE = /^[a-z0-9]{4,6}$/;
const API = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export default function GameSearch({ className = '' }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  /* null = not asked or not found. { code, game, path } = go here. */
  const [room, setRoom] = useState(null);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const loggedRef = useRef('');

  const query = norm(q);
  const results = useMemo(() => {
    if (query.length < 2) return [];

    /* The phrase as typed, first — an exact name always wins. */
    let scored = GAMES.map((g) => ({ g, s: score(g, query) })).filter((r) => r.s > 0);

    /* Only if that found nothing: try the words that carry meaning. */
    if (!scored.length) {
      const tokens = query.split(' ').filter((t) => t.length > 1 && !STOPWORDS.has(t));
      if (tokens.length) {
        scored = GAMES.map((g) => ({ g, s: phraseScore(g, tokens) })).filter((r) => r.s > 0);
      }
    }

    return scored
      .sort((a, b) => b.s - a.s || a.g.name.localeCompare(b.g.name))
      .slice(0, 8)
      .map((r) => r.g);
  }, [query]);

  // Keep the highlighted row in range when the result list changes under it.
  useEffect(() => { setActive(0); }, [query]);

  /*
    Ask whether a code-shaped query is a real room.

    Debounced past the typing, and aborted when the query moves on, so
    backspacing through "SCATTERGORIES" cannot leave a stale answer from an
    earlier prefix on screen. Any failure is silent: this is an extra offer, and
    a lookup that errors should leave the search exactly as it was.
  */
  useEffect(() => {
    const compact = query.replace(/\s+/g, '');
    if (!CODE_SHAPE.test(compact)) { setRoom(null); return undefined; }

    /*
      Clear FIRST. Aborting the request does not un-render the previous answer:
      typing HRAL then HRAL5 left "Join this Clover room · HRAL" on screen for
      the debounce plus a round trip, and a click in that window went to a room
      the person had already stopped asking for. The abort cancels the fetch,
      not the state.
    */
    setRoom(null);

    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`${API}/api/find-room/${encodeURIComponent(compact.toUpperCase())}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setRoom(d && d.path ? d : null))
        .catch(() => { /* offline, aborted, or no such room — say nothing */ });
    }, 350);

    return () => { clearTimeout(t); ctrl.abort(); };
  }, [query]);

  /*
    Record what people look for, once they have stopped typing.

    Debounced hard on purpose: keystroke-level logging would send eight events
    for "scattergories" and drown the signal in prefixes of itself. What we
    actually want is the settled query and whether it found anything —
    `zero: true` is the valuable half, because a list of searches that returned
    nothing IS the backlog for SEARCH_ALIASES and for the next game to build.

    The query is normalised and capped. Nobody types anything personal into a
    box labelled "search 44 games", but there is no reason to carry more than
    the shape of the intent either.
  */
  useEffect(() => {
    if (query.length < 2) return undefined;
    const t = setTimeout(() => {
      if (loggedRef.current === query) return;
      loggedRef.current = query;
      track('game_search', {
        q: query.slice(0, 40),
        results: results.length,
        zero: results.length === 0,
        top: results[0]?.id ?? null,
      });
    }, 900);
    return () => clearTimeout(t);
  }, [query, results]);

  // Keep the highlighted row visible when arrowing past the fold.
  useEffect(() => {
    const el = listRef.current?.children?.[active];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [active]);

  /*
    On a phone the box sits below a tall hero, so opening the results pushes
    them past the fold and under the keyboard — you get a list you cannot see.
    Lifting the box towards the top on focus is what makes this feel like a
    search rather than a filter that happens to be on the page.

    Only when there is something to lift past, and only once per focus, so it
    never fights someone who has deliberately scrolled.
  */
  function onFocus() {
    setFocused(true);
    if (window.innerWidth >= 768) return;
    const el = inputRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top > 120) window.scrollBy({ top: top - 80, behavior: 'smooth' });
  }

  function onKeyDown(e) {
    if (!results.length) {
      /*
        A room code scores 0 against every game, so `results` is empty while the
        room row is the ONLY thing on screen. Returning here made that row
        mouse-only — the person this whole feature exists for pastes a code,
        presses Enter, and nothing happens.
      */
      if (e.key === 'Enter' && room) { e.preventDefault(); goToRoom(); return; }
      if (e.key === 'Escape') setQ('');
      return;
    }
    /* With games listed too, the room row is still the first thing offered, so
       Enter on the top row means the room. */
    if (e.key === 'Enter' && room && active === 0) { e.preventDefault(); goToRoom(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % results.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + results.length) % results.length); }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
    else if (e.key === 'Escape') { setQ(''); inputRef.current?.blur(); }
  }

  function go(game) {
    if (!game) return;
    /* The pair that matters: what they typed, and what they chose. A query
       whose chosen result sits at rank 4 is a ranking bug we would otherwise
       never hear about. */
    track('game_search_open', {
      q: query.slice(0, 40),
      picked: game.id,
      rank: results.indexOf(game) + 1,
      results: results.length,
    });
    setQ('');
    navigate(game.slug);
  }

  const tooShort = query.length > 0 && query.length < 2;
  const nothing = query.length >= 2 && results.length === 0 && !room;

  /*
    Take them to the game's landing page with the code in the URL, not straight
    into the room. They still have to pick a name, and the host may not have
    started yet — the join screen is where both of those already work. `?join=`
    is read by the join box so the code is filled in for them; even if that
    prefill were ever dropped, they land on the right game with the code still
    in their clipboard, which is the whole problem solved.
  */
  function goToRoom() {
    if (!room) return;
    track('game_search_room_code', { q: query.slice(0, 12), game: room.game, live: !!room.live });
    setQ('');
    setRoom(null);
    navigate(room.direct ? room.path : `${room.path}?join=${encodeURIComponent(room.code)}`);
  }

  return (
    <div className={`mx-auto w-full max-w-xl ${className}`} data-testid="game-search">
      <div
        className="flex items-center gap-2 rounded-2xl border-2 border-[#FFE8C8] bg-white px-4 py-3 transition-colors focus-within:border-[#3D8B5A]"
      >
        <FiSearch aria-hidden="true" className="shrink-0 text-[#8B6347]" size={20} />
        <div className="relative min-w-0 flex-1">
          {/* Drawn over the empty input, because ::placeholder cannot be
              animated (Mozilla bug 1115623). Stops the moment anyone focuses
              or types — an animation next to a live caret is just noise. */}
          <RotatingHint hints={HINTS} paused={focused || q.length > 0} />
          <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={() => setFocused(false)}
          type="text"
          /* Not type="search" — iOS Safari draws its own clear button inside
             it, at a different size, and we already have one. */
          role="combobox"
          aria-expanded={results.length > 0 || !!room}
          aria-controls="game-search-results"
          aria-label="Search games"
          autoComplete="off"
          placeholder={`Search ${GAMES.length} games…`}
          maxLength={40}
          style={quicksand}
          className="w-full bg-transparent text-[17px] text-[#2D1810] outline-none placeholder:text-transparent"
          />
        </div>
        {q && (
          <button
            type="button"
            onClick={() => { setQ(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-[#8B6347] hover:bg-[#FFF6E9] hover:text-[#2D1810]"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {(results.length > 0 || nothing || tooShort || room) && (
        <div className="mt-2 overflow-hidden rounded-2xl border-2 border-[#FFE8C8] bg-white shadow-[0_18px_40px_-24px_rgba(45,24,16,0.4)]">
          {tooShort && (
            <p style={quicksand} className="px-4 py-3 text-[15px] text-[#8B6347]">
              Keep typing…
            </p>
          )}

          {room && (
            /*
              Above the game results, because someone holding a code is not
              browsing — they are trying to get somewhere specific and everything
              else on this list is noise to them.
            */
            <button
              type="button"
              onClick={goToRoom}
              data-testid="search-room-hit"
              className="flex w-full items-center gap-3 border-b-2 border-[#FFE8C8] px-4 py-3 text-left hover:bg-[#FFF8E7]"
            >
              <span
                style={{ ...fredoka, background: '#3D8B5A' }}
                className="shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold tracking-widest text-white"
              >
                {room.code}
              </span>
              <span className="min-w-0">
                <span style={fredoka} className="block font-bold text-[#2D1810]">
                  Join this {room.game} room →
                </span>
                <span style={quicksand} className="block text-[15px] text-[#6B4226]">
                  {/*
                    Only claim someone is waiting when the room is actually live.
                    A code from a game that finished on Tuesday still resolves
                    from the snapshot, and telling that person their friends are
                    waiting is a small lie that costs trust for no gain.
                  */}
                  {room.live
                    ? 'That looks like a room code, and it is — someone is waiting for you.'
                    : `That is a ${room.game} room code. Open it here and put it in.`}
                </span>
              </span>
            </button>
          )}

          {nothing && (
            /* An empty state that gives them somewhere to go. "No results" on a
               hub of 43 games is a dead end of our own making. */
            <div className="px-4 py-3">
              <p style={quicksand} className="text-[15px] text-[#6B4226]">
                Nothing called “{q.trim()}”. Try{' '}
                {RESCUE.map((word, i) => (
                  <React.Fragment key={word}>
                    {i > 0 && (i === RESCUE.length - 1 ? ' or ' : ', ')}
                    <button type="button" onClick={() => setQ(word)} className="font-bold underline">
                      {word}
                    </button>
                  </React.Fragment>
                ))}
                {' —'}
              </p>
              <button
                type="button"
                onClick={() => { setQ(''); navigate('/all-games'); }}
                style={fredoka}
                className="mt-2 font-bold text-[#E84A8B] underline"
              >
                or browse all {GAMES.length} games →
              </button>
            </div>
          )}

          <ul id="game-search-results" ref={listRef} role="listbox" className="max-h-[19rem] overflow-y-auto">
            {results.map((g, i) => {
              const Icon = g.Icon;
              return (
                <li key={g.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(g)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      i === active ? 'bg-[#FFF6E9]' : 'bg-white'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${g.accent}1A`, color: g.accent }}
                    >
                      {Icon ? <Icon size={18} /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span style={fredoka} className="block truncate font-bold text-[#2D1810]">
                        {g.name}
                      </span>
                      <span style={quicksand} className="block truncate text-[14px] text-[#8B6347]">
                        {MODES[g.mode]?.label} · {g.players} · {g.minutes} min
                      </span>
                    </span>
                    {i === active && (
                      <FiCornerDownLeft aria-hidden="true" className="hidden shrink-0 text-[#A88B72] sm:block" size={16} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
