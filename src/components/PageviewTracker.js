import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../lib/analytics';

/*
  Send one PostHog pageview per route change.

  PostHog's own `capture_pageview` listens for real navigations, which in a SPA
  happen exactly once — at the cold load. Every route after that would be
  invisible, so a visitor who plays four games would read as a single-page
  session and every funnel built on top would be wrong.

  Keyed on pathname only, matching ScrollToTop: hash links (#play) and query
  changes (/?join=CODE) are the same page to a human, and counting them as
  separate views would inflate pageviews against the real ad-impression number.

  The tracker is a no-op off the live site and the Android app — see
  lib/analytics.js for why that guard is not a plain hostname check.
*/
export default function PageviewTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);
  return null;
}
