#!/usr/bin/env node
/**
 * Generates every graphic Google Play's store listing needs.
 *
 *   node scripts/play-assets.js
 *
 * Outputs to assets/play/:
 *   play-icon-512.png          512x512, 32-bit, NO transparency (Play rejects alpha)
 *   feature-graphic-1024x500.png
 *   screenshot-*.png           1080x1920 phone screenshots of the real app
 *
 * Screenshots are captured from the bundle that ships inside the APK, served
 * locally — so they show exactly what a user gets, not a mockup. Play requires
 * 2-8 phone screenshots; this produces six.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { cow, PALETTE, COW_BOX } = require('./brand-assets');

const ROOT = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets', 'public');
const OUT = path.join(__dirname, '..', 'assets', 'play');
const PORT = 4178;

// Marketing screens, chosen to answer "what is this?" in the first two shots.
const SHOTS = [
  ['home', '/', 'Free party games'],
  ['all-games', '/all-games', '40+ games'],
  ['daily', '/daily', 'A new puzzle daily'],
  ['solo', '/solo-games', 'Play on your own'],
  ['scattergories', '/scattergories', 'Play with friends'],
  ['taboo', '/taboo', 'Team games'],
];

const launch = async () => {
  const puppeteer = require('puppeteer');
  return puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
};

/** Play store icon: square, opaque, art comfortably inside the frame. */
function iconSvg(size) {
  const scale = (size * 0.62) / COW_BOX;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs><radialGradient id="g" cx="50%" cy="36%" r="78%">
      <stop offset="0%" stop-color="${PALETTE.greenLight}"/>
      <stop offset="100%" stop-color="${PALETTE.greenDeep}"/>
    </radialGradient></defs>
    <rect width="${size}" height="${size}" fill="url(#g)"/>
    ${cow(size / 2, size / 2, scale)}
  </svg>`;
}

/**
 * Feature graphic. Shown at the top of the listing and in promo slots, often
 * with the app icon overlaid on the left third — so the artwork sits left of
 * centre and the text stays clear of where that badge lands.
 */
/**
 * Feature graphic, built from the site's OWN visual language rather than a
 * generic template.
 *
 * The first version had a flat coloured bar across the top and a gradient
 * panel — the visual equivalent of a stock slide, and it read as
 * machine-generated. This one reuses the actual elements a visitor already
 * sees on herdgamesonline.com: the meadow background gradient (sky blue
 * top-left, warm sun top-right, over cream), the faint cow-spot pattern, the
 * drifting clouds from MeadowLayout, and the hand-drawn grass strip. The cow
 * stands in the grass rather than floating in a box.
 *
 * Kept in sync by eye with MeadowLayout.js and its GrassStrip export.
 */
function featureSvg(w = 1024, h = 500) {
  // NOTE: do not put "No ads" in this graphic. Ads are planned, and a baked
  // image is the thing everyone forgets to update — a listing asset claiming
  // something untrue is a policy problem. There is also no upside: Play indexes
  // the TEXT of a listing, not its images, so the keyword value of "no ads"
  // only ever existed in the description. "No signup" stays true regardless.
  const cowScale = (h * 0.56) / COW_BOX;
  const textX = w * 0.485;
  const grassTop = h - 46;
  // Sit the cow ABOVE the grass with a clear gap. Placing it "standing in" the
  // grass buried its muzzle and pushed the bottom past the canvas edge — the
  // mark is a disembodied head, so it has to float in the scene, not stand in
  // it. ART_RADIUS is ~349 of the 512 box (a horn tip); half-height in canvas
  // units is that times the scale.
  const cowRadius = 349 * cowScale;
  const cowCy = grassTop - 26 - cowRadius;

  // The grass path is lifted verbatim from GrassStrip in MeadowLayout.js so the
  // silhouette matches the site exactly.
  const GRASS = 'M0 24 L0 16 Q5 6 10 16 Q15 4 20 16 Q25 8 30 16 Q35 2 40 16 Q45 8 50 16 Q55 6 60 16 Q65 4 70 16 Q75 8 80 16 Q85 2 90 16 Q95 8 100 16 Q105 6 110 16 Q115 4 120 16 Q125 8 130 16 Q135 2 140 16 Q145 8 150 16 Q155 6 160 16 Q165 4 170 16 Q175 8 180 16 Q185 2 190 16 Q195 8 200 16 Q205 6 210 16 Q215 4 220 16 Q225 8 230 16 Q235 2 240 16 Q245 8 250 16 Q255 6 260 16 Q265 4 270 16 Q275 8 280 16 Q285 2 290 16 Q295 8 300 16 Q305 6 310 16 Q315 4 320 16 Q325 8 330 16 Q335 2 340 16 Q345 8 350 16 Q355 6 360 16 Q365 4 370 16 Q375 8 380 16 Q385 2 390 16 Q395 8 400 16 L400 24 Z';

  const cloud = (x, y, s, o) =>
    `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}">
       <ellipse cx="25" cy="32" rx="18" ry="14" fill="#FFFFFF"/>
       <ellipse cx="50" cy="26" rx="22" ry="18" fill="#FFFFFF"/>
       <ellipse cx="75" cy="32" rx="18" ry="14" fill="#FFFFFF"/>
     </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <radialGradient id="sky" cx="12%" cy="18%" r="46%">
        <stop offset="0%" stop-color="#BEE3F8"/><stop offset="100%" stop-color="#BEE3F8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="sun" cx="88%" cy="10%" r="42%">
        <stop offset="0%" stop-color="#FFD56B"/><stop offset="100%" stop-color="#FFD56B" stop-opacity="0"/>
      </radialGradient>
      <pattern id="spots" width="180" height="120" patternUnits="userSpaceOnUse">
        <ellipse cx="20" cy="30" rx="18" ry="12" fill="#2D1810" opacity="0.035"/>
        <ellipse cx="90" cy="80" rx="24" ry="16" fill="#2D1810" opacity="0.035"/>
        <ellipse cx="150" cy="40" rx="14" ry="10" fill="#2D1810" opacity="0.035"/>
      </pattern>
    </defs>

    <rect width="${w}" height="${h}" fill="#FFF8E7"/>
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    <rect width="${w}" height="${h}" fill="url(#sun)"/>
    <rect width="${w}" height="${h}" fill="url(#spots)"/>

    ${cloud(70, 40, 1.15, 0.9)}
    ${cloud(600, 22, 0.85, 0.75)}
    ${cloud(840, 92, 0.7, 0.6)}

    <!-- grass first, so the cow's hooves sit in front of it -->
    <svg x="0" y="${grassTop}" width="${w}" height="46" viewBox="0 0 400 24" preserveAspectRatio="none">
      <path d="${GRASS}" fill="${PALETTE.green}"/>
    </svg>

    ${cow(w * 0.235, cowCy, cowScale)}

    <text x="${textX}" y="${h * 0.40}" font-family="Fredoka, 'Trebuchet MS', sans-serif"
          font-weight="600" font-size="66" fill="${PALETTE.ink}">Herd <tspan fill="${PALETTE.green}">Games</tspan></text>
    <text x="${textX}" y="${h * 0.555}" font-family="Quicksand, system-ui, sans-serif"
          font-weight="600" font-size="30" fill="#4A2D1B">Party, trivia &amp; word games</text>
    <text x="${textX}" y="${h * 0.665}" font-family="Quicksand, system-ui, sans-serif"
          font-weight="500" font-size="25" fill="#6B4226">Play with friends &#183; Free &#183; No signup</text>
  </svg>`;
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const clean = decodeURIComponent((req.url || '/').split('?')[0]);
      let file = path.normalize(path.join(ROOT, clean));
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        const idx = path.join(file, 'index.html');
        file = fs.existsSync(idx) ? idx : path.join(ROOT, 'index.html');
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function render(page, svg, w, h, out) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8">
     <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
     <style>html,body{margin:0;padding:0}svg{display:block}</style></head><body>${svg}</body></html>`,
    { waitUntil: 'load', timeout: 60000 }
  );
  await page.evaluate(async () => {
    try {
      await Promise.all([document.fonts.load('600 76px Fredoka'), document.fonts.load('600 34px Quicksand')]);
      await document.fonts.ready;
    } catch { /* fallback face is acceptable */ }
  });
  // omitBackground false => opaque PNG. Play rejects icons with an alpha channel.
  await page.screenshot({ path: out, type: 'png', omitBackground: false });
  console.log(`  ${path.basename(out)}  ${w}x${h}`);
}

(async () => {
  if (!fs.existsSync(ROOT)) {
    console.error('No synced app bundle. Run "npm run cap:sync" first.');
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  const server = await serve();
  const browser = await launch();
  const page = await browser.newPage();

  console.log('graphics:');
  await render(page, iconSvg(512), 512, 512, path.join(OUT, 'play-icon-512.png'));
  await render(page, featureSvg(), 1024, 500, path.join(OUT, 'feature-graphic-1024x500.png'));

  console.log('screenshots (1080x1920, from the shipped bundle):');
  // 360 CSS px at 3x = a 1080x1920 image that is actually laid out as a PHONE.
  // Setting the viewport to 1080 wide instead produced the DESKTOP layout at
  // phone dimensions — horizontal nav, four-column grids — which is not what a
  // Play Store visitor would ever see.
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  for (const [name, route] of SHOTS) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1400)); // let entry animations settle
      const out = path.join(OUT, `screenshot-${name}.png`);
      await page.screenshot({ path: out, type: 'png' });
      console.log(`  screenshot-${name}.png  ${route}`);
    } catch (e) {
      console.log(`  SKIPPED ${name}: ${e.message.slice(0, 60)}`);
    }
  }

  // ── Tablet screenshots (Play marks both sizes required) ──────────────────
  // Constraints from the console: 16:9 or 9:16 exactly; 7-inch sides 320-3840px,
  // 10-inch sides 1080-7680px.
  //
  // Rendered at genuine tablet CSS widths rather than upscaled phone shots. The
  // 10-inch is landscape at 1280 CSS px, which crosses Tailwind's `md`
  // breakpoint — so it shows the multi-column layout a tablet user actually
  // gets, instead of a stretched single column.
  const TABLETS = [
    { label: '7in',  css: { width: 720, height: 1280 }, dsf: 1.5 }, // -> 1080x1920 (9:16)
    { label: '10in', css: { width: 1280, height: 720 }, dsf: 1.5 }, // -> 1920x1080 (16:9)
  ];
  console.log('tablet screenshots:');
  for (const t of TABLETS) {
    await page.setViewport({ ...t.css, deviceScaleFactor: t.dsf, isMobile: false });
    for (const [name, route] of SHOTS.slice(0, 4)) {
      try {
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise((r) => setTimeout(r, 1400));
        const out = path.join(OUT, `tablet-${t.label}-${name}.png`);
        await page.screenshot({ path: out, type: 'png' });
        console.log(`  tablet-${t.label}-${name}.png  ${t.css.width * t.dsf}x${t.css.height * t.dsf}`);
      } catch (e) {
        console.log(`  SKIPPED ${t.label}/${name}: ${e.message.slice(0, 50)}`);
      }
    }
  }

  await browser.close();
  server.close();
  console.log(`\nDone -> ${OUT}`);
})().catch((e) => { console.error(e); process.exit(1); });
