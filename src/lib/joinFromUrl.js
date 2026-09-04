import { sanitizeCodeInput } from './packCode';

/*
  A room code carried in the URL: /clover?join=HRAL

  Why this exists. Search logging for Sep 2026 found that 27% of everything
  typed into the site search box was a ROOM CODE — people who had been sent a
  code, could not find the field it goes in, and used the only box on the page
  that looked like one. Five of the codes checked were live rooms at the moment
  they were typed. The search box now recognises a code and offers to take them
  to the right game (see GameSearch.js and backend/src/findRoom.js); this is
  what makes the landing useful once they arrive.

  Without it they would arrive on the correct game's page with the join box
  collapsed behind a "Create / Join" tab and an empty code field — better than
  "no results", but still asking them to do the thing they had already failed to
  work out how to do once.

  DEFENSIVE ON PURPOSE. It runs during render on thirteen game pages, several of
  which are prerendered at build time where `window` does not exist, so
  everything here is wrapped and every failure returns the empty string. A
  decorative prefill must never be able to stop a game page from rendering.

  The value goes through the same sanitizeCodeInput the join box uses, so a
  hand-edited URL cannot put anything in the field that typing could not.
*/
export function codeFromUrl() {
  try {
    if (typeof window === 'undefined' || !window.location) return '';
    const raw = new URLSearchParams(window.location.search).get('join');
    if (!raw) return '';
    return sanitizeCodeInput(raw);
  } catch {
    return '';
  }
}

/* Which tab a game's home should open on. A code in the URL means the person
   is joining, not hosting — opening on "Create" would hide the very field the
   code is for. */
export function initialTab() {
  return codeFromUrl() ? 'join' : 'create';
}
