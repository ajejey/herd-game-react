/**
 * Traces logo512.png (the Twemoji cow) into SVG paths, one per flat colour
 * region, so the app icon is a real copy of the emoji rather than a redraw.
 * Built on the flood-fill that the diagnostics proved correct.
 */
const FRONTEND = 'F:/Web Dev Projects/herdmentality/herd-mentality-react-node/frontend';
const puppeteer = require(FRONTEND + '/node_modules/puppeteer');
const fs = require('fs');

const PALETTE = [
  { name: 'muzzle',  hex: '#E1AEAE', rgb: [225, 174, 174] },
  { name: 'head',    hex: '#CCD6DD', rgb: [204, 214, 221] },
  { name: 'ear',     hex: '#9AAAB4', rgb: [154, 170, 180] },
  { name: 'horn',    hex: '#FFE8B6', rgb: [255, 232, 182] },
  { name: 'eye',     hex: '#292F33', rgb: [41, 47, 51] },
  { name: 'nostril', hex: '#C1694F', rgb: [193, 105, 79] },
];
const DRAW_ORDER = ['horn', 'ear', 'head', 'muzzle', 'eye', 'nostril'];

(async () => {
  const b64 = fs.readFileSync(FRONTEND + '/public/logo512.png').toString('base64');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', (m) => console.log('[page]', m.text()));
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));

  const parts = await page.evaluate(async (data, palette, order) => {
    const S = 1024;
    const img = new Image();
    img.src = 'data:image/png;base64,' + data;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, S, S);
    const d = ctx.getImageData(0, 0, S, S).data;

    const masks = {};
    palette.forEach((p) => { masks[p.name] = new Uint8Array(S * S); });
    for (let i = 0; i < S * S; i++) {
      if (d[i * 4 + 3] < 128) continue;
      const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      let best = null, bd = Infinity;
      for (const p of palette) {
        const dd = (p.rgb[0] - r) ** 2 + (p.rgb[1] - g) ** 2 + (p.rgb[2] - b) ** 2;
        if (dd < bd) { bd = dd; best = p.name; }
      }
      masks[best][i] = 1;
    }

    function rdp(pts, eps) {
      if (pts.length < 3) return pts;
      const keep = new Uint8Array(pts.length);
      keep[0] = 1; keep[pts.length - 1] = 1;
      const stack = [[0, pts.length - 1]];
      while (stack.length) {
        const seg = stack.pop();
        const s = seg[0], e = seg[1];
        if (e - s < 2) continue;
        const ax = pts[s][0], ay = pts[s][1];
        const vx = pts[e][0] - ax, vy = pts[e][1] - ay;
        const len = Math.hypot(vx, vy) || 1;
        let maxD = -1, idx = -1;
        for (let i = s + 1; i < e; i++) {
          const dist = Math.abs((pts[i][0] - ax) * vy - (pts[i][1] - ay) * vx) / len;
          if (dist > maxD) { maxD = dist; idx = i; }
        }
        if (maxD > eps && idx > 0) { keep[idx] = 1; stack.push([s, idx]); stack.push([idx, e]); }
      }
      const out = [];
      for (let i = 0; i < pts.length; i++) if (keep[i]) out.push(pts[i]);
      return out;
    }

    /**
     * RDP assumes an open polyline: it measures every vertex against the chord
     * from first to last. A traced contour is closed, so that chord has zero
     * length, every distance comes out 0, and the whole outline collapses to two
     * points. Split the loop at the vertex farthest from the start and simplify
     * the two halves as open curves.
     */
    function rdpClosed(pts, eps) {
      if (pts.length < 4) return pts;
      const a = pts[0];
      let far = 1, fd = -1;
      for (let i = 1; i < pts.length; i++) {
        const dd = (pts[i][0] - a[0]) ** 2 + (pts[i][1] - a[1]) ** 2;
        if (dd > fd) { fd = dd; far = i; }
      }
      const head = rdp(pts.slice(0, far + 1), eps);
      const tail = rdp(pts.slice(far), eps);
      return head.slice(0, -1).concat(tail);
    }

    // 8-neighbour offsets, clockwise starting north-west
    const N8 = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

    function traceComponent(cm, sx, sy) {
      const inside = (x, y) => x >= 0 && y >= 0 && x < S && y < S && cm[y * S + x] === 1;
      const contour = [[sx, sy]];
      let cx = sx, cy = sy, bx = sx - 1, by = sy;
      for (let guard = 0; guard < 3000000; guard++) {
        let di = -1;
        for (let j = 0; j < 8; j++) {
          if (N8[j][0] === bx - cx && N8[j][1] === by - cy) { di = j; break; }
        }
        if (di < 0) di = 7;
        let moved = false;
        for (let k = 1; k <= 8; k++) {
          const cur = N8[(di + k) % 8];
          const nx = cx + cur[0], ny = cy + cur[1];
          if (inside(nx, ny)) {
            const prev = N8[(di + k - 1 + 8) % 8];
            bx = cx + prev[0]; by = cy + prev[1];
            cx = nx; cy = ny;
            contour.push([cx, cy]);
            moved = true;
            break;
          }
        }
        if (!moved) break;
        if (cx === sx && cy === sy) break;
      }
      return contour;
    }

    const out = [];
    for (const name of order) {
      const m = masks[name];
      const seen = new Uint8Array(S * S);
      const ds = [];
      let regions = 0, traced = 0;

      for (let i = 0; i < S * S; i++) {
        if (!m[i] || seen[i]) continue;
        const cells = [];
        const stack = [i];
        seen[i] = 1;
        while (stack.length) {
          const q = stack.pop();
          cells.push(q);
          const x = q % S, y = (q / S) | 0;
          if (x > 0     && m[q - 1] && !seen[q - 1]) { seen[q - 1] = 1; stack.push(q - 1); }
          if (x < S - 1 && m[q + 1] && !seen[q + 1]) { seen[q + 1] = 1; stack.push(q + 1); }
          if (y > 0     && m[q - S] && !seen[q - S]) { seen[q - S] = 1; stack.push(q - S); }
          if (y < S - 1 && m[q + S] && !seen[q + S]) { seen[q + S] = 1; stack.push(q + S); }
        }
        if (cells.length < 600) continue;
        regions++;

        const cm = new Uint8Array(S * S);
        for (let z = 0; z < cells.length; z++) cm[cells[z]] = 1;
        let startP = cells[0];
        for (let z = 1; z < cells.length; z++) if (cells[z] < startP) startP = cells[z];

        const contour = traceComponent(cm, startP % S, (startP / S) | 0);
        // 0.9px at the 1024 trace resolution, i.e. under half a pixel of the
        // 512px source. Looser values (2.0) left visible flat facets on the
        // muzzle and the top of the head.
        const simp = rdpClosed(contour, 0.9);
        if (simp.length < 3) { continue; }
        traced++;
        const f = (n) => Math.round((n / 2) * 100) / 100;
        ds.push('M' + simp.map((pt) => f(pt[0]) + ' ' + f(pt[1])).join('L') + 'Z');
      }

      console.log(name + ': regions=' + regions + ' traced=' + traced);
      if (ds.length) {
        out.push({ name: name, fill: palette.find((p) => p.name === name).hex, d: ds.join('') });
      }
    }
    return out;
  }, b64, PALETTE, DRAW_ORDER);

  await browser.close();

  const outPath = FRONTEND + '/scripts/cow-emoji-paths.js';
  const header =
    '/**\n' +
    ' * Traced from public/logo512.png (the Twemoji cow face). GENERATED - do not hand-edit.\n' +
    ' * One entry per flat colour region, already in painter\'s order, in a 512x512 box.\n' +
    ' */\n';
  fs.writeFileSync(outPath, header + 'module.exports = ' + JSON.stringify(parts) + ';\n', 'utf8');
  console.log('wrote ' + outPath + ' (' + parts.length + ' groups, ' + (fs.statSync(outPath).size / 1024).toFixed(1) + ' KB)');
})();
