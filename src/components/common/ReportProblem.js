import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiX, FiCheck } from 'react-icons/fi';
import { getRecentErrors } from '../../lib/reportError';

/*
  "Report a problem" — a direct line from a stuck player to us.

  Why this matters more than it looks: in this niche a player who hits a problem
  does not write in, they leave. On Google Play they do something worse — they
  leave a one-star review, which is public, permanent, and suppresses installs.
  A report button turns silent churn into a signal AND keeps the complaint out
  of the review section.

  Play policy note: this is deliberately a NEUTRAL, always-available control. It
  never asks "are you enjoying the app?" and never routes happy users to the
  store. Google's In-App Review policy explicitly prohibits gating a review
  prompt on sentiment, so the "happy? → rate us / unhappy? → feedback" pattern
  is not an option. This sidesteps that entirely.

  The report auto-attaches context (page, game, room code, platform, recent
  console errors) so a one-line "it froze" is still actionable. Asking a
  frustrated person to describe their browser is how you get no reports at all.
*/

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };

function context() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const m = path.match(/^\/([^/]+)(?:\/room\/([A-Z]{4}))?/i);
  let platform = 'web';
  try {
    // Avoid importing Capacitor here — this renders on every page and the web
    // bundle should not pay for it. The native WebView origin is enough.
    if (window.location.hostname === 'localhost' && window.location.protocol === 'https:') platform = 'android';
  } catch { /* ignore */ }
  return {
    page: path.slice(0, 300),
    game: (m && m[1]) || '',
    roomCode: (m && m[2]) || '',
    platform,
  };
}

export default function ReportProblem({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error

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
          email: email.trim(),
          ...context(),
          recentErrors: getRecentErrors ? getRecentErrors() : [],
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setState('sent');
      setMessage('');
      setEmail('');
      setTimeout(() => { setOpen(false); setState('idle'); }, 2200);
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report a problem"
        className={
          compact
            ? 'inline-flex items-center gap-1.5 text-sm text-[#8B6347] hover:text-[#E84A8B] transition-colors'
            : 'inline-flex items-center gap-1.5 text-sm text-[#8B6347] hover:text-[#E84A8B] transition-colors'
        }
      >
        <FiAlertCircle /> Report a problem
      </button>

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
                  {state === 'sent' ? 'Thank you' : 'Report a problem'}
                </h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close"
                  className="p-1 text-[#8B6347] hover:text-[#2D1810]"><FiX size={20} /></button>
              </div>

              {state === 'sent' ? (
                <p className="text-[#4A2D1B] flex items-center gap-2">
                  <FiCheck className="text-[#3D8B5A]" /> Sent. That genuinely helps — thank you.
                </p>
              ) : (
                <form onSubmit={submit}>
                  <p className="text-sm text-[#4A2D1B] mb-3">
                    What went wrong? Even one line helps. We attach the page and game
                    automatically, so no need to describe your device.
                  </p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    autoFocus
                    placeholder="e.g. The buzz button did nothing when my team said a forbidden word"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#E84A8B] outline-none text-[#2D1810] bg-white resize-none"
                  />
                  <label className="block mt-3">
                    <span className="text-xs text-[#8B6347]">Email, only if you want a reply (optional)</span>
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
                    <p className="text-sm text-[#C0392B] mt-3">
                      That didn&rsquo;t send. You can email us at ajejey@gmail.com instead.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={message.trim().length < 3 || state === 'sending'}
                    style={{ background: '#E84A8B', ...fredoka }}
                    className="mt-4 w-full py-3 rounded-2xl text-white font-bold text-lg disabled:opacity-40"
                  >
                    {state === 'sending' ? 'Sending…' : 'Send report'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
