import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiX, FiCheck, FiCopy } from 'react-icons/fi';
import { getRecentErrors } from '../../lib/reportError';
import { copyText } from '../../lib/shareSheet';
import { track } from '../../lib/analytics';

/*
  "Report a problem" — an in-app form that posts to /api/feedback, plus our
  email address as a fallback.

  History worth keeping, because this went back and forth: it was briefly
  replaced by a mailto: link and then by an address-only dialog, on the
  reasoning that a report nobody is notified about is a report nobody reads.
  Reverted because the form demonstrably works — two players filed real reports
  through it within days — and because a mailto hands people to whatever the OS
  thinks their default mail client is, which is often something they never use.

  Reports land in the `user_feedback` collection and are read with
  `backend/scripts/feedback-report.js`. There is deliberately NO email
  notification: that needs SMTP credentials, and checking the collection
  periodically is the accepted trade.

  The form auto-attaches page, game, room code, platform and the last few
  console errors, so a one-line "it froze" is still actionable — asking a
  frustrated person to describe their browser is how you get no reports at all.
*/

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
// A domain address, not a personal one. Help contexts go to support@, general
// and legal ones to hello@ — both are aliases on the same mailbox, so this is
// presentation and transferability rather than extra inboxes to watch.
const CONTACT = 'support@herdgamesonline.com';

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };

/*
  The same sheet, in two voices.

  A "suggest a game" card used to be a mailto: link on the homepage. It opened
  whatever the OS thinks the default mail client is — for a lot of desktop
  visitors, nothing visible at all — and nothing measured it, so after months
  there was no evidence anyone had ever used it. Meanwhile a real suggestion
  ("Manually moving the cow would be a good feature") arrived through THIS form,
  which works and is read.

  So the card now opens this, and the only difference is the words.
*/
const VOICE = {
  problem: {
    title: 'Report a problem',
    prompt: 'What went wrong? Even one line helps. We attach the page and game automatically, so no need to describe your device.',
    placeholder: 'e.g. The buzz button did nothing when my team said a forbidden word',
    sent: 'Sent. That genuinely helps — thank you.',
    submit: 'Send report',
  },
  suggestion: {
    title: 'What should we build?',
    prompt: 'A game you love that is missing here, or something you wish one of ours did. One line is plenty.',
    placeholder: 'e.g. A version of Codenames, or let the host pick the timer length',
    sent: 'Got it — thank you. Every one of these gets read.',
    submit: 'Send idea',
  },
};

function context() {
  let path = '';
  try { path = window.location.pathname || ''; } catch { /* ignore */ }
  const m = path.match(/^\/([^/]+)(?:\/room\/([A-Z]{4}))?/i);
  let platform = 'web';
  try {
    // The app's WebView origin is https://localhost — enough to tell them apart
    // without importing Capacitor into every page of the web bundle.
    if (window.location.hostname === 'localhost' && window.location.protocol === 'https:') platform = 'android';
  } catch { /* ignore */ }
  return { page: path.slice(0, 300), game: (m && m[1]) || '', roomCode: (m && m[2]) || '', platform };
}

export default function ReportProblem({ compact = false, variant = 'problem', children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);
  const voice = VOICE[variant] || VOICE.problem;

  /*
    One event on open, so the card can be judged on evidence rather than on
    whether it looks nice. Autocapture is off, so without this there is no click
    data at all — which is exactly how the mailto: version survived unread.
  */
  function openSheet() {
    track('feedback_open', { variant, page: (context() || {}).page });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    if (message.trim().length < 3 || state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          kind: variant,
          email: email.trim(),
          ...context(),
          recentErrors: typeof getRecentErrors === 'function' ? getRecentErrors() : [],
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      setMessage('');
      setEmail('');
      setTimeout(() => { setOpen(false); setState('idle'); }, 2400);
    } catch {
      setState('error');
    }
  }

  return (
    <>
      {/*
        A caller can supply its own trigger. The homepage suggest-a-game card
        is a whole card, not a pill, and wrapping it here keeps ONE sheet, one
        endpoint and one tracking event rather than a second half-built copy of
        all three — which is how the mailto: version came to exist.
      */}
      {children ? (
        <button type="button" onClick={openSheet} className="block w-full text-left">
          {children}
        </button>
      ) : (
      <button
        type="button"
        onClick={openSheet}
        aria-label="Report a problem"
        style={fredoka}
        className={
          'inline-flex items-center gap-2 rounded-full border-2 border-[#FFE8C8] bg-white ' +
          'px-5 py-2.5 font-semibold text-[#2D1810] shadow-[0_6px_16px_-8px_rgba(45,24,16,0.4)] ' +
          // `compact` used to shave this to 14px. It no longer does: 14px was
          // below the size this app should ever print at, and the compact
          // callers were exactly the cramped placements where a report link
          // most needed to stay readable. The prop is kept so the ~20 call
          // sites need no edit, and is now a no-op.
          'transition-all hover:border-[#E84A8B] hover:text-[#E84A8B] hover:scale-105 active:scale-95 text-base'
        }
      >
        <FiAlertCircle className="text-[#E84A8B]" size={18} />
        Report a problem
      </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Report a problem"
              className="w-full sm:max-w-md bg-[#FFF8E7] rounded-t-3xl sm:rounded-3xl border-4 border-[#FFE8C8] p-5 max-h-[90dvh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 style={fredoka} className="text-xl font-bold text-[#2D1810]">
                  {state === 'sent' ? 'Thank you' : voice.title}
                </h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close"
                  className="p-1 text-[#8B6347] hover:text-[#2D1810]"><FiX size={20} /></button>
              </div>

              {state === 'sent' ? (
                <p className="text-[#4A2D1B] flex items-center gap-2">
                  <FiCheck className="text-[#3D8B5A]" /> {voice.sent}
                </p>
              ) : (
                <>
                  <form onSubmit={submit}>
                    <p className="text-base text-[#4A2D1B] mb-3">
                      {voice.prompt}
                    </p>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      maxLength={2000}
                      autoFocus
                      placeholder={voice.placeholder}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#E84A8B] outline-none text-[#2D1810] bg-white resize-none"
                    />
                    <label className="block mt-3">
                      <span className="text-sm text-[#8B6347]">Email, only if you want a reply (optional)</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={200}
                        placeholder="you@example.com"
                        className="mt-1 w-full px-4 py-2.5 rounded-xl border-2 border-[#FFE8C8] focus:border-[#E84A8B] outline-none text-[#2D1810] bg-white"
                      />
                    </label>

                    {state === 'error' && (
                      <p className="text-base text-[#C0392B] mt-3">
                        That didn&rsquo;t send &mdash; please use the email address below instead.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={message.trim().length < 3 || state === 'sending'}
                      style={{ background: '#E84A8B', ...fredoka }}
                      className="mt-4 w-full py-3 rounded-2xl text-white font-bold text-lg disabled:opacity-40"
                    >
                      {state === 'sending' ? 'Sending…' : voice.submit}
                    </button>
                  </form>

                  {/* Fallback for anyone who would rather email, and the escape
                      hatch when the POST fails. */}
                  <div className="mt-4 pt-4 border-t border-[#FFE8C8] text-center">
                    <p className="text-sm text-[#8B6347]">Or email us directly</p>
                    <div className="mt-1 flex items-center justify-center gap-2 flex-wrap">
                      <span style={fredoka} className="font-bold text-[#2D1810] break-all">{CONTACT}</span>
                      <button
                        type="button"
                        onClick={() => copyText(CONTACT).then((ok) => {
                          if (!ok) return;
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        })}
                        className="inline-flex items-center gap-1 rounded-full border-2 border-[#FFE8C8] bg-white px-3 py-1 text-sm font-semibold text-[#2D1810] hover:border-[#E84A8B]"
                      >
                        {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
