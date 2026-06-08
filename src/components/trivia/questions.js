/*
  Daily Trivia — client-only question bank.

  10 questions a day, chosen deterministically by day number so everyone gets the
  same daily quiz. No backend: the bank ships in the bundle, streak lives in
  localStorage (see share.js).

  Schema (built for the future — seasonal + seed/AI pipeline drop in with no rework):
    { q, options: [CORRECT, wrong, wrong, wrong], category, difficulty 0-2, season? }
  The correct answer is authored FIRST; option order is shuffled at runtime.

  v1 is a hand-curated, high-confidence bank. Next step: bulk-seed from Open
  Trivia DB (CC BY-SA) + AI-augment per topic/season (see TRIVIA_GAME_VISION.md).
*/

import GENERATED from './bank.generated.json';

export const QUESTIONS = [
  // ── Geography ──
  { q: 'What is the capital of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], category: 'Geography', difficulty: 1 },
  { q: 'Which is the largest ocean on Earth?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], category: 'Geography', difficulty: 0 },
  { q: 'Mount Everest sits on the border of Nepal and which country?', options: ['China', 'India', 'Bhutan', 'Pakistan'], category: 'Geography', difficulty: 1 },
  { q: 'Which country has the most natural lakes?', options: ['Canada', 'Russia', 'USA', 'Finland'], category: 'Geography', difficulty: 2 },
  { q: 'The Sahara Desert is on which continent?', options: ['Africa', 'Asia', 'Australia', 'South America'], category: 'Geography', difficulty: 0 },
  { q: 'What is the longest river in the world?', options: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], category: 'Geography', difficulty: 1 },
  { q: 'Which city is known as the Big Apple?', options: ['New York', 'Chicago', 'Los Angeles', 'Boston'], category: 'Geography', difficulty: 0 },
  { q: 'Which country is both in Europe and Asia and has Istanbul as its largest city?', options: ['Turkey', 'Greece', 'Russia', 'Egypt'], category: 'Geography', difficulty: 1 },

  // ── Science & Nature ──
  { q: 'What gas do plants absorb from the air for photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], category: 'Science', difficulty: 0 },
  { q: 'How many bones are in the adult human body?', options: ['206', '186', '226', '306'], category: 'Science', difficulty: 1 },
  { q: 'What is the chemical symbol for gold?', options: ['Au', 'Ag', 'Gd', 'Go'], category: 'Science', difficulty: 1 },
  { q: 'Which planet is the hottest in our solar system?', options: ['Venus', 'Mercury', 'Mars', 'Jupiter'], category: 'Science', difficulty: 2 },
  { q: 'What is the most abundant gas in Earth’s atmosphere?', options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon'], category: 'Science', difficulty: 1 },
  { q: 'What part of the cell is known as its powerhouse?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Membrane'], category: 'Science', difficulty: 0 },
  { q: 'At what temperature (Celsius) does water freeze?', options: ['0', '32', '100', '-10'], category: 'Science', difficulty: 0 },
  { q: 'What is the speed of light approximately?', options: ['300,000 km/s', '30,000 km/s', '3,000 km/s', '3 million km/s'], category: 'Science', difficulty: 2 },

  // ── History ──
  { q: 'In which year did World War II end?', options: ['1945', '1944', '1939', '1948'], category: 'History', difficulty: 1 },
  { q: 'Who was the first President of the United States?', options: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'], category: 'History', difficulty: 0 },
  { q: 'The Great Wall is located in which country?', options: ['China', 'Japan', 'India', 'Mongolia'], category: 'History', difficulty: 0 },
  { q: 'Which ancient civilization built the pyramids of Giza?', options: ['Egyptians', 'Romans', 'Greeks', 'Mayans'], category: 'History', difficulty: 0 },
  { q: 'Who painted the Mona Lisa?', options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Van Gogh'], category: 'History', difficulty: 0 },
  { q: 'The Titanic sank in which year?', options: ['1912', '1905', '1920', '1898'], category: 'History', difficulty: 1 },
  { q: 'Which country gifted the Statue of Liberty to the USA?', options: ['France', 'Britain', 'Spain', 'Italy'], category: 'History', difficulty: 1 },

  // ── Sport ──
  { q: 'How many players are on a standard soccer team on the field?', options: ['11', '10', '9', '12'], category: 'Sport', difficulty: 0 },
  { q: 'In which sport would you perform a slam dunk?', options: ['Basketball', 'Volleyball', 'Tennis', 'Cricket'], category: 'Sport', difficulty: 0 },
  { q: 'How often are the Summer Olympic Games held?', options: ['Every 4 years', 'Every 2 years', 'Every 3 years', 'Every 5 years'], category: 'Sport', difficulty: 0 },
  { q: 'In tennis, what is a score of zero called?', options: ['Love', 'Nil', 'Duck', 'Blank'], category: 'Sport', difficulty: 1 },
  { q: 'Which country has won the most FIFA World Cups (men’s)?', options: ['Brazil', 'Germany', 'Italy', 'Argentina'], category: 'Sport', difficulty: 1 },
  { q: 'How many points is a touchdown worth in American football?', options: ['6', '7', '3', '5'], category: 'Sport', difficulty: 1 },

  // ── Entertainment & Pop culture ──
  { q: 'Which wizard attends Hogwarts in the famous book series?', options: ['Harry Potter', 'Gandalf', 'Merlin', 'Frodo'], category: 'Entertainment', difficulty: 0 },
  { q: 'What is the name of the toy cowboy in Toy Story?', options: ['Woody', 'Buzz', 'Rex', 'Hamm'], category: 'Entertainment', difficulty: 0 },
  { q: 'Which band performed the song "Hey Jude"?', options: ['The Beatles', 'The Rolling Stones', 'Queen', 'The Who'], category: 'Entertainment', difficulty: 1 },
  { q: 'In which fictional city does Batman operate?', options: ['Gotham City', 'Metropolis', 'Star City', 'Central City'], category: 'Entertainment', difficulty: 0 },
  { q: 'Who is the author of the "Harry Potter" series?', options: ['J.K. Rowling', 'Stephen King', 'J.R.R. Tolkien', 'Roald Dahl'], category: 'Entertainment', difficulty: 0 },
  { q: 'What kind of animal is Pumbaa in The Lion King?', options: ['Warthog', 'Meerkat', 'Lion', 'Hyena'], category: 'Entertainment', difficulty: 1 },
  { q: 'Which streaming show features the "Upside Down"?', options: ['Stranger Things', 'The Crown', 'Wednesday', 'Dark'], category: 'Entertainment', difficulty: 1 },

  // ── Food & Drink ──
  { q: 'Which fruit is traditionally used to make wine?', options: ['Grapes', 'Apples', 'Berries', 'Plums'], category: 'Food', difficulty: 0 },
  { q: 'What is the main ingredient in guacamole?', options: ['Avocado', 'Tomato', 'Pea', 'Cucumber'], category: 'Food', difficulty: 0 },
  { q: 'Which country is the origin of sushi?', options: ['Japan', 'China', 'Korea', 'Thailand'], category: 'Food', difficulty: 0 },
  { q: 'Espresso originates from which country?', options: ['Italy', 'France', 'Brazil', 'Colombia'], category: 'Food', difficulty: 1 },
  { q: 'What spice is the most expensive in the world by weight?', options: ['Saffron', 'Vanilla', 'Cardamom', 'Cinnamon'], category: 'Food', difficulty: 2 },
  { q: 'Which of these is a Mexican dish?', options: ['Taco', 'Sushi', 'Risotto', 'Croissant'], category: 'Food', difficulty: 0 },

  // ── General knowledge ──
  { q: 'How many continents are there on Earth?', options: ['7', '5', '6', '8'], category: 'General', difficulty: 0 },
  { q: 'What is the largest mammal in the world?', options: ['Blue whale', 'African elephant', 'Giraffe', 'Hippopotamus'], category: 'General', difficulty: 0 },
  { q: 'How many sides does a hexagon have?', options: ['6', '5', '7', '8'], category: 'General', difficulty: 0 },
  { q: 'What is the smallest prime number?', options: ['2', '1', '3', '0'], category: 'General', difficulty: 1 },
  { q: 'Which language has the most native speakers worldwide?', options: ['Mandarin Chinese', 'English', 'Spanish', 'Hindi'], category: 'General', difficulty: 2 },
  { q: 'What color do you get by mixing blue and yellow?', options: ['Green', 'Purple', 'Orange', 'Brown'], category: 'General', difficulty: 0 },
  { q: 'How many minutes are in a full day?', options: ['1440', '1240', '720', '2400'], category: 'General', difficulty: 1 },
  { q: 'Which planet do we live on?', options: ['Earth', 'Mars', 'Venus', 'Jupiter'], category: 'General', difficulty: 0 },

  // ── More Geography ──
  { q: 'What is the smallest country in the world by area?', options: ['Vatican City', 'Monaco', 'Malta', 'San Marino'], category: 'Geography', difficulty: 2 },
  { q: 'Which US state is the largest by area?', options: ['Alaska', 'Texas', 'California', 'Montana'], category: 'Geography', difficulty: 1 },
  { q: 'The Eiffel Tower is in which city?', options: ['Paris', 'Rome', 'London', 'Berlin'], category: 'Geography', difficulty: 0 },

  // ── More Science ──
  { q: 'What is H2O more commonly known as?', options: ['Water', 'Salt', 'Hydrogen', 'Oxygen'], category: 'Science', difficulty: 0 },
  { q: 'Which blood type is the universal donor?', options: ['O negative', 'AB positive', 'A positive', 'B negative'], category: 'Science', difficulty: 2 },
  { q: 'What force pulls objects toward the Earth?', options: ['Gravity', 'Magnetism', 'Friction', 'Inertia'], category: 'Science', difficulty: 0 },

  // ── More History ──
  { q: 'Who developed the theory of relativity?', options: ['Albert Einstein', 'Isaac Newton', 'Galileo', 'Nikola Tesla'], category: 'History', difficulty: 1 },
  { q: 'Which empire was ruled by Julius Caesar?', options: ['Roman', 'Greek', 'Ottoman', 'Persian'], category: 'History', difficulty: 1 },

  // ── More Entertainment ──
  { q: 'What is the highest-grossing film franchise featuring superheroes from Marvel?', options: ['The Avengers', 'Justice League', 'X-Men', 'The Incredibles'], category: 'Entertainment', difficulty: 1 },
  { q: 'In Frozen, what is the name of the snowman?', options: ['Olaf', 'Sven', 'Kristoff', 'Hans'], category: 'Entertainment', difficulty: 0 },

  // ── More General ──
  { q: 'How many colors are there in a rainbow?', options: ['7', '6', '5', '8'], category: 'General', difficulty: 0 },
  { q: 'What is the currency used in Japan?', options: ['Yen', 'Won', 'Yuan', 'Ringgit'], category: 'General', difficulty: 1 },
  { q: 'Which is the tallest land animal?', options: ['Giraffe', 'Elephant', 'Horse', 'Camel'], category: 'General', difficulty: 0 },

  // ── A few season-tagged (schema demo; surfaced by seasonal logic later) ──
  { q: 'In the song, how many days of Christmas are there?', options: ['12', '10', '7', '24'], category: 'Entertainment', difficulty: 0, season: 'christmas' },
  { q: 'What do people traditionally carve at Halloween?', options: ['Pumpkins', 'Apples', 'Melons', 'Potatoes'], category: 'General', difficulty: 0, season: 'halloween' },
  { q: 'Which holiday is associated with hearts and the colour red on Feb 14?', options: ["Valentine’s Day", 'Easter', 'Halloween', 'New Year'], category: 'General', difficulty: 0, season: 'valentines' },
];

// ── Shared daily epoch (same as Huddle) ───────────────────────────────────────
const EPOCH = Date.UTC(2026, 5, 1); // 2026-06-01 = day 1

export function getDayNumber(now = new Date()) {
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((todayUTC - EPOCH) / 86400000) + 1;
}

export const QUESTIONS_PER_DAY = 10;

// Merge the hand-curated bank with the bulk-seeded Open Trivia DB set (deduped
// by question text; curated wins). This is the live daily pool — top it up any
// time by re-running scripts/seed-trivia.mjs (see TRIVIA_GAME_VISION.md).
export const POOL = (() => {
  const seen = new Set();
  const merged = [];
  for (const q of [...QUESTIONS, ...((GENERATED && GENERATED.questions) || [])]) {
    const key = (q.q || '').trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(q);
  }
  return merged;
})();

export const questionCount = () => POOL.length;
export const ATTRIBUTION = (GENERATED && GENERATED.attribution) || '';

// How many questions exist for a set of category labels (for topic pages).
export function categoryCount(categories) {
  const set = new Set(categories);
  return POOL.filter((q) => set.has(q.category)).length;
}

// A replayable quiz of up to n questions from the given categories, options
// shuffled. Used by the programmatic topic-trivia pages (e.g. Music Trivia).
export function getQuestionsByCategory(categories, n = 10) {
  const set = new Set(categories);
  const a = POOL.filter((q) => set.has(q.category));
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, Math.min(n, a.length)).map((item) => {
    const order = [0, 1, 2, 3];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    return { q: item.q, options: order.map((k) => item.options[k]), answerIndex: order.indexOf(0), category: item.category };
  });
}

// mulberry32 seeded PRNG
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  const rand = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sliding window over the pool so every question is used before any repeats;
// the pool is re-shuffled with a fresh seed each full cycle, so even after the
// whole bank is exhausted the daily sequence never exactly repeats.
export function getDailyQuestions(dayNumber) {
  const n = POOL.length;
  const offset = (dayNumber - 1) * QUESTIONS_PER_DAY;
  const cycle = Math.floor(offset / n);
  const order = seededShuffle(POOL, cycle + 1);
  const start = ((offset % n) + n) % n;
  const picked = [];
  for (let i = 0; i < QUESTIONS_PER_DAY; i++) picked.push(order[(start + i) % n]);

  return picked.map((item, idx) => {
    const order = seededShuffle(item.options.map((_, i) => i), dayNumber * 1000 + idx);
    const options = order.map((i) => item.options[i]);
    const answerIndex = order.indexOf(0); // correct answer was authored at index 0
    return { q: item.q, options, answerIndex, category: item.category };
  });
}
