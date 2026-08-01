import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { pingDailyComplete } from '../../lib/pingEvent';
import { THEME, FREDOKA, QUICKSAND, QUESTIONS, ANIMALS, scoreQuiz } from './animalData';
import { buildShareText, buildAnimalCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/what-farm-animal-are-you';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'What Farm Animal Are You?',
      alternateName: ['Farm animal personality quiz', 'What animal are you quiz', 'Farm animal quiz'],
      url: CANONICAL,
      description: 'A free personality quiz: answer eight questions and find out which farm animal you are, from the Cow to the Sheepdog to the Goat. Single player, no signup, no download.',
      image: OG,
      genre: ['Personality', 'Quiz'],
      gamePlatform: ['Web browser'],
      playMode: 'SinglePlayer',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'Herd Game' },
    },
  ],
};

const FAQS = [
  { q: 'What is the farm animal personality quiz?', a: 'It is a free eight question quiz that matches you to one of eight farm animals based on how you handle plans, groups, rules and pressure. You get a result with its traits and a card you can share.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no email needed. It runs in your browser on a phone or a laptop.' },
  { q: 'How many results are there?', a: 'Eight: the Cow, the Sheepdog, the Goat, the Horse, the Pig, the Chicken, the Duck and the Sheep. Each has its own traits and description.' },
  { q: 'Can I take it more than once?', a: 'Yes, as many times as you like. There is no daily limit, so you can retake it or send it to friends and compare results.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function FarmAnimal() {
  const [step, setStep] = useState(-1);          // -1 = intro
  const [picks, setPicks] = useState([]);
  const [copied, setCopied] = useState(false);

  const done = step >= QUESTIONS.length;
  const result = useMemo(() => (done ? scoreQuiz(picks) : null), [done, picks]);
  const animal = result ? ANIMALS[result.animal] : null;

  // Fire the completion ping once, when the result first appears. Guarded by a
  // ref so a re-render (or a retake) can never double-count a single result.
  const pingedRef = useRef(false);
  useEffect(() => {
    if (done && animal && !pingedRef.current) {
      pingedRef.current = true;
      pingDailyComplete('what-farm-animal-are-you', { result: animal.id });
    }
  }, [done, animal]);

  /* Both updaters are idempotent for a given `step` on purpose.

     The option buttons stay mounted and clickable through AnimatePresence's
     ~200ms exit animation, so a fast double-tap fires choose() twice with the
     same closed-over `step`. Naively that let the second call overwrite the
     first answer while `step` advanced twice — silently skipping a question and
     under-scoring the quiz. Guarding on the values themselves (rather than a
     timer or a disabled flag) makes the second call a no-op. */
  const choose = (optIndex) => {
    setPicks((p) => (p.length > step ? p : [...p.slice(0, step), optIndex]));
    setStep((s) => (s > step ? s : s + 1));
  };

  const restart = () => { setPicks([]); setStep(-1); pingedRef.current = false; };

  const doShare = async () => {
    const file = await buildAnimalCard(animal.id);
    const res = await shareCardOrText(file, buildShareText(animal.id), 'What farm animal are you?');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const q = QUESTIONS[step];
  // Floor of 5% so the bar never reads as empty/broken on question one.
  const progress = done ? 100 : Math.max(5, Math.round((Math.max(step, 0) / QUESTIONS.length) * 100));

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>What Farm Animal Are You? — Free Personality Quiz</title>
        <meta name="description" content="Take the free farm animal personality quiz. Eight quick questions to find out whether you are the Cow, the Sheepdog, the Goat, the Horse, the Pig, the Chicken, the Duck or the Sheep. No signup, no download." />
        <meta name="keywords" content="what farm animal are you, farm animal quiz, personality quiz, what animal are you quiz, free personality test, fun quiz" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="What Farm Animal Are You?" />
        <meta property="og:description" content="Eight questions. Eight animals. Which one are you?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-24">
        {/* ---------------- INTRO ---------------- */}
        {step === -1 && (
          <div className="text-center">
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">
              What farm animal are you?
            </h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-lg text-base md:text-lg" >
              Eight questions about how you handle plans, people and rules. No signup, no email —
              just your animal and a card you can send to the group chat.
            </p>
            <button
              onClick={() => setStep(0)}
              style={{ ...FREDOKA, background: THEME.pink }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start the quiz
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              Takes about a minute · 8 possible results
            </p>
          </div>
        )}

        {/* ---------------- QUESTIONS ---------------- */}
        {step >= 0 && !done && (
          <div>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between" style={QUICKSAND}>
                <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                  Question {step + 1} of {QUESTIONS.length}
                </span>
                <button onClick={restart} className="text-sm underline" style={{ color: THEME.mut }}>
                  Start over
                </button>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: THEME.border }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: THEME.green }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
              >
                <h2 style={FREDOKA} className="mb-5 text-2xl font-bold leading-snug md:text-3xl">
                  {q.q}
                </h2>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => (
                    <button
                      key={opt.t}
                      data-testid="quiz-option"
                      onClick={() => choose(i)}
                      style={{ ...QUICKSAND, background: THEME.bgAlt, borderColor: THEME.border }}
                      className="rounded-2xl border-2 px-5 py-4 text-left text-base font-semibold transition-all hover:-translate-y-0.5 hover:border-[#3D8B5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8B5A] md:text-lg"
                    >
                      {opt.t}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ---------------- RESULT ---------------- */}
        {done && animal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm font-bold uppercase tracking-widest">
              You are
            </p>
            <h1 style={{ ...FREDOKA, color: animal.color }} className="my-2 text-5xl font-bold md:text-7xl">
              {animal.name}
            </h1>
            <p style={FREDOKA} className="text-xl md:text-2xl">{animal.tagline}</p>

            <div
              className="mx-auto mt-6 max-w-lg rounded-3xl border-2 p-6 text-left"
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
            >
              <p style={QUICKSAND} className="text-base leading-relaxed">{animal.line}</p>
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
                <strong style={{ color: animal.color }}>You are good at:</strong> {animal.goodAt}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {animal.traits.map((t) => (
                  <span
                    key={t}
                    style={{ ...QUICKSAND, background: `${animal.color}1A`, color: animal.color }}
                    className="rounded-full px-3 py-1 text-sm font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={doShare}
                style={{ ...FREDOKA, background: animal.color }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share your animal</>}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={async () => downloadFile(await buildAnimalCard(animal.id))}
                  style={{ ...QUICKSAND, borderColor: THEME.border, color: THEME.mut }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  <FiDownload aria-hidden="true" /> Image
                </button>
                <button
                  onClick={restart}
                  style={{ ...QUICKSAND, borderColor: THEME.border, color: THEME.mut }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  <FiRotateCcw aria-hidden="true" /> Retake
                </button>
              </div>
            </div>

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-6 text-sm">
              Now make your friends take it and find out who the Goat is.
            </p>
          </motion.div>
        )}

        <div className="mt-12"><AdSlot /></div>

        <section className="mt-12" style={QUICKSAND}>
          {/* Hidden while the quiz is in progress: showing all eight results
              under the options spoils the ending and competes with the question
              you are meant to be answering. Crawlers and the prerenderer see the
              intro state, so this costs nothing for SEO. */}
          {(step === -1 || done) && (
            <>
              <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">The eight farm animals</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.values(ANIMALS).map((a) => (
                  <div key={a.id} className="rounded-2xl border-2 p-4" style={{ background: THEME.bgAlt, borderColor: THEME.border }}>
                    <h3 style={{ ...FREDOKA, color: a.color }} className="text-lg font-bold">{a.name}</h3>
                    <p className="mt-1 text-sm" style={{ color: THEME.mut }}>{a.tagline}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 style={FREDOKA} className="mb-3 mt-10 text-2xl font-bold">Questions</h2>
          <div className="space-y-4" style={{ color: THEME.mut }}>
            {FAQS.map(({ q: qq, a }) => (
              <div key={qq}>
                <h3 style={{ ...FREDOKA, color: THEME.ink }} className="text-lg font-bold">{qq}</h3>
                <p className="mt-1">{a}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm" style={{ color: THEME.mut }}>
            More to play: <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.green }}>solo games</Link>,{' '}
            <Link to="/aura" className="font-bold underline" style={{ color: THEME.green }}>Daily Aura</Link>, or{' '}
            <Link to="/all-games" className="font-bold underline" style={{ color: THEME.green }}>the full game hub</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
