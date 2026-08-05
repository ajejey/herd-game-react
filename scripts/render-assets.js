/**
 * Rasterises the brand SVGs in scripts/brand-assets.js into the PNG sources that
 * @capacitor/assets expects, then you run:
 *
 *   npx @capacitor/assets generate --android
 *
 * Rendering goes through headless Chrome (already a devDependency for the
 * prerender step) rather than a raster library, so the SVG is drawn by the same
 * engine that will draw it on the phone, and webfonts actually load.
 *
 * Usage: node scripts/render-assets.js
 */
const fs = require('fs');
const path = require('path');
const { assets, notificationIcon } = require('./brand-assets');

// Mirrors scripts/prerender.js so this works on Windows locally and Linux in CI.
async function launchBrowser() {
  if (process.platform === 'linux') {
    const mod = require('@sparticuz/chromium');
    const chromium = mod && mod.default ? mod.default : mod;
    const puppeteerCore = require('puppeteer-core');
    return puppeteerCore.launch({
      args: [...(chromium.args || []), '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless != null ? chromium.headless : true,
    });
  }
  const puppeteer = require('puppeteer');
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

// name -> [size, transparent]. @capacitor/assets reads these exact filenames.
const TARGETS = [
  ['icon', 1024, false],
  ['icon-foreground', 1024, true],
  ['icon-background', 1024, false],
  ['splash', 2732, false],
  ['splash-dark', 2732, false],
];

const OUT_DIR = path.join(__dirname, '..', 'assets');
const SVG_DIR = path.join(__dirname, '..', 'assets', 'svg');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(SVG_DIR, { recursive: true });

  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });

  for (const [name, size, transparent] of TARGETS) {
    const markup = assets[name](size);

    // Keep the vector next to the PNG so the artwork stays editable.
    fs.writeFileSync(path.join(SVG_DIR, `${name}.svg`), markup);

    const needsFont = markup.includes('<text');
    const html = `<!doctype html><html><head><meta charset="utf-8">
      ${needsFont ? '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">' : ''}
      <style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>
      </head><body>${markup}</body></html>`;

    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    // 'networkidle0' hangs here: Google Fonts keeps a connection warm, so the
    // idle condition never fires even though the CSS and woff2 have landed.
    // Wait on the font faces themselves instead — that is the actual dependency.
    await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
    if (needsFont) {
      // Without this the splash renders in the fallback face and the wordmark
      // looks nothing like the site.
      await page.evaluate(async () => {
        await Promise.all([
          document.fonts.load("600 100px Fredoka"),
          document.fonts.load("600 100px Quicksand"),
        ]);
        await document.fonts.ready;
      });
    }

    const out = path.join(OUT_DIR, `${name}.png`);
    await page.screenshot({ path: out, omitBackground: transparent, type: 'png' });
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`  ${name}.png  ${size}x${size}  ${kb}KB${transparent ? '  (transparent)' : ''}`);
  }

  // Status-bar notification icon. @capacitor/assets does not generate these, so
  // write them straight into the Android res tree at the standard densities.
  // Without ic_stat_herd every notification shows a featureless grey square.
  const NOTIF_DENSITIES = [
    ['mdpi', 24], ['hdpi', 36], ['xhdpi', 48], ['xxhdpi', 72], ['xxxhdpi', 96],
  ];
  const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
  if (fs.existsSync(resDir)) {
    fs.writeFileSync(path.join(SVG_DIR, 'ic_stat_herd.svg'), notificationIcon(96));
    for (const [density, px] of NOTIF_DENSITIES) {
      const dir = path.join(resDir, `drawable-${density}`);
      fs.mkdirSync(dir, { recursive: true });
      await page.setViewport({ width: px, height: px, deviceScaleFactor: 1 });
      await page.setContent(
        `<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block}</style></head><body>${notificationIcon(px)}</body></html>`,
        { waitUntil: 'load' }
      );
      await page.screenshot({ path: path.join(dir, 'ic_stat_herd.png'), omitBackground: true, type: 'png' });
    }
    console.log(`  ic_stat_herd.png  ${NOTIF_DENSITIES.length} densities -> android res/`);
  } else {
    console.log('  (android/ not present — skipped notification icon)');
  }

  await browser.close();
  console.log(`\nWrote ${TARGETS.length} PNGs to assets/ and editable SVGs to assets/svg/`);
  console.log('Next: npx @capacitor/assets generate --android');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
