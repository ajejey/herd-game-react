/*
  One anonymous id for this browser, shared by everything that reports.

  It lives in its own module because both sides of the reporting stack need it —
  pingEvent.js stamps it on daily-completion beacons, and analytics.js hands it
  to PostHog as the distinct_id — and importing it from either of those into the
  other would be a cycle.

  Sharing it is the point, not a convenience. The backend's daily_events and
  PostHog's retention cohorts have to describe the same people, or we end up
  with two half-pictures of retention that cannot be joined.

  It is not personal data: a random string in localStorage, no fingerprinting,
  cleared whenever the visitor clears site data.
*/
const ANON_KEY = 'hg_anon';

export function getAnonId() {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = 'a_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    // Private mode, or storage disabled. A stable-ish fallback is better than
    // throwing; these sessions simply will not join up across visits.
    return 'a_anon';
  }
}
