/*
  AdSlot — a Mediavine "content hint".

  Why this exists in this form:

  Mediavine's script normally picks ad positions itself, by walking the direct
  children of whatever element matches the `content_selector` configured on
  their side. Ours was set to ".max-w-3xl.mx-auto.mt-16" — three Tailwind
  utilities — and that selector matched NOTHING on any of the 14 routes checked.
  So from the ad tag going live on 11 Aug 2026, the script loaded, found nowhere
  to place anything, and served no ads at all: Mediavine recorded 0 sessions,
  $0.00 page RPM, and $1.92 of revenue in 17 days against ~62,000 pageviews.

  A content hint sidesteps the selector entirely. Mediavine's docs: "If it
  detects any of these hints, it won't use the logic to insert ads and will rely
  solely on these hints." One <div class="content_hint" /> renders one ad,
  exactly where we put it.
  https://help.mediavine.com/how-to-manually-place-ads-in-your-content-with-content-hints

  IMPORTANT — a hint is a commitment, not a suggestion. A single hint anywhere
  on a page switches automatic placement OFF for that entire page, so a page
  with one hint gets exactly one ad even where the script would have placed
  four. Two consequences:

    1. On prose-heavy SEO pages, prefer NO hints and let their optimiser work
       (it is better at spacing and viewability than we are). Only hint pages
       that are app-like, where there is no stream of paragraphs to walk.
    2. Where we do hint, space them about one screen view apart. That is also
       what keeps us inside the Coalition for Better Ads 30%-ads / 70%-content
       limit, which Google's Ad Experience tool enforces.

  Do not put a hint on a screen where a game is actively in progress. Players
  are mid-round with other people waiting on them; an ad there costs us a
  finished room, and unfinished rooms are the single biggest thing suppressing
  this site's numbers. Lobbies, results and game-over screens are fine — those
  are already waiting states.

  The `slot` / `format` props are AdSense-era leftovers and are ignored. They
  are still accepted so the existing call sites keep compiling.
*/
/*
  The hint div is kept bare — class="content_hint" and nothing else. Mediavine's
  published examples show exactly that markup, and we do not know whether their
  detection is a `.content_hint` selector match or an equality check on the
  attribute. Appending a caller's spacing class would be silently fatal under
  the second reading, and "silently fatal" is precisely the failure we are here
  to fix. Any styling therefore goes on a wrapper instead.
*/
const AdSlot = ({ className = '' }) =>
  className
    ? <div className={className}><div className="content_hint" /></div>
    : <div className="content_hint" />;

export default AdSlot;
