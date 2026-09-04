/*
  When a tap is a reaction, and when it is not.

  Split out of the React hook so it can be tested without a browser, and it is
  an .mjs on purpose: node treats that as ESM regardless of the frontend's
  package.json, so backend/scripts/reaction-rules-check.js can import this exact
  code rather than a copy of it. A guard that is re-implemented in its own test
  proves only that the copy agrees with itself.

  ── The report ──────────────────────────────────────────────────────────────
  Sep 2026, from a player: she kept tapping through the "wait", and the instant
  the pad went green she was shown times like 20ms. Tapping DURING the wait was
  already caught and voided. What was not caught is a tap already travelling
  when the pad turned green: the browser queues the click at T, the hold timer
  fires at T+2ms and marks the start, the queued click is delivered at T+20, and
  the game reports an 18ms reaction. She never saw the colour change. The
  stopwatch was timing the gap between two unrelated events.

  It never showed up in the data because the stored score is an average of five
  rounds — the production minimum is a perfectly ordinary 226ms. The damage was
  entirely on screen, and entirely to whether the player believes the number.
  Somebody who is shown 20ms knows the game is nonsense, and tells a friend.

  ── The two rules ───────────────────────────────────────────────────────────
  MIN_HUMAN_MS — light has to reach the retina, cross the visual cortex and come
  back out through a finger. The fastest measured human visual reactions are
  around 120ms, and athletics rules a start under 100ms a false start for
  exactly this reason. Below this, nothing was reacted to.

  ALREADY_TAPPING_MS — the one that actually catches her. A single tap landing
  130ms after the signal clears the floor and is still not a reaction if the
  person was mid-stream at eight taps a second. A tap arriving hard on the heels
  of the previous one, across the green transition, was in flight before there
  was anything to react to.

  Both VOID the round rather than scoring it. A game that quietly awards an
  impossible number teaches the player that the number means nothing.
*/

export const MIN_HUMAN_MS = 100;
export const ALREADY_TAPPING_MS = 400;

/**
 * @param {number} ms            time from the green signal to this tap
 * @param {number} sincePrevTap  time from the previous tap to this one
 * @returns {'score'|'tooFast'|'drumming'}
 */
export function classifyTap(ms, sincePrevTap) {
  if (!Number.isFinite(ms) || ms < MIN_HUMAN_MS) return 'tooFast';
  if (Number.isFinite(sincePrevTap) && sincePrevTap < ALREADY_TAPPING_MS) return 'drumming';
  return 'score';
}
