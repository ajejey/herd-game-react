import React, { useEffect, useRef, useState } from 'react';

/*
  The rotating half of the search placeholder: "Search " + something that
  changes.

  WHY AN OVERLAY AND NOT THE placeholder ATTRIBUTE
  `::placeholder` cannot be animated. It is absent from CSSPseudoElement, which
  is why transitions and animations on it do nothing in every browser
  (Mozilla bug 1115623). Every "animated placeholder" in the wild is really a
  positioned element sitting over an empty input, and so is this one. The input
  keeps a real `placeholder` for the no-JS and screen-reader path; this is drawn
  on top of it and marked aria-hidden so nothing is announced twice.

  WHY A SLIDE AND NOT A TYPEWRITER
  The typewriter effect is the popular choice and the wrong one here. It moves
  continuously and never rests, and WebAIM's guidance on animation is explicit
  that sustained motion is a real problem for vestibular disorders — the advice
  is to keep animation brief and prefer fades over movement. A slide is ~260ms
  of motion followed by three seconds of stillness, which reads as calm rather
  than as something demanding attention next to a text field people are trying
  to type in.

  It also stops completely the moment the field is focused or typed in. An
  animation competing with a caret is just noise.

  REDUCED MOTION
  Honoured, and honoured properly: the hints still rotate, they crossfade
  instead of moving. Removing the feature entirely would hide what the search
  can do from exactly the people least likely to experiment with it.
*/

const SLIDE_MS = 260;

export default function RotatingHint({ hints, paused, prefix = 'Search ' }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    if (paused || hints.length < 2) { clear(); return clear; }

    const tick = () => {
      setLeaving(true);
      timers.current.push(setTimeout(() => {
        setIndex((i) => (i + 1) % hints.length);
        setLeaving(false);
      }, reduced ? 200 : SLIDE_MS));
    };

    const id = setInterval(tick, 3200);
    timers.current.push(id);
    return () => { clearInterval(id); clear(); };
  }, [paused, hints.length, reduced]);

  if (paused) return null;

  const motion = reduced
    ? { opacity: leaving ? 0 : 1, transition: 'opacity 200ms ease' }
    : {
        opacity: leaving ? 0 : 1,
        transform: `translateY(${leaving ? '-0.55rem' : '0'})`,
        transition: `opacity ${SLIDE_MS}ms ease, transform ${SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };

  return (
    /*
      pointer-events-none so a tap lands on the input underneath, and
      overflow-hidden so the outgoing hint is clipped rather than escaping
      upward over the border.
    */
    <span
      aria-hidden="true"
      /*
        The word space is a non-breaking space, deliberately.

        "Search " + "word games" first rendered as "Searchword games": a
        trailing space inside a span is collapsed by HTML whitespace handling,
        and so is a JSX {' '} in the same position. A CSS gap fixes the look but
        not the text — textContent still reads "SearchScattergories", so
        anything reading the rendered text sees two words jammed together.
        \u00A0 is the one that survives both.
      */
      className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden whitespace-nowrap"
      style={{ fontFamily: "'Quicksand', system-ui, sans-serif" }}
    >
      <span className="text-[17px] text-[#A88B72]">{prefix.trim()}{'\u00A0'}</span>
      <span className="text-[17px] font-semibold text-[#8B6347]" style={motion}>
        {hints[index]}
      </span>
    </span>
  );
}
