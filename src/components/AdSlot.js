/*
  AdSlot — intentionally a no-op.

  Google AdSense was removed (Jul 2026): AdSense rejected us, and a competing
  ad script blocks/slows a Mediavine Journey approval (Journey wants the site
  free of other ad networks during review). Rather than delete the ~38 <AdSlot/>
  call sites, this component now renders nothing and loads no ad code, so every
  usage is inert. When an ad network is approved, wire it up here in one place.
*/
const AdSlot = () => null;

export default AdSlot;
