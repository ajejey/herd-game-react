import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiX, FiCheck, FiCopy } from 'react-icons/fi';
import { getRecentErrors } from '../../lib/reportError';
import { copyText } from '../../lib/shareSheet';

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
const CONTACT = 'ajejey@gmail.com';

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };

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

export default function ReportProblem({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report a problem"
        style={fredoka}
        className={
          'inline-flex items-center gap-2 rounded-full border-2 border-[#FFE8C8] bg-white ' +
          'px-5 py-2.5 font-semibold text-[#2D1810] shadow-[0_6px_16px_-8px_rgba(45,24,16,0.4)] ' +
          'transition-all hover:border-[#E84A8B] hover:text-[#E84A8B] hover:scale-105 active:scale-95 ' +
          (compact ? 'text-sm' : 'text-base')
        }
      >
        <FiAlertCircle className="text-[#E84A8B]" size={18} />
        Report a problem
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
                  <FiCheck className="text-[#3D8B5A]" /> Sent. That genuinely helps &mdash; thank you.
                </p>
              ) : (
                <>
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
                        That didn&rsquo;t send &mdash; please use the email address below instead.
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

                  {/* Fallback for anyone who would rather email, and the escape
                      hatch when the POST fails. */}
                  <div className="mt-4 pt-4 border-t border-[#FFE8C8] text-center">
                    <p className="text-xs text-[#8B6347]">Or email us directly</p>
                    <div className="mt-1 flex items-center justify-center gap-2 flex-wrap">
                      <span style={fredoka} className="font-bold text-[#2D1810] break-all">{CONTACT}</span>
                      <button
                        type="button"
                        onClick={() => copyText(CONTACT).then((ok) => {
                          if (!ok) return;
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        })}
                        className="inline-flex items-center gap-1 rounded-full border-2 border-[#FFE8C8] bg-white px-3 py-1 text-xs font-semibold text-[#2D1810] hover:border-[#E84A8B]"
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
