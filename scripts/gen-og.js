/*
  Generates branded 1200x630 social share images into public/ using a headless
  browser to screenshot an HTML card. Run once (or whenever branding changes):
      node scripts/gen-og.js
  Outputs: og-image.png, twitter-image.png, og-guesstimate.png, og-say-anything.png
*/
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public');

const COW = `
<svg width="150" height="150" viewBox="0 0 64 64" aria-hidden="true">
  <ellipse cx="32" cy="36" rx="22" ry="20" fill="#FFFFFF" stroke="#2D1810" stroke-width="2.5"/>
  <ellipse cx="32" cy="44" rx="13" ry="10" fill="#FFE8C8" stroke="#2D1810" stroke-width="2"/>
  <ellipse cx="27" cy="46" rx="1.6" ry="2.1" fill="#2D1810"/>
  <ellipse cx="37" cy="46" rx="1.6" ry="2.1" fill="#2D1810"/>
  <path d="M28 51 Q32 53 36 51" stroke="#2D1810" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <ellipse cx="20" cy="28" rx="6" ry="9" fill="#FFFFFF" stroke="#2D1810" stroke-width="2" transform="rotate(-25 20 28)"/>
  <ellipse cx="44" cy="28" rx="6" ry="9" fill="#FFFFFF" stroke="#2D1810" stroke-width="2" transform="rotate(25 44 28)"/>
  <ellipse cx="22" cy="32" rx="3" ry="4" fill="#FFB6C1" transform="rotate(-25 22 32)"/>
  <ellipse cx="42" cy="32" rx="3" ry="4" fill="#FFB6C1" transform="rotate(25 42 32)"/>
  <path d="M22 18 Q18 12 14 14" stroke="#2D1810" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M42 18 Q46 12 50 14" stroke="#2D1810" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="22" cy="28" rx="3" ry="4" fill="#2D1810"/>
  <ellipse cx="44" cy="32" rx="2.5" ry="3" fill="#2D1810"/>
</svg>`;

const CARDS = [
  { file: 'og-image.png',        eyebrow: 'HERDGAME.VERCEL.APP', title: 'Herd Game', subtitle: 'Free online party games. Think like the herd to win.', pill: 'No download · No signup · Unlimited players', accent: '#3D8B5A' },
  { file: 'twitter-image.png',   eyebrow: 'HERDGAME.VERCEL.APP', title: 'Herd Game', subtitle: 'Free online party games. Think like the herd to win.', pill: 'No download · No signup · Unlimited players', accent: '#3D8B5A' },
  { file: 'og-guesstimate.png',  eyebrow: 'PLAY FREE IN YOUR BROWSER', title: 'Guesstimate', subtitle: 'Guess the answer, bet on who’s closest. Free trivia game.', pill: '2–12 players · No app · ~25 min', accent: '#E84A8B' },
  { file: 'og-say-anything.png', eyebrow: 'PLAY FREE IN YOUR BROWSER', title: 'Say Anything', subtitle: 'Guess what your friends will say. Free party game.', pill: '3–12 players · No download · Big laughs', accent: '#7C4DFF' },
  { file: 'og-daily.png',        eyebrow: 'A NEW PUZZLE EVERY DAY', title: 'Daily Herd', subtitle: 'Guess what most people will say. Match the herd.', pill: '5 questions a day · Free · No signup', accent: '#E84A8B' },
  { file: 'og-clover.png',       eyebrow: 'FREE CO-OP WORD GAME', title: 'Clover Clues', subtitle: 'Write clues, rebuild each other’s clovers, win as a team.', pill: '3–6 players · No download · Co-op', accent: '#3D8B5A' },
];

function html({ eyebrow, title, subtitle, pill, accent }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@500;600&display=swap" rel="stylesheet"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1200px;height:630px;overflow:hidden;
      font-family:'Quicksand',sans-serif;
      background:
        radial-gradient(circle at 88% 18%, ${accent}22, transparent 40%),
        radial-gradient(circle at 12% 90%, ${accent}1f, transparent 38%),
        #FFF8E7;
      position:relative}
    .bar{position:absolute;top:0;left:0;right:0;height:14px;background:${accent}}
    .wrap{position:absolute;inset:0;padding:70px 84px 170px;display:flex;flex-direction:column;justify-content:center}
    .logo{display:flex;align-items:center;gap:18px;margin-bottom:30px}
    .logo .name{font-family:'Fredoka';font-weight:700;font-size:40px;color:#2D1810}
    .logo .name span{color:${accent}}
    .eyebrow{font-weight:700;letter-spacing:3px;font-size:20px;color:${accent};margin-bottom:18px}
    h1{font-family:'Fredoka';font-weight:700;font-size:104px;line-height:1.02;color:#2D1810;margin-bottom:24px}
    p{font-size:34px;line-height:1.32;color:#4A2D1B;max-width:900px;font-weight:500}
    .pill{position:absolute;left:84px;bottom:70px;background:${accent};color:#fff;
      font-weight:600;font-size:24px;padding:14px 28px;border-radius:999px}
  </style></head>
  <body>
    <div class="bar"></div>
    <div class="wrap">
      <div class="logo">${COW}<div class="name">Herd <span>Game</span></div></div>
      <div class="eyebrow">${eyebrow}</div>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
    <div class="pill">${pill}</div>
  </body></html>`;
}

(async () => {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const card of CARDS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(html(card), { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 300)); // let webfont paint
    await page.screenshot({ path: path.join(OUT, card.file), type: 'png' });
    console.log(`  ✓ ${card.file}`);
    await page.close();
  }
  await browser.close();
  console.log(`\nGenerated ${CARDS.length} OG images into public/.`);
})();
