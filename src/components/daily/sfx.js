/*
  Tiny procedural sound effects via the Web Audio API — no audio files, no
  licensing, works offline. Muteable (preference saved to localStorage).

  All sounds are short, soft, and only ever triggered by a user action, so they
  respect browser autoplay rules. Call setMuted(true) to silence.
*/

const MUTE_KEY = 'dh_muted';
let ctx = null;
let muted = (() => {
  try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
})();

export function isMuted() {
  return muted;
}

export function setMuted(v) {
  muted = !!v;
  try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* ignore */ }
}

function getCtx() {
  if (muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// One soft note with an attack/decay envelope.
function note(freq, start, dur, { type = 'sine', gain = 0.13 } = {}) {
  const ac = getCtx();
  if (!ac) return;
  try {
    const t = ac.currentTime + start;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch { /* never throw from sfx */ }
}

export const sfx = {
  click() { note(523.25, 0, 0.08, { type: 'triangle', gain: 0.08 }); },
  next()  { note(659.25, 0, 0.09, { type: 'triangle', gain: 0.08 }); },
  // warm two-note "you matched the herd"
  match() { note(523.25, 0, 0.18, { type: 'sine', gain: 0.14 }); note(659.25, 0.1, 0.22, { type: 'sine', gain: 0.14 }); },
  // gentle descending "lone wolf"
  miss()  { note(392.0, 0, 0.18, { type: 'sine', gain: 0.1 }); note(311.13, 0.12, 0.26, { type: 'sine', gain: 0.1 }); },
  // little celebratory arpeggio for a strong score
  win()   { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, i * 0.09, 0.3, { type: 'triangle', gain: 0.12 })); },
};
