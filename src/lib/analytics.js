/*
  PostHog — product analytics, deliberately instrumented.

  Why this file exists rather than the copy-paste snippet:

  1. WHERE IT RUNS. Two surfaces are real — the live site and the Android app —
     and three are not: the CRA dev server, the Playwright suite, and prerender.
     The e2e suite drives dozens of complete game playthroughs; if those land in
     the data then D1 retention looks great and the number we are steering the
     whole business by is a lie. The ad and gtag tags solve this with a plain
     hostname check, but we cannot copy that: the Capacitor WebView's origin is
     https://localhost, which collides with the dev server. So the guard is
     hostname OR native-platform, and hard-off on any automation signal.

  2. IT IS CODE-SPLIT, NOT IMPORTED. posthog-js is ~520KB raw. Imported
     statically it sits in the critical bundle for every visitor, including all
     the ones (1) just excluded, on a site whose whole character is that 43
     games fit in well under a megabyte. The dynamic import means it is fetched
     after paint, only on the surfaces that will actually send anything.

  3. AUTOCAPTURE IS OFF. The free tier is 1M events/month. Autocapture logs
     every click, and a game is nothing but clicks — one Minesweeper session
     alone would spend hundreds of events to tell us nothing. Named events only.

  4. IDENTITY IS SHARED. `hg_anon` (lib/anonId.js) is already the id behind
     every daily-completion beacon and the cross-game streak. PostHog uses the
     same value as its distinct_id, so the backend's daily_events and PostHog's
     retention cohorts describe the same people. Two identity spaces would have
     made both halves of the retention picture unjoinable.

  5. SESSION REPLAY IS OFF BY DEFAULT and started explicitly. The free tier is
     5,000 recordings/month, and recording everyone would spend it on people
     idly reading the FAQ. We start recording only when someone enters the join
     funnel — the flow that produced 67 rooms that never finished and not one
     bug report. See startFunnelRecording().

  Nothing here may ever throw, and nothing here may ever block. Analytics
  failing must not cost a game — the same rule reportError.js and pingEvent.js
  follow.
*/
import { Capacitor } from '@capacitor/core';
import { getAnonId } from './anonId';

// Public, client-side project key. It ships in the bundle by design and is
// visible in any browser's dev tools — this is not a secret. The secret one is
// the personal API key (phx_...), which must never appear in this repo.
const KEY = 'phc_o374bcJyfmVxh5jfq88ubyvZENBdmiJEyroAAYs53mSt';
/*
  Our own subdomain, not us.i.posthog.com — a PostHog-managed reverse proxy
  (CNAME to Cloudflare, TLS handled by them). Ad blockers maintain lists of
  known analytics hostnames and drop requests to them; routing through our own
  domain recovers 10-30% of events that would otherwise never arrive.

  Set up BEFORE the first deploy on purpose. Adding it later would have raised
  event capture by that same 10-30% overnight, retention would have appeared to
  improve, and we would have credited whatever we happened to ship that week.
  The baseline has to start clean.

  Verified 19 Aug 2026: POST /i/v0/e/ returns 200 {"status":"Ok"} through the
  proxy, identical to the direct host.
*/
const HOST = 'https://e.herdgamesonline.com';

let ph = null;          // the loaded SDK, once the dynamic import resolves
let enabled = null;     // null = not yet decided, false = permanently off
const pending = [];     // calls made before the SDK finished loading

function automated() {
  try {
    if (navigator.webdriver === true) return true;
    return /HeadlessChrome|Playwright|puppeteer|Lighthouse/i.test(navigator.userAgent || '');
  } catch {
    return true; // if we cannot tell, stay out of the data
  }
}

/*
  Deliberate local override, for smoke-testing the integration before a deploy.

  Open any page with ?hg_analytics_debug=1 once and the flag sticks in
  localStorage; ?hg_analytics_debug=0 clears it. Events then flow from a dev
  build, stamped surface:'dev' so a single filter excludes every one of them
  from any insight.

  It deliberately does NOT override the automation check above. A flag that let
  Playwright through would be a loaded gun pointed at the retention numbers —
  the e2e suite plays dozens of complete games, and that data arriving under
  real-looking person profiles is precisely the corruption this guard exists to
  prevent. A human in a real browser can opt in; a robot cannot, ever.
*/
const DEBUG_KEY = 'hg_analytics_debug';

function debugOptIn() {
  try {
    const q = new URLSearchParams(window.location.search).get(DEBUG_KEY);
    if (q === '1') localStorage.setItem(DEBUG_KEY, '1');
    if (q === '0') localStorage.removeItem(DEBUG_KEY);
    return localStorage.getItem(DEBUG_KEY) === '1';
  } catch {
    return false;
  }
}

function surface() {
  try {
    if (Capacitor.isNativePlatform()) return 'android-app';
    const h = window.location.hostname;
    if (h === 'herdgamesonline.com' || h === 'www.herdgamesonline.com') return 'web';
    return 'dev';
  } catch {
    return 'dev';
  }
}

function shouldRun() {
  try {
    if (automated()) return false;          // never overridable, see above
    if (debugOptIn()) return true;
    if (Capacitor.isNativePlatform()) return true;
    const h = window.location.hostname;
    return h === 'herdgamesonline.com' || h === 'www.herdgamesonline.com';
  } catch {
    return false;
  }
}

/*
  Queue rather than drop. The first pageview fires when the router mounts, which
  is well before a dynamically imported 520KB SDK has landed — and losing the
  entry page would break every funnel that starts at it. Bounded, because an
  unbounded queue on a surface that never loads the SDK is a slow leak.
*/
function call(method, args) {
  try {
    if (enabled === false) return;
    if (ph) { ph[method](...args); return; }
    if (pending.length < 50) pending.push([method, args]);
  } catch { /* never throw */ }
}

export function initAnalytics() {
  try {
    if (enabled !== null) return;
    enabled = shouldRun();
    if (!enabled) { pending.length = 0; return; }

    import('posthog-js')
      .then((mod) => {
        const sdk = mod.default || mod;
        sdk.init(KEY, {
          api_host: HOST,
          /*
            Pins PostHog's default behaviours to a dated set, so a future SDK
            release cannot quietly change how we capture underneath us. Same
            reasoning as setting maskAllInputs explicitly below: anything this
            file depends on should be stated, not inherited. Every option we set
            explicitly still wins over these.
          */
          defaults: '2026-05-30',
          autocapture: false,              // see (3)
          capture_pageview: false,         // SPA — sent manually on route change
          capture_pageleave: true,         // needed for honest session duration
          disable_session_recording: true, // see (5)
          /*
            Set explicitly, not left to the library default. PrivacyPolicy.js
            tells visitors that text they type into input boxes is masked and
            not captured — a claim in a legal document must be guaranteed by
            our configuration, not by a default that a future SDK release could
            change without us noticing.

            Answers and display names still appear in a recording once they are
            on screen, which is correct and not a leak: they were already shown
            to everyone in the room. What is masked is the act of typing.
          */
          session_recording: {
            maskAllInputs: true,
            maskInputOptions: { password: true, email: true, text: true },
          },
          persistence: 'localStorage',     // we set no cookies
          // Everyone gets a person profile keyed on hg_anon, which is what
          // makes retention cohorts possible. Without persons there is no D1/D7.
          person_profiles: 'always',
          loaded: (loaded) => {
            try {
              loaded.identify(getAnonId(), { surface: surface() });
              // Stamped on every event too, not just the person, so insights
              // can exclude dev traffic without touching person properties.
              loaded.register({ surface: surface() });
            } catch { /* never throw */ }
          },
        });
        ph = sdk;
        while (pending.length) {
          const [method, args] = pending.shift();
          try { ph[method](...args); } catch { /* one bad event must not stop the rest */ }
        }
      })
      .catch(() => { enabled = false; pending.length = 0; });
  } catch { /* analytics must never break the app */ }
}

/** Named event. Silently no-ops off the live surfaces. */
export function track(event, props = {}) {
  call('capture', [event, props]);
}

/** SPA pageview. Called from the router, not from posthog's own listener. */
export function trackPageview(path) {
  try {
    call('capture', ['$pageview', { $current_url: window.location.origin + path }]);
  } catch { /* never throw */ }
}

/*
  Start replay for this session.

  Call when someone enters a flow whose failures are invisible to us — joining
  or hosting a room. Recording is capped at 5,000 sessions/month on the free
  tier, so it is spent here rather than on people reading the FAQ. Idempotent:
  PostHog ignores a second start on an already-recording session.
*/
export function startFunnelRecording(reason) {
  call('startSessionRecording', []);
  track('recording_started', { reason: String(reason || 'unknown') });
}
