import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck, FiRefreshCw, FiUsers } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import { sfx } from '../daily/sfx';
import { buildCard, LINES, randomSeed, seedToCode, codeToSeed } from './tropes';

const CANONICAL = 'https://herdgamesonline.com/remote-work-bingo';
const OG = 'https://herdgamesonline.com/og-image.png';
const GREEN = '#3D8B5A';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Remote Work Bingo',
      alternateName: ['Remote Work Bingo', 'Meeting Bingo', 'Work From Home Bingo', 'Virtual Meeting Bingo', 'Buzzword Bingo'],
      url: CANONICAL,
      description: 'Free online Remote Work Bingo: mark the video-meeting clichés ("you\'re on mute", "can everyone see my screen?") as they happen. No download, no signup — play it live during your next Zoom or Teams call.',
      image: OG,
      genre: ['Party', 'Office', 'Bingo'],
      gamePlatform: ['Web browser'],
      playMode: 'MultiPlayer',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'Herd Game' },
    },
  ],
};
const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to play Remote Work Bingo',
  step: [
    { '@type': 'HowToStep', name: 'Open before your meeting', text: 'Each player opens Remote Work Bingo and gets a card of meeting clichés.' },
    { '@type': 'HowToStep', name: 'Mark them live', text: 'During the call, tap a square whenever that cliché happens — "you\'re on mute", a dog barking, "let\'s take this offline".' },
    { '@type': 'HowToStep', name: 'Shout BINGO', text: 'First to mark five in a row — across, down, or diagonally — wins. Share your card and play again next meeting.' },
  ],
};
const FAQS = [
  { q: 'What is Remote Work Bingo?', a: 'A free bingo game for video meetings. Your card is filled with classic remote-work clichés ("you\'re on mute", "can everyone see my screen?", "let\'s take this offline") and you mark each one as it happens during the call. First to five in a row wins.' },
  { q: 'Is it free? Do we need to download or sign up?', a: 'Completely free — no download, no signup. Open the link, get a card, and play. Works in any browser on phone or laptop.' },
  { q: 'How do we all play together?', a: 'Everyone opens the game and gets their own card, so you race to bingo. Want everyone on the SAME card? Use the "Challenge your team" button to copy a link that gives everyone an identical card.' },
  { q: 'Is it good for Microsoft Teams or Zoom meetings?', a: 'Yes — it\'s made for them. Drop the link in the meeting chat and play quietly during a long call. See more games to play on Microsoft Teams.' },
];
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

function useWindowSize() {
  const [s, setS] = useState({ w: 1024, h: 768 });
  useEffect(() => {
    const on = () => setS({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return s;
}

export default function RemoteWorkBingo() {
  const [params, setParams] = useSearchParams();
  const seed = useMemo(() => {
    const fromUrl = codeToSeed(params.get('c') || '');
    return fromUrl != null ? fromUrl : randomSeed();
  }, [params]);

  const cells = useMemo(() => buildCard(seed), [seed]);
  const [marked, setMarked] = useState(() => new Set([12])); // centre free space
  const [copied, setCopied] = useState('');
  const { w, h } = useWindowSize();
  const celebrated = useRef(false);

  // reset marks when the card (seed) changes
  useEffect(() => { setMarked(new Set([12])); celebrated.current = false; }, [seed]);

  const hasBingo = LINES.some((line) => line.every((i) => marked.has(i)));

  useEffect(() => {
    if (hasBingo && !celebrated.current) { celebrated.current = true; sfx.win(); }
  }, [hasBingo]);

  function toggle(i) {
    if (i === 12) return; // free space stays marked
    setMarked((m) => {
      const next = new Set(m);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function newCard() {
    const s = randomSeed();
    setParams({ c: seedToCode(s) }, { replace: true });
  }

  async function challenge() {
    // ensure the URL carries this card's seed, then share/copy it
    const url = `${CANONICAL}?c=${seedToCode(seed)}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Remote Work Bingo', text: 'Same card — let’s play Remote Work Bingo in the meeting!', url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied('challenge'); setTimeout(() => setCopied(''), 2000);
    } catch { /* dismissed */ }
  }

  async function shareWin() {
    const text = 'I got BINGO on Remote Work Bingo! 🎉 Make your next meeting bearable: herdgamesonline.com/remote-work-bingo';
    try {
      if (navigator.share) { await navigator.share({ title: 'Remote Work Bingo', text }); return; }
      await navigator.clipboard.writeText(text);
      setCopied('win'); setTimeout(() => setCopied(''), 2000);
    } catch { /* dismissed */ }
  }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Remote Work Bingo — Free Online Meeting Bingo (No Download)</title>
        <meta name="description" content="Free Remote Work Bingo: mark the video-meeting clichés ('you're on mute', 'can everyone see my screen?') as they happen. No download, no signup — play live on Zoom or Teams." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Remote Work Bingo — Free Online Meeting Bingo" />
        <meta property="og:description" content="Mark the meeting clichés as they happen. Free, no download — perfect for long Zoom & Teams calls." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Remote Work Bingo — Free Online Meeting Bingo" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="relative bg-white/80 rounded-3xl border-4 border-[#FFE8C8] shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] p-4 md:p-7">
        {hasBingo && <Confetti width={w} height={h} numberOfPieces={200} recycle={false} gravity={0.25} />}

        <div className="text-center mb-4">
          <h1 style={fredokaStyle} className="text-3xl md:text-5xl font-bold text-[#2D1810]">Remote Work Bingo</h1>
          <p className="text-[#4A2D1B] mt-1">Mark the meeting clichés as they happen. Five in a row = <strong>BINGO</strong>.</p>
        </div>

        {hasBingo && (
          <div className="text-center mb-4">
            <p style={fredokaStyle} className="text-3xl font-bold" >🎉 BINGO! 🎉</p>
            <button onClick={shareWin} style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-white font-bold hover:scale-105 transition-transform">
              {copied === 'win' ? <><FiCheck /> Copied!</> : <><FiShare2 /> Share your win</>}
            </button>
          </div>
        )}

        {/* the card */}
        <div className="grid grid-cols-5 gap-1.5 md:gap-2 max-w-xl mx-auto">
          {cells.map((cell, i) => {
            const on = marked.has(i);
            return (
              <button key={i} onClick={() => toggle(i)}
                style={on ? { background: GREEN, borderColor: GREEN } : { borderColor: '#FFE8C8' }}
                className={`aspect-square rounded-xl border-2 p-1 flex items-center justify-center text-center leading-tight select-none transition-colors
                  ${on ? 'text-white' : 'bg-[#FFF8EE] text-[#2D1810] hover:bg-[#FFF1DC]'} ${cell.free ? 'font-bold' : ''}`}>
                <span className="text-[9px] sm:text-[11px] md:text-xs break-words">{cell.text}</span>
              </button>
            );
          })}
        </div>

        {/* controls */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button onClick={newCard} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[#2D1810] text-[#2D1810] font-semibold hover:bg-[#FFF1DC]">
            <FiRefreshCw /> New card
          </button>
          <button onClick={challenge} style={{ background: '#2D1810', fontFamily: 'Fredoka, sans-serif' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold">
            {copied === 'challenge' ? <><FiCheck /> Link copied!</> : <><FiUsers /> Challenge your team (same card)</>}
          </button>
        </div>
        <p className="text-center text-xs text-[#8B6347] mt-2">Tip: drop the “challenge” link in your Teams/Zoom chat so everyone plays the same card.</p>

        <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>
      </div>

      {/* SEO / explainer */}
      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">How to play Remote Work Bingo</h2>
        <p className="mb-3">
          Remote Work Bingo turns a long video call into a game. Your 5×5 card is filled with classic remote-work and meeting clichés — <em>“you’re on mute”</em>, <em>“can everyone see my screen?”</em>, <em>“let’s take this offline”</em>, a dog barking, someone joining five minutes late. During the meeting, tap each square the moment it happens. Get <strong>five in a row</strong> — across, down, or diagonally — and you’ve got <strong>BINGO</strong>. It’s free, needs no download or signup, and works on any phone or laptop.
        </p>
        <p className="mb-3">
          Everyone gets their own card, so it’s a quiet race to bingo during the call. Want the whole team on the <strong>same card</strong>? Hit <em>Challenge your team</em> to copy a link that gives everyone an identical board — perfect to drop in the <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link> or Zoom chat.
        </p>
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-2">More games for work</h2>
        <p className="mb-4">
          Remote Work Bingo is one of many free <Link to="/office-games">office games</Link>. For team socials try <Link to="/say-anything">Say Anything</Link> or <Link to="/guesstimate">Guesstimate</Link>, kick off meetings with <Link to="/office-games/virtual-icebreaker-games-for-meetings">icebreaker games</Link>, or make it a weekly thing with <Link to="/office-games/fun-friday-games-for-work">Fun Friday games</Link>.
        </p>
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i}>
              <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">{q}</h3>
              <p className="mt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </MeadowLayout>
  );
}
