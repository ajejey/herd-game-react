/*
  Shared share-card generator — renders a spoiler-free result card (heading,
  big score, a grid of coloured squares, footer) to a PNG File for the Web Share
  API / download. Used by Huddle and Daily Trivia (both share coloured grids).

  Returns null on any failure so callers can fall back to text sharing.
*/
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function buildGridCard({ heading, big, sub, rows = [], footerLines = [], accent = '#3D8B5A', fileName = 'card.png' }) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }

    const S = 1080;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, '#FFF8E7');
    g.addColorStop(1, '#EFEAFB');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = accent; ctx.fillRect(0, 0, S, 18);

    ctx.textAlign = 'center';
    ctx.fillStyle = accent;
    ctx.font = '700 40px Quicksand, sans-serif';
    ctx.fillText(heading, S / 2, 130);

    ctx.fillStyle = '#2D1810';
    ctx.font = '800 150px Fredoka, sans-serif';
    ctx.fillText(String(big), S / 2, 320);

    if (sub) {
      ctx.fillStyle = '#8B6347';
      ctx.font = '500 36px Quicksand, sans-serif';
      ctx.fillText(sub, S / 2, 384);
    }

    // grid of coloured squares — sized to fit both width and height
    const maxCols = Math.max(1, ...rows.map((r) => r.length));
    const nRows = rows.length || 1;
    const gap = 14;
    const availW = 760;
    const top = 450, availH = 410;
    const cell = Math.max(
      18,
      Math.min(
        92,
        Math.floor((availW - (maxCols - 1) * gap) / maxCols),
        Math.floor((availH - (nRows - 1) * gap) / nRows)
      )
    );
    let y = top;
    for (const row of rows) {
      const rowW = row.length * cell + (row.length - 1) * gap;
      let x = (S - rowW) / 2;
      for (const color of row) {
        ctx.fillStyle = color;
        roundRect(ctx, x, y, cell, cell, 12);
        ctx.fill();
        x += cell + gap;
      }
      y += cell + gap;
    }

    if (footerLines[0]) {
      ctx.fillStyle = '#2D1810';
      ctx.font = '700 40px Fredoka, sans-serif';
      ctx.fillText(footerLines[0], S / 2, 960);
    }
    if (footerLines[1]) {
      ctx.fillStyle = accent;
      ctx.font = '600 34px Quicksand, sans-serif';
      ctx.fillText(footerLines[1], S / 2, 1012);
    }

    const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], fileName, { type: 'image/png' });
  } catch {
    return null;
  }
}

// Try native file-share, then text-share, then clipboard. Returns 'copied' if it
// fell back to clipboard (so the caller can show a "Copied!" state), else ''.
export async function shareCardOrText(file, text, title) {
  try {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text, title });
      return '';
    }
    if (navigator.share) { await navigator.share({ title, text }); return ''; }
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return '';
  }
}

export function downloadFile(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url; a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
