/**
 * Brand artwork source of truth for the Android app icons and splash screens.
 *
 * The cow is the actual Twemoji cow face from public/logo512.png, traced into
 * vector paths (scripts/cow-emoji-paths.js) rather than redrawn. An earlier
 * hand-drawn version with curved horns read as an insect, so this is a literal
 * copy of the mark people already associate with the site.
 *
 * Regenerate the paths with: node scripts/trace-emoji.js
 */
const COW_PATHS = require('./cow-emoji-paths');

// Traced art occupies a 512x512 box, centred on (256, 256).
const COW_BOX = 512;

const PALETTE = {
  // Site colours, from the live components (Navigation.js).
  green: '#3D8B5A',
  greenLight: '#5AAE78',
  greenDeep: '#2E7A50',
  cream: '#FFF8E7',
  ink: '#2D1810',
  darkBg: '#22302A',
};

/** The traced emoji, placed at (cx, cy). `scale` of 1 draws it 512px wide. */
function cow(cx, cy, scale) {
  const inner = COW_PATHS.map((p) => `<path fill="${p.fill}" d="${p.d}"/>`).join('');
  const half = COW_BOX / 2;
  return `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-half} ${-half})">${inner}</g>`;
}

function svg(size, body, extra = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${extra}${body}</svg>`;
}

const greenBackdrop = (size) => `
  <defs>
    <radialGradient id="bg" cx="50%" cy="36%" r="78%">
      <stop offset="0%" stop-color="${PALETTE.greenLight}"/>
      <stop offset="100%" stop-color="${PALETTE.greenDeep}"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>`;

/**
 * Furthest point of the artwork from the centre of its 512 box, measured from
 * the traced geometry.
 *
 * Do not eyeball this. The first attempt estimated it from the art's top/bottom/
 * left/right extremes and got ~263, but the emoji's real extremes are diagonal —
 * the outer corner of a horn is ~349 — and the resulting icon had its horn tips
 * and muzzle corners sliced off by the circular launcher mask.
 */
function artMaxRadius() {
  let max = 0;
  for (const part of COW_PATHS) {
    const nums = part.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const r = Math.hypot(nums[i] - COW_BOX / 2, nums[i + 1] - COW_BOX / 2);
      if (r > max) max = r;
    }
  }
  return max;
}
const ART_RADIUS = artMaxRadius();

// Android adaptive icons: the canvas is 108dp but only the centre 66dp survives
// every launcher mask. On a 1024px canvas that is a radius of 1024*(66/108)/2.
const SAFE_RADIUS_1024 = (1024 * (66 / 108)) / 2;      // ~313px
const ADAPTIVE_SCALE = SAFE_RADIUS_1024 / ART_RADIUS;   // ~0.90

// The square legacy/store icon is not inset the way an adaptive foreground is,
// but the same file feeds ic_launcher_round, which IS circle-masked against the
// full canvas. Keep the art inside ~0.84 of the radius so that stays clean while
// the Play listing icon still looks confident rather than lost in padding.
const SQUARE_SCALE = (512 * 0.84) / ART_RADIUS;         // ~1.23

/**
 * Notification status-bar icon.
 *
 * Android ignores the colours of a status-bar icon and uses only its alpha
 * channel — anything with colour renders as a solid grey blob. So this is a
 * pure white silhouette, with the eyes and nostrils punched out through a mask
 * so the cow is still readable at 24dp instead of being an amorphous lump.
 */
function notificationIcon(size) {
  const isHole = (p) => p.name === 'eye' || p.name === 'nostril';
  const solid = COW_PATHS.filter((p) => !isHole(p));
  const holes = COW_PATHS.filter(isHole);
  // Fill ~90% of the canvas; Android adds its own padding around the result.
  const scale = (size * 0.9) / (ART_RADIUS * 2);
  const place = (paths, fill) =>
    `<g transform="translate(${size / 2} ${size / 2}) scale(${scale}) translate(${-COW_BOX / 2} ${-COW_BOX / 2})">` +
    paths.map((p) => `<path fill="${fill}" d="${p.d}"/>`).join('') +
    '</g>';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="black"/>
      ${place(solid, '#FFFFFF')}
      ${place(holes, '#000000')}
    </mask>
    <rect width="${size}" height="${size}" fill="#FFFFFF" mask="url(#cut)"/>
  </svg>`;
}

const assets = {
  'icon-foreground': (size) => svg(size, cow(size / 2, size / 2, (size / 1024) * ADAPTIVE_SCALE)),
  'icon-background': (size) => svg(size, '', greenBackdrop(size)),
  icon: (size) => svg(size, cow(size / 2, size / 2, (size / 1024) * SQUARE_SCALE), greenBackdrop(size)),
  splash: (size) => splashSvg(size, PALETTE.cream, PALETTE.ink, PALETTE.green),
  'splash-dark': (size) => splashSvg(size, PALETTE.darkBg, PALETTE.cream, PALETTE.greenLight),
};

/**
 * Android shows the splash with CENTER_CROP, and the source is square while
 * phones are not. On a 1080x2400 screen the image is scaled until its HEIGHT
 * covers, so only the middle 1080/(2400/2732) ~= 1230px of its width is ever on
 * screen — 45% of the canvas. Anything wider than ~1200px centred loses its
 * edges. The wordmark is pinned with textLength so it cannot drift past that
 * regardless of how the webfont metrics resolve.
 */
const SPLASH_SAFE_WIDTH = 1200;
const WORDMARK_WIDTH = 880;

function splashSvg(size, bg, textColor, accent) {
  const s = size / 2732;
  const cy = size / 2 - 170 * s;
  const wordY = size / 2 + 500 * s;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bg}"/>
    ${cow(size / 2, cy, (s * SPLASH_SAFE_WIDTH) / 2 / ART_RADIUS)}
    <text x="${size / 2}" y="${wordY}" text-anchor="middle"
          font-family="Fredoka, 'Trebuchet MS', system-ui, sans-serif"
          font-weight="600" font-size="${165 * s}" fill="${textColor}"
          textLength="${Math.min(WORDMARK_WIDTH, SPLASH_SAFE_WIDTH) * s}" lengthAdjust="spacingAndGlyphs">Herd Games</text>
    <text x="${size / 2}" y="${wordY + 130 * s}" text-anchor="middle"
          font-family="Quicksand, system-ui, sans-serif"
          font-weight="600" font-size="${74 * s}" fill="${accent}">Think like the herd</text>
  </svg>`;
}

module.exports = {
  PALETTE, assets, cow, notificationIcon,
  ADAPTIVE_SCALE, SQUARE_SCALE, COW_BOX, ART_RADIUS,
};
