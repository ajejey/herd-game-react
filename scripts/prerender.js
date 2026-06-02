/*
  Post-build prerender step.

  CRA ships a client-rendered SPA: the raw HTML is an empty <div id="root"> with
  one shared <title>, so Google sees identical empty pages and defers indexing.

  This script serves the production build locally, loads each SEO route in a
  headless browser, lets React + react-helmet render the real DOM (title, meta,
  H1, body copy, JSON-LD), and writes that HTML back as build/<route>/index.html.
  index.js then hydrates the snapshot at runtime.

  Dynamic routes (game rooms) are intentionally NOT prerendered — they fall back
  to the pristine shell (build/200.html) and render client-side.
*/
const http = require('http');
const fs = require('fs');
const path = require('path');

// Launch a headless browser that works in BOTH places:
//  - Local dev (Windows/Mac): full `puppeteer` with its bundled Chromium.
//  - Vercel/CI (Linux): `puppeteer-core` + `@sparticuz/chromium`, a self-contained
//    Chromium that ships the shared libs (libnspr4 etc.) the build image lacks.
async function launchBrowser() {
  if (process.platform === 'linux') {
    const chromium = require('@sparticuz/chromium');
    const puppeteerCore = require('puppeteer-core');
    return puppeteerCore.launch({
      args: [...chromium.args, '--disable-dev-shm-usage'],
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const puppeteer = require('puppeteer');
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

const BUILD_DIR = path.join(__dirname, '..', 'build');
const PORT = 47284;
const ORIGIN = `http://127.0.0.1:${PORT}`;

const pkg = require(path.join(__dirname, '..', 'package.json'));
const routes = (pkg.prerender && pkg.prerender.routes) || ['/'];

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json',
  '.webp': 'image/webp',
};

function outPathFor(route) {
  if (route === '/' || route === '') return path.join(BUILD_DIR, 'index.html');
  return path.join(BUILD_DIR, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

(async () => {
  if (!fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
    console.error('prerender: build/index.html not found — run the build first.');
    process.exit(1);
  }

  // Pristine shell, captured BEFORE any route overwrites build/index.html.
  const shellHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(BUILD_DIR, '200.html'), shellHtml); // Vercel dynamic-route fallback

  // Static server: serve real asset files; every route path gets the pristine
  // shell so the client router renders the correct page during snapshotting.
  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const ext = path.extname(urlPath).toLowerCase();
      const filePath = path.join(BUILD_DIR, urlPath);
      if (ext && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(shellHtml);
      }
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
  await new Promise(r => server.listen(PORT, r));

  let browser;
  try {
    browser = await launchBrowser();
  } catch (e) {
    // Chromium unavailable (e.g. on a CI image without it). Don't break the
    // deploy — ship the normal client-rendered SPA exactly as before.
    console.warn(`\nprerender: SKIPPED — could not launch headless browser (${e.message}).`);
    console.warn('prerender: shipping the standard client-rendered build instead.\n');
    await new Promise(r => server.close(r));
    process.exit(0);
  }

  let ok = 0, fail = 0;
  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.setRequestInterception(true);
      page.on('request', (r) => {
        const u = r.url();
        // Block all third-party (ad scripts, websockets, web fonts) for fast,
        // deterministic snapshots — only our local origin is allowed.
        if (u.startsWith(ORIGIN) || u.startsWith('data:') || u.startsWith('about:')) r.continue();
        else r.abort();
      });
      page.on('pageerror', () => {}); // ignore in-page runtime errors (e.g. ad lib)

      await page.goto(ORIGIN + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          return root && root.children.length > 0 && document.title && document.title.length > 0;
        },
        { timeout: 20000 }
      );
      await new Promise(r => setTimeout(r, 400)); // let helmet/meta settle

      const html = await page.content();
      const out = outPathFor(route);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, html);

      const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [, ''])[1];
      const hasH1 = /<h1[\s>]/i.test(html);
      const hasLd = html.includes('application/ld+json');
      console.log(`  ✓ ${route}  [${(html.length / 1024).toFixed(0)}kb] h1:${hasH1 ? 'y' : 'n'} ld:${hasLd ? 'y' : 'n'} title:"${title.slice(0, 60)}"`);
      ok++;
    } catch (e) {
      console.log(`  ✗ ${route}  -> ${e.message}`);
      fail++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await new Promise(r => server.close(r));
  console.log(`\nprerender: ${ok} ok, ${fail} failed of ${routes.length} routes.`);
  // Never hard-fail the deploy over prerendering — a route that didn't snapshot
  // still serves the SPA shell via the 200.html fallback.
  process.exit(0);
})();
