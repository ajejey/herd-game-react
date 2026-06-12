/*
  Daily Aura — content + theme.

  Aesthetic: "Soft Liquid" (dreamcore pastel) — calm, cozy, wellness. The aura is
  a soft liquid gradient, NOT astrology/stars/magic. Each color is a pastel
  two-stop gradient with an identity (traits + a warm verdict line).

  The game: a set of "vibe" questions (same set for everyone on a given day), each
  option nudges weights toward aura colors. Your answers → your aura color today.
*/

// ── The eight aura colors (pastel gradients) ────────────────────────────────
export const AURA_COLORS = {
  rose: {
    id: 'rose', name: 'Rose', swatch: '🩷',
    from: '#FFD9E8', to: '#FBA7C9', ink: '#9D2B62',
    traits: ['warm', 'loving', 'magnetic'],
    line: 'Soft heart, strong pull. People feel safe around you.',
  },
  coral: {
    id: 'coral', name: 'Coral', swatch: '🧡',
    from: '#FFE0CC', to: '#FFB199', ink: '#B5532A',
    traits: ['creative', 'spontaneous', 'playful'],
    line: 'You run on impulse and color. Life is more fun near you.',
  },
  gold: {
    id: 'gold', name: 'Gold', swatch: '💛',
    from: '#FFF0C6', to: '#FFD98A', ink: '#A9791A',
    traits: ['confident', 'radiant', 'bright'],
    line: 'You light up the room without trying. Golden-hour energy.',
  },
  sage: {
    id: 'sage', name: 'Sage', swatch: '💚',
    from: '#DCF2DE', to: '#A8DEB5', ink: '#2F7A4E',
    traits: ['calm', 'grounded', 'kind'],
    line: 'Steady and soft. You are the deep breath people need.',
  },
  aqua: {
    id: 'aqua', name: 'Aqua', swatch: '🩵',
    from: '#CFF4EE', to: '#9BE3DA', ink: '#1F8C82',
    traits: ['balanced', 'easygoing', 'clear'],
    line: 'Cool, fresh, unbothered. You go with the flow and it works.',
  },
  sky: {
    id: 'sky', name: 'Sky', swatch: '💙',
    from: '#D5E6FF', to: '#A6C8FF', ink: '#2E5FAE',
    traits: ['thoughtful', 'wise', 'serene'],
    line: 'You see clearly and speak gently. A calm, knowing presence.',
  },
  lilac: {
    id: 'lilac', name: 'Lilac', swatch: '💜',
    from: '#ECDDFF', to: '#C9AEFF', ink: '#7A4FB5',
    traits: ['imaginative', 'dreamy', 'open'],
    line: 'Head in the soft clouds. You feel everything in color.',
  },
  indigo: {
    id: 'indigo', name: 'Indigo', swatch: '🔮',
    from: '#D7D3FF', to: '#A9A1F5', ink: '#4A3FB0',
    traits: ['intuitive', 'deep', 'empathic'],
    line: 'You read the room before a word is spoken. Quiet depth.',
  },
};

export const COLOR_IDS = Object.keys(AURA_COLORS);

// ── Vibe questions. Each option carries weights toward aura colors. ─────────
// Keep options 2–4; weights small (2 primary, 1 secondary) for a nice spread.
export const QUESTIONS = [
  { q: 'Pick a sky.', options: [
    { label: 'Sunrise peach', w: { coral: 2, gold: 1 } },
    { label: 'Clear blue noon', w: { sky: 2, aqua: 1 } },
    { label: 'Lilac dusk', w: { lilac: 2, indigo: 1 } },
    { label: 'Soft grey rain', w: { sage: 1, sky: 1 } },
  ] },
  { q: 'Your ideal Saturday energy?', options: [
    { label: 'Out and buzzing', w: { coral: 2, gold: 1 } },
    { label: 'Cozy and slow', w: { sage: 2, rose: 1 } },
    { label: 'Deep conversations', w: { indigo: 2, sky: 1 } },
  ] },
  { q: 'Choose a drink.', options: [
    { label: 'Matcha', w: { sage: 2, aqua: 1 } },
    { label: 'Strawberry something', w: { rose: 2, coral: 1 } },
    { label: 'Lavender latte', w: { lilac: 2, indigo: 1 } },
    { label: 'Iced lemon', w: { gold: 2, aqua: 1 } },
  ] },
  { q: 'Your texts are mostly…', options: [
    { label: 'Hype and emojis', w: { coral: 2, gold: 1 } },
    { label: 'Thoughtful paragraphs', w: { indigo: 2, sky: 1 } },
    { label: 'Short and warm', w: { rose: 2, sage: 1 } },
  ] },
  { q: 'Pick a weather.', options: [
    { label: 'Golden hour', w: { gold: 2, coral: 1 } },
    { label: 'Misty morning', w: { sage: 2, aqua: 1 } },
    { label: 'Starry night', w: { indigo: 2, lilac: 1 } },
  ] },
  { q: 'At a party you are…', options: [
    { label: 'The center of it', w: { gold: 2, coral: 1 } },
    { label: 'Deep 1:1 in the kitchen', w: { indigo: 2, sky: 1 } },
    { label: 'Making everyone comfy', w: { rose: 2, sage: 1 } },
  ] },
  { q: 'Choose a texture.', options: [
    { label: 'Silk', w: { lilac: 2, rose: 1 } },
    { label: 'Linen', w: { sage: 2, aqua: 1 } },
    { label: 'Velvet', w: { indigo: 2, rose: 1 } },
  ] },
  { q: 'Your comfort scene?', options: [
    { label: 'Beach and sun', w: { gold: 2, aqua: 1 } },
    { label: 'Forest walk', w: { sage: 2, sky: 1 } },
    { label: 'Rooftop at night', w: { indigo: 2, lilac: 1 } },
  ] },
  { q: 'Pick a flower.', options: [
    { label: 'Peony', w: { rose: 2, coral: 1 } },
    { label: 'Wildflower', w: { sage: 2, gold: 1 } },
    { label: 'Iris', w: { indigo: 2, lilac: 1 } },
  ] },
  { q: 'How do you make decisions?', options: [
    { label: 'Gut, fast', w: { coral: 2, gold: 1 } },
    { label: 'Feel it out', w: { rose: 2, indigo: 1 } },
    { label: 'Think it through', w: { sky: 2, aqua: 1 } },
  ] },
  { q: 'Choose a sound.', options: [
    { label: 'Ocean waves', w: { aqua: 2, sky: 1 } },
    { label: 'Vinyl crackle', w: { indigo: 2, lilac: 1 } },
    { label: 'Birdsong', w: { sage: 2, gold: 1 } },
  ] },
  { q: 'Your aesthetic right now?', options: [
    { label: 'Warm and glowy', w: { gold: 2, rose: 1 } },
    { label: 'Cool and clean', w: { aqua: 2, sky: 1 } },
    { label: 'Dreamy and soft', w: { lilac: 2, indigo: 1 } },
  ] },
  { q: 'Pick a time of day.', options: [
    { label: 'Early sunrise', w: { gold: 2, sage: 1 } },
    { label: 'Bright noon', w: { aqua: 2, coral: 1 } },
    { label: 'Late night', w: { indigo: 2, lilac: 1 } },
  ] },
  { q: 'Friends would call you…', options: [
    { label: 'The sunshine', w: { gold: 2, coral: 1 } },
    { label: 'The calm one', w: { sage: 2, sky: 1 } },
    { label: 'The deep one', w: { indigo: 2, lilac: 1 } },
    { label: 'The sweetheart', w: { rose: 2, coral: 1 } },
  ] },
  { q: 'Choose a gem.', options: [
    { label: 'Rose quartz', w: { rose: 2, lilac: 1 } },
    { label: 'Aquamarine', w: { aqua: 2, sky: 1 } },
    { label: 'Amethyst', w: { lilac: 2, indigo: 1 } },
    { label: 'Citrine', w: { gold: 2, coral: 1 } },
  ] },
  { q: 'Your love language leans…', options: [
    { label: 'Words and warmth', w: { rose: 2, gold: 1 } },
    { label: 'Quality time', w: { sage: 2, sky: 1 } },
    { label: 'Deep understanding', w: { indigo: 2, lilac: 1 } },
  ] },
  { q: 'Pick a vibe word.', options: [
    { label: 'Radiant', w: { gold: 2, coral: 1 } },
    { label: 'Serene', w: { aqua: 2, sage: 1 } },
    { label: 'Magnetic', w: { rose: 2, indigo: 1 } },
    { label: 'Ethereal', w: { lilac: 2, indigo: 1 } },
  ] },
  { q: 'Choose a landscape.', options: [
    { label: 'Sunflower field', w: { gold: 2, sage: 1 } },
    { label: 'Still lake', w: { aqua: 2, sky: 1 } },
    { label: 'Purple mountains at dusk', w: { indigo: 2, lilac: 1 } },
  ] },
  { q: 'How is your energy today?', options: [
    { label: 'Bright and ready', w: { gold: 2, coral: 1 } },
    { label: 'Soft and steady', w: { sage: 2, rose: 1 } },
    { label: 'Quiet and reflective', w: { indigo: 2, sky: 1 } },
  ] },
  { q: 'Pick a scent.', options: [
    { label: 'Citrus', w: { gold: 2, coral: 1 } },
    { label: 'Fresh linen', w: { aqua: 2, sage: 1 } },
    { label: 'Vanilla and musk', w: { rose: 2, indigo: 1 } },
    { label: 'Lavender', w: { lilac: 2, sky: 1 } },
  ] },
  { q: 'Your dream space is…', options: [
    { label: 'Sunlit and full of plants', w: { sage: 2, gold: 1 } },
    { label: 'By the water', w: { aqua: 2, sky: 1 } },
    { label: 'Candlelit and cozy', w: { rose: 2, indigo: 1 } },
  ] },
];

export const QUESTIONS_PER_DAY = 7;

// Day 1 = 2026-06-01 (UTC), matches the other daily games.
const EPOCH = Date.UTC(2026, 5, 1);
export function getDayNumber(now = new Date()) {
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((todayUTC - EPOCH) / 86400000) + 1;
}

// Deterministic PRNG so everyone gets the same question set on a given day.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// The same N questions for everyone today (rotated by day).
export function getDailyAuraQuestions(day) {
  const rng = mulberry32((day || 1) * 2654435761);
  return seededShuffle(QUESTIONS, rng).slice(0, QUESTIONS_PER_DAY);
}

// Sum the weights from the chosen options; highest color wins. Ties broken
// deterministically by the day seed so the result is stable on replay.
export function scoreAura(day, picks, questions) {
  const totals = Object.fromEntries(COLOR_IDS.map((id) => [id, 0]));
  questions.forEach((q, i) => {
    const opt = q.options[picks[i]];
    if (!opt) return;
    for (const [id, n] of Object.entries(opt.w)) totals[id] += n;
  });
  const rng = mulberry32((day || 1) * 40503 + 7);
  const order = seededShuffle(COLOR_IDS, rng); // stable tiebreak order for the day
  let best = order[0];
  for (const id of order) if (totals[id] > totals[best]) best = id;
  return { colorId: best, totals };
}
