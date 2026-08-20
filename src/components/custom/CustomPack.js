import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiCheck, FiCopy, FiArrowRight, FiEdit3 } from 'react-icons/fi';
import Navigation from '../Navigation';
import { copyText } from '../../lib/shareSheet';
import { cleanPackCode, packPlayPath } from '../../lib/packCode';

/*
  Write your own questions, get a pack ID.

  Built because two hosts wrote in on the same day asking for exactly this — one
  for a family party, one for a classroom icebreaker. Deliberately no account:
  the pack ID is a bearer token like the room code, which gives reuse ("run it
  again next term") and cross-device ("write it on a laptop, play from a phone")
  without a signup. See CUSTOM_PACKS_PLAN.md.

  The textarea is one-question-per-line rather than a row of inputs on purpose:
  a host almost always has their questions written down somewhere already, and
  pasting a numbered list should just work. The server strips "1." / "-" / "*"
  prefixes, blank lines and duplicates.
*/

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const CANONICAL = 'https://herdgamesonline.com/custom-questions';
const OG = 'https://herdgamesonline.com/og-image.png';

const THEME = { bg: '#FFF8E7', bgAlt: '#FFFFFF', border: '#FFE8C8', ink: '#2D1810', mut: '#6B5B4A', green: '#3D8B5A', pink: '#E84A8B' };
const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const MIN = 8;

/*
  Two games, two formats. Herd Mentality has no right answers, so a prompt per
  line is enough. Team Trivia does, so it needs the answers too — pipe
  separated, CORRECT FIRST. That matches how the built-in bank is authored and
  is the one format a host can paste straight out of a spreadsheet. The game
  shuffles the options every round, so "correct first" never leaks on screen.
*/
const GAMES = [
  {
    id: 'herd',
    name: 'Herd Mentality',
    blurb: 'Everyone answers. You score by matching the group, not by being right.',
    hint: 'One question per line. There are no right answers — the fun is in agreeing.',
    example: `What's the best pizza topping?
Who in this room is most likely to be late?
Best holiday destination?
Worst film ever made?
Best breakfast in the world?
Most annoying habit?
Best board game ever?
Worst chore in the house?`,
  },
  {
    id: 'teamtrivia',
    name: 'Team Trivia',
    blurb: 'Teams race to answer. There is a right answer.',
    hint: 'One per line: the question, then the answers separated by | — put the CORRECT answer first. We shuffle them, so it is never in the same place on screen.',
    example: `What is the capital of France? | Paris | London | Rome | Berlin
Which planet is closest to the sun? | Mercury | Venus | Mars | Earth
Who wrote Hamlet? | Shakespeare | Dickens | Austen | Joyce
How many sides does a hexagon have? | 6 | 5 | 7 | 8
What is the largest ocean? | Pacific | Atlantic | Indian | Arctic
Which gas do plants absorb? | Carbon dioxide | Oxygen | Nitrogen | Helium
Which year was the first Moon landing? | 1969 | 1972 | 1965 | 1958
How many players are on a football team? | 11 | 9 | 10 | 12`,
  },
  {
    id: 'sayanything',
    name: 'Say Anything',
    blurb: 'Write the funniest answer, then vote for the best.',
    hint: 'One question per line. Open-ended and a bit silly works best — there is no right answer, only a favourite.',
    example: `What is the most useless superpower?
What would be the worst thing to hear from a pilot?
What is the strangest thing in your fridge right now?
What should this class be renamed to?
What is the worst possible name for a pet?
What would you do with an extra hour every day?
What is the most overrated food?
What is the best excuse for being late?`,
  },
  {
    id: 'wyr',
    name: 'Would You Rather',
    blurb: 'Two impossible choices. Vote and see where the group lands.',
    hint: 'Two choices per line, separated by | or the word "or".',
    example: `Be able to fly | Be invisible
Always know when someone is lying | Always get away with lying
Have unlimited free coffee or Have unlimited free lunch
Never have homework again | Never have exams again
Be the funniest person in the room | Be the smartest
Live without music | Live without films
Have a rewind button | Have a pause button
Always be 10 minutes early | Always be 10 minutes late`,
  },
  {
    id: 'scattergories',
    name: 'Scattergories',
    blurb: 'A letter, a list of categories, and a race against the clock.',
    hint: 'One category per line — things people can name, like "A fruit" or "Something in a classroom".',
    example: `A fruit
Something you find in a classroom
A film with a number in the title
Something that is always cold
A job your parents would approve of
Something you would take to a desert island
A band or singer
Something that makes a noise`,
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Custom Question Packs — Herd Game',
  url: CANONICAL,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any (Web)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Write your own questions for Herd Mentality and play them with your group. Free, no signup — you get a pack ID to share and reuse.',
};

const FAQS = [
  { q: 'Do I need an account?', a: 'No. You get a pack ID — named after your pack, so you can tell them apart. Keep it and you can play the same questions again any time, on any device. It is not the room code your players type; that appears once you start a game.' },
  { q: 'How many questions do I need?', a: `At least ${MIN}, and up to 60. A game usually runs through 8 to 12, so around 15 gives a comfortable session without repeats.` },
  { q: 'Can I paste a list I already have?', a: 'Yes. Put one question per line and paste it in. Numbering like "1." or bullets like "-" are stripped automatically, as are blank lines and duplicates.' },
  { q: 'Who can see my questions?', a: 'Only people you give the code to. Packs are not listed, searchable or browsable anywhere on the site.' },
  { q: 'How long does a pack last?', a: 'Six months from the last time it was played, and every play resets that. A pack you use each term stays for good; a one-off party pack quietly expires.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

function anonId() {
  try {
    let id = localStorage.getItem('hg_anon');
    if (!id) { id = 'a_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('hg_anon', id); }
    return id;
  } catch { return ''; }
}

/*
  The packs this device has made.

  Without accounts the pack ID is the only key, so "write it down" was the
  entire reuse story — which is a trap, not a feature. A teacher coming back
  next term will not have kept a six-character code on a sticky note. So the
  browser remembers every pack made here, which gives them a library on the
  device they wrote it on, and the code still covers the other cases: a
  different device, a shared phone, a colleague running the same quiz.
*/
const MY_PACKS_KEY = 'hg_my_packs';

function readMyPacks() {
  try {
    const raw = JSON.parse(localStorage.getItem(MY_PACKS_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((p) => p && p.packCode) : [];
  } catch { return []; }
}

function rememberPack(p) {
  try {
    const list = readMyPacks().filter((x) => x.packCode !== p.packCode);
    list.unshift({ packCode: p.packCode, title: p.title || '', game: p.game || 'herd', count: p.count || 0, at: Date.now() });
    localStorage.setItem(MY_PACKS_KEY, JSON.stringify(list.slice(0, 20)));
  } catch { /* private mode — the code still works, it just is not remembered */ }
}

// Each game lives at its own address, so a pack has to open the right one.
/* The map lives in lib/packCode.js because the join boxes need it too — a
   host who pastes a pack ID into the wrong game gets sent to the right one. */
const playPath = (p) => packPlayPath(p);

/*
  How long the ROOM code is for each game — the code players type, which is not
  this one. Herd is the original game and uses six characters; every game on the
  newer engine uses four letters. Getting this wrong on screen is what caused
  the confusion in the first place, so it is stated per game rather than guessed.
*/
// Must equal MAX_SLUG in backend/src/models/CustomPack.js.
const MAX_SLUG_PREVIEW = 24;

/*
  Mirrors slugifyTitle in backend/src/models/CustomPack.js, for the live preview
  under the name field. Deliberately a preview and not a promise: the server
  issues the real ID, adds the random suffix, and resolves any collision. If the
  two ever drift, the preview is slightly wrong for a moment — which is a far
  cheaper failure than the client trying to own ID allocation.
*/
function previewSlug(title) {
  const base = String(title || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/&/g, ' AND ')
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!base) return 'YOUR-PACK';
  if (base.length <= MAX_SLUG_PREVIEW) return base;

  // Same word-boundary truncation the server uses, not an approximation of it.
  const cut = base.slice(0, MAX_SLUG_PREVIEW + 1);
  const lastBreak = cut.lastIndexOf('-');
  const trimmed = lastBreak > 0 ? cut.slice(0, lastBreak) : base.slice(0, MAX_SLUG_PREVIEW);
  return trimmed.replace(/-$/, '');
}

const ROOM_CODE_LEN = {
  herd: 6,
  teamtrivia: 4,
  sayanything: 4,
  wyr: 4,
  scattergories: 4,
};

export default function CustomPack() {
  const [game, setGame] = useState('herd');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState('idle');   // idle | saving | done | error
  const [error, setError] = useState('');
  const [pack, setPack] = useState(null);
  const [copied, setCopied] = useState('');
  const [myPacks, setMyPacks] = useState([]);
  const [lookup, setLookup] = useState('');
  const [lookupState, setLookupState] = useState('idle');   // idle | loading | error
  const [found, setFound] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { setMyPacks(readMyPacks()); }, [pack]);

  const openCode = async (raw) => {
    const code = cleanPackCode(raw);
    if (code.length < 4) { setLookupState('error'); setFound(null); return; }
    setLookupState('loading'); setFound(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/packs/${code}`);
      const d = await res.json();
      if (!res.ok || !d.ok) { setLookupState('error'); return; }
      setFound(d);
      setLookupState('idle');
      rememberPack(d);
      setMyPacks(readMyPacks());
    } catch { setLookupState('error'); }
  };

  const def = GAMES.find((g) => g.id === game) || GAMES[0];

  /*
    The SERVER tells us what it understood — we deliberately do not parse here.

    An earlier version counted questions in the browser with its own copy of the
    rules. Two copies drift, and the host is the one who finds out: the screen
    says ten, the save says eight, and nothing on the page explains which is
    lying. Now the preview endpoint returns the exact parse that would be
    stored, so what they see is what they get.
  */
  const [parsed, setParsed] = useState({ count: 0, problems: [], preview: [] });

  useEffect(() => {
    if (!text.trim()) { setParsed({ count: 0, problems: [], preview: [] }); return undefined; }
    /*
      `live` is the point of this effect's cleanup, not the timeout.

      The debounce alone does not order responses: paste a long list (slow
      parse, slow reply), edit it, and the second request can return first —
      then the first lands and overwrites the display with a parse of text that
      is no longer in the box. Count, problem line numbers and preview rows
      would all be describing something the host had already changed, on a page
      whose entire premise is that the server's parse is the truth.
    */
    let live = true;
    const t = setTimeout(() => {
      fetch(`${BACKEND_URL}/api/packs/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, questions: text }),
      })
        .then((r) => r.json())
        // A rate-limited or failed reply has no counts on it; keeping the last
        // good parse beats flashing "0 questions" at someone mid-sentence.
        .then((d) => { if (live && d && d.ok !== false) setParsed({ count: d.count || 0, problems: d.problems || [], preview: d.preview || [] }); })
        .catch(() => { /* keep the last good parse rather than flashing an error */ });
    }, 350);
    return () => { live = false; clearTimeout(t); };
  }, [text, game]);

  const count = parsed.count;
  const enough = count >= MIN;

  const save = async () => {
    if (!enough || state === 'saving') return;
    setState('saving'); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/packs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, title: title.trim(), questions: text, anonId: anonId() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error || 'Could not save that pack.'); setState('error'); return; }
      setPack(data);
      setState('done');
      rememberPack(data);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setState('error');
    }
  };

  const shareUrl = pack ? `https://herdgamesonline.com${playPath(pack)}` : '';

  const doCopy = async (what, value) => {
    await copyText(value);
    setCopied(what);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Custom Questions for Herd Mentality — Free, No Signup</title>
        <meta name="description" content="Write your own questions for Herd Mentality and play them with your family, friends or class. Free, no signup — you get a pack ID named after your pack, to share and reuse." />
        <meta name="keywords" content="custom questions, herd mentality custom, make your own party game, classroom icebreaker questions, custom trivia questions, family party game" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Custom Questions for Herd Mentality" />
        <meta property="og:description" content="Write your own questions, get a code, play with your group. Free, no signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-24">
        {state !== 'done' && (
          <>
            <div className="text-center">
              <h1 style={FREDOKA} className="text-3xl font-bold leading-tight md:text-4xl">Write your own questions</h1>
              <p style={QUICKSAND} className="mx-auto mt-3 max-w-xl text-base md:text-lg">
                Play Herd Mentality with questions about your own family, class or team.
                Create a PACK and reuse it anytime with your PACK ID. 
              </p>
            </div>

            {/* REUSE — the half of this feature that a code alone does not give
                you. Without somewhere to type it, "keep your code" means
                "keep this exact URL", which nobody does. */}
            <div style={{ background: THEME.bgAlt, borderColor: THEME.border }} className="mt-6 rounded-3xl border-[3px] p-5">
              <span style={QUICKSAND} className="block text-base font-bold">Already made one? Open it again</span>
              <div className="mt-2 flex gap-2">
                <input
                  data-testid="pack-lookup"
                  value={lookup}
                  onChange={(e) => { setLookup(e.target.value.toUpperCase()); setLookupState('idle'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') openCode(lookup); }}
                  placeholder="PACK ID"
                  maxLength={8}
                  style={{ ...FREDOKA, borderColor: THEME.border, background: THEME.bg, letterSpacing: '0.12em' }}
                  className="min-w-0 flex-1 rounded-xl border-2 px-4 py-3 font-bold uppercase outline-none"
                />
                <button
                  onClick={() => openCode(lookup)}
                  data-testid="pack-lookup-go"
                  style={{ ...FREDOKA, background: THEME.green }}
                  className="rounded-xl px-5 py-3 font-bold text-white active:scale-[0.98]"
                >
                  {lookupState === 'loading' ? '…' : 'Open'}
                </button>
              </div>
              {lookupState === 'error' && (
                <p role="alert" data-testid="pack-lookup-error" style={{ ...QUICKSAND, color: '#D0463B' }} className="mt-2 text-base font-bold">
                  No pack with that code. Check for a typo — codes have no letter O or I.
                </p>
              )}

              {found && (
                <div data-testid="pack-found" className="mt-3 rounded-2xl border-2 p-3" style={{ borderColor: THEME.green, background: '#EAF6EE' }}>
                  <p style={{ ...FREDOKA, color: '#2D6E45' }} className="font-bold">
                    {found.title || 'Your pack'} · {found.count} questions
                  </p>
                  <ol style={{ ...QUICKSAND, color: THEME.ink }} className="mt-2 max-h-40 space-y-1 overflow-y-auto text-base">
                    {found.questions.map((q, i) => <li key={i}>{i + 1}. {q}</li>)}
                  </ol>
                  <button
                    onClick={() => navigate(playPath(found))}
                    data-testid="pack-found-play"
                    style={{ ...FREDOKA, background: THEME.pink }}
                    className="mt-3 w-full rounded-xl py-3 font-bold text-white active:scale-[0.98]"
                  >
                    Start a game with it →
                  </button>
                </div>
              )}

              {myPacks.length > 0 && !found && (
                <div className="mt-4">
                  <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm font-bold uppercase tracking-widest">
                    Packs you made on this device
                  </p>
                  <ul className="mt-2 space-y-2">
                    {myPacks.slice(0, 5).map((mp) => (
                      <li key={mp.packCode}>
                        <button
                          onClick={() => { setLookup(mp.packCode); openCode(mp.packCode); }}
                          data-testid="pack-mine"
                          style={{ ...QUICKSAND, borderColor: THEME.border, background: THEME.bg }}
                          className="flex w-full items-center justify-between rounded-xl border-2 px-3 py-2 text-left"
                        >
                          <span className="min-w-0 truncate font-bold">
                            {mp.title || 'Untitled pack'}
                            <span style={{ color: THEME.mut }} className="ml-2 text-sm font-normal">
                              {mp.count} questions · {(GAMES.find((g) => g.id === mp.game) || GAMES[0]).name}
                            </span>
                          </span>
                          <span style={{ ...FREDOKA, color: THEME.green, letterSpacing: '0.1em' }} className="ml-3 shrink-0 text-base font-bold">
                            {mp.packCode}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2 text-sm">
                    Remembered on this device only. Keep the code to open a pack anywhere else.
                  </p>
                </div>
              )}
            </div>

            <div style={{ background: THEME.bgAlt, borderColor: THEME.border }} className="mt-6 rounded-3xl border-[3px] p-5">
              <span style={QUICKSAND} className="block text-base font-bold">Which game?</span>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {GAMES.map((g) => {
                  const on = g.id === game;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      data-testid="pack-game"
                      data-game={g.id}
                      aria-pressed={on}
                      onClick={() => { setGame(g.id); setText(''); setError(''); }}
                      style={{
                        ...QUICKSAND,
                        background: on ? THEME.green : THEME.bg,
                        color: on ? '#fff' : THEME.ink,
                        borderColor: on ? THEME.green : THEME.border,
                      }}
                      className="rounded-2xl border-2 px-4 py-3 text-left"
                    >
                      <span style={FREDOKA} className="block font-bold">{g.name}</span>
                      <span className="block text-sm" style={{ opacity: 0.85 }}>{g.blurb}</span>
                    </button>
                  );
                })}
              </div>

              {/*
                No longer labelled optional, and the hint says why.

                The name now BECOMES the pack ID — "Letter S" gives
                LETTER-S-K7X, and skipping it gives QXUME5. The host who wrote
                in had five packs and left two of them untitled, which is a good
                part of why she could not tell them apart. It is still not
                enforced: blocking someone over a field they can fill in later
                is friction, and the fallback works. But nobody should skip it
                without knowing what they are giving up.
              */}
              <label style={QUICKSAND} className="mt-5 block text-base font-bold" htmlFor="pack-title">
                Give it a name
              </label>
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-0.5 text-base">
                This becomes its ID, so you can tell your packs apart later.
              </p>
              <input
                id="pack-title"
                data-testid="pack-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
                placeholder="Dad's birthday quiz"
                aria-describedby="pack-title-preview"
                style={{ ...QUICKSAND, borderColor: THEME.border, background: THEME.bg }}
                className="mt-1 w-full rounded-xl border-2 px-4 py-3 font-bold outline-none"
              />
              {/*
                Show the ID forming as they type. The whole change is that the
                ID means something now, and the cheapest way to prove that is to
                let someone watch their own words become it.
              */}
              <p id="pack-title-preview" style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1 text-base">
                {title.trim()
                  ? <>Its ID will be <strong style={{ color: THEME.green }}>{previewSlug(title)}-•••</strong></>
                  : 'Without a name it gets a random ID like QXUME5, which is harder to recognise later.'}
              </p>

              <label style={QUICKSAND} className="mt-5 block text-base font-bold" htmlFor="pack-questions">
                Your questions
              </label>
              <p data-testid="pack-hint" style={{ ...QUICKSAND, color: THEME.mut }} className="mb-1 text-sm">
                {def.hint}
              </p>
              <textarea
                id="pack-questions"
                data-testid="pack-questions"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                placeholder={def.example}
                style={{ ...QUICKSAND, borderColor: enough ? THEME.green : THEME.border, background: THEME.bg }}
                className="mt-1 w-full rounded-xl border-2 px-4 py-3 leading-relaxed outline-none"
              />

              <div className="mt-2 flex items-center justify-between" style={QUICKSAND}>
                <span data-testid="pack-count" className="text-base font-bold" style={{ color: enough ? THEME.green : THEME.mut }}>
                  {count} question{count === 1 ? '' : 's'}{enough ? ' — ready' : ` · ${MIN - count} more needed`}
                </span>
                <button
                  onClick={() => setText(def.example)}
                  style={{ ...QUICKSAND, color: THEME.mut }}
                  className="text-base underline"
                >
                  Use an example
                </button>
              </div>

              {/* Named problems, with line numbers. Silently dropping a line is
                  the thing most likely to make a teacher give up: they typed
                  twenty questions, the counter says eight, and nothing says
                  which twelve are wrong. */}
              {parsed.problems.length > 0 && (
                <div data-testid="pack-problems" className="mt-3 rounded-xl border-2 border-[#E0A02C] bg-[#FFF6E3] p-3">
                  <p style={{ ...QUICKSAND, color: '#8A5B00' }} className="text-base font-bold">
                    {parsed.problems.length} line{parsed.problems.length === 1 ? '' : 's'} we could not read:
                  </p>
                  <ul style={{ ...QUICKSAND, color: '#8A5B00' }} className="mt-1 space-y-1 text-base">
                    {parsed.problems.slice(0, 6).map((p, i) => (
                      <li key={`${p.line}-${i}`}>
                        <strong>Line {p.line}:</strong> {p.reason}
                        {p.text ? <span className="opacity-70"> — “{p.text}”</span> : null}
                      </li>
                    ))}
                    {parsed.problems.length > 6 && <li>…and {parsed.problems.length - 6} more.</li>}
                  </ul>
                </div>
              )}

              {/* What we understood, in their own words. For trivia this shows
                  which answer we think is correct — the one thing that is
                  invisible until the game and disastrous to get wrong. */}
              {parsed.preview.length > 0 && (
                <details data-testid="pack-preview" className="mt-3 rounded-xl border-2 p-3" style={{ borderColor: THEME.border }}>
                  <summary style={{ ...QUICKSAND, color: THEME.mut }} className="cursor-pointer text-base font-bold">
                    Check what we understood ({parsed.preview.length})
                  </summary>
                  <ol style={QUICKSAND} className="mt-2 space-y-2 text-base">
                    {/* Three shapes come back depending on the game: a plain
                        string, a trivia {q, options}, or a WYR {a, b}. Assuming
                        one of them threw inside render and took the ENTIRE page
                        down with it — the host saw a blank screen, not a
                        preview. Handle each explicitly. */}
                    {parsed.preview.map((item, i) => (
                      <li key={i} className="border-b pb-2 last:border-0" style={{ borderColor: THEME.border }}>
                        {typeof item === 'string' && <span className="font-bold">{item}</span>}

                        {item && typeof item === 'object' && Array.isArray(item.options) && (
                          <>
                            <span className="font-bold">{item.q}</span>
                            <span className="mt-1 block">
                              <span style={{ color: THEME.green }} className="font-bold">✓ {item.options[0]}</span>
                              {item.options.length > 1 && (
                                <span style={{ color: THEME.mut }}> · {item.options.slice(1).join(' · ')}</span>
                              )}
                            </span>
                          </>
                        )}

                        {item && typeof item === 'object' && !Array.isArray(item.options) && (
                          <span className="font-bold">
                            {item.a}
                            <span style={{ color: THEME.mut }} className="font-normal"> — or — </span>
                            {item.b}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </details>
              )}

              {error && (
                <p role="alert" style={{ ...QUICKSAND, color: '#D0463B' }} className="mt-3 text-base font-bold">{error}</p>
              )}

              <button
                onClick={save}
                disabled={!enough || state === 'saving'}
                data-testid="pack-save"
                style={{ ...FREDOKA, background: enough ? THEME.green : THEME.border, color: enough ? '#fff' : THEME.mut }}
                className="mt-4 w-full rounded-2xl py-4 text-lg font-bold active:scale-[0.99] disabled:cursor-not-allowed"
              >
                {state === 'saving' ? 'Saving…' : 'Create my pack'}
              </button>
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-3 text-center text-sm">
                Tip: writing on a laptop is far easier than a phone. You can play from anywhere afterwards.
              </p>
            </div>
          </>
        )}

        {state === 'done' && pack && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">Your pack ID</p>
            {/*
              Sized to the code, not to a fixed guess.

              text-5xl with 0.15em tracking was right for QXUME5 — six characters
              on one line, unmistakable. A named code like
              CISS-DIVISION-LETTER-S-H6M at that size wraps onto four lines and
              swamps the screen, which reads as something having gone wrong at
              the exact moment we are trying to reassure someone that it has not.
            */}
            <p
              data-testid="pack-code"
              style={{
                ...FREDOKA,
                color: THEME.pink,
                letterSpacing: pack.packCode.length > 10 ? '0.02em' : '0.15em',
                overflowWrap: 'anywhere',
              }}
              className={`my-2 font-bold ${
                pack.packCode.length > 18 ? 'text-2xl md:text-3xl'
                  : pack.packCode.length > 10 ? 'text-3xl md:text-4xl'
                  : 'text-5xl md:text-6xl'
              }`}
            >
              {pack.packCode}
            </p>
            <p style={QUICKSAND} className="text-lg">
              {pack.title ? `“${pack.title}” · ` : ''}{pack.count} questions
            </p>

            {/*
              The single most important thing on this screen, and it used to be
              missing entirely.

              A Community Coordinator wrote five packs for a work event, then
              emailed to ask why the codes were six characters when Scattergories
              rooms are four letters. The old copy here said "anyone with the code
              can start a game using your questions", which reads as "this is the
              code your players type". It is not. Two different codes, two
              different lengths, and nothing on screen drew the line.

              So the line is drawn, before anything else on the page.
            */}
            <div
              style={{ borderColor: THEME.border, background: '#FFFDF6' }}
              className="mx-auto mt-5 max-w-md rounded-2xl border-2 p-4 text-left"
            >
              <p style={{ ...QUICKSAND, color: THEME.ink }} className="text-base">
                <strong>This ID is for you, not your players.</strong> It opens your questions
                whenever you want to run them again.
              </p>
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2 text-base">
                Your players never type this. When you start a game you get a separate{' '}
                <strong>{ROOM_CODE_LEN[pack.game] === 6 ? 'six-character' : 'four-letter'} room code</strong>
                {' '}— that is the one to put on the screen for everyone else.
              </p>
            </div>

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mx-auto mt-4 max-w-md">
              Keep the ID, or bookmark the link below. Either one brings your questions back on
              any device — there is no account to log into.
            </p>

            <div className="mx-auto mt-7 grid max-w-sm gap-3">
              <button
                onClick={() => navigate(playPath(pack))}
                data-testid="pack-play"
                style={{ ...FREDOKA, background: THEME.pink }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                Start a game with it <FiArrowRight aria-hidden="true" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => doCopy('code', pack.packCode)}
                  style={{ ...QUICKSAND, borderColor: THEME.green, color: THEME.green }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied === 'code' ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiCopy aria-hidden="true" /> Copy ID</>}
                </button>
                <button
                  onClick={() => doCopy('link', shareUrl)}
                  style={{ ...QUICKSAND, borderColor: THEME.border, color: THEME.mut }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied === 'link' ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiCopy aria-hidden="true" /> Copy link</>}
                </button>
              </div>
              <button
                onClick={() => { setState('idle'); setPack(null); setText(''); setTitle(''); }}
                style={{ ...QUICKSAND, color: THEME.mut }}
                className="mt-1 flex items-center justify-center gap-2 text-base underline"
              >
                <FiEdit3 aria-hidden="true" /> Write another pack
              </button>
            </div>
          </motion.div>
        )}

        <section className="mt-14" style={QUICKSAND}>
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">Your own questions, your own group</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Herd Mentality is about matching the group rather than being right, which is why it works so well
            with questions about the people in the room. “Which of us would survive longest in the wild?” lands
            differently at a family party than any question we could write for you.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Write at least {MIN} questions, one per line — paste a list you already have if you like. You get a
            pack ID back. Anyone who starts a game with that ID plays your questions instead of ours, and
            everything else about the game works exactly as normal: share a room code, everyone plays on their
            own phone, no downloads and no accounts.
          </p>

          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">Questions</h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q}>
                <h3 style={FREDOKA} className="text-lg font-bold">{q}</h3>
                <p style={{ color: THEME.mut }} className="mt-1">{a}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base" style={{ color: THEME.mut }}>
            <Link to="/" className="font-bold underline" style={{ color: THEME.green }}>Play Herd Mentality</Link>{' '}
            with the built-in questions, or see{' '}
            <Link to="/all-games" className="font-bold underline" style={{ color: THEME.green }}>every game in the hub</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
