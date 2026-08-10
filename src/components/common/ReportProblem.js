import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiX, FiCopy, FiCheck } from 'react-icons/fi';
import { copyText } from '../../lib/shareSheet';

/*
  "Report a problem" — shows our email address and lets the player copy it.

  Deliberately does NOT fire a mailto: link. A mailto hands the player to
  whatever the OS has registered as the default mail client, which is very often
  something they have never used — it opened Outlook on the machine this was
  tested on. Handing someone a dead Outlook window is worse than handing them
  nothing, because they assume the report was sent.

  Also deliberately not an in-app form posting to our server. That needs SMTP
  credentials to notify anyone, and a report sitting unread in a database is the
  same as no report. Someone motivated enough to report a bug will send an
  email, and the reply then happens in a normal inbox thread.

  The context line is there so we know where they were without a round trip;
  copying the address copies it too.
*/

const CONTACT = 'ajejey@gmail.com';
const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };

function contextLine() {
  try {
    const path = window.location.pathname || '';
    const m = path.match(/^\/([^/]+)(?:\/room\/([A-Z]{4}))?/i);
    const room = m && m[2];
    return `Page: ${path}${room ? ` · Room: ${room}` : ''}`;
  } catch {
    return '';
  }
}

export default function ReportProblem({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null); // 'email' | 'both' | null

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const flash = (what) => {
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  };

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
                <h2 style={fredoka} className="text-xl font-bold text-[#2D1810]">Report a problem</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close"
                  className="p-1 text-[#8B6347] hover:text-[#2D1810]"><FiX size={20} /></button>
              </div>

              <p className="text-sm text-[#4A2D1B]">
                Something broken or confusing? Email us and we&rsquo;ll look at it. A single
                line is enough &mdash; we read every one.
              </p>

              <div className="mt-4 rounded-2xl border-2 border-[#FFE8C8] bg-white p-4 text-center">
                <p className="text-xs uppercase tracking-widest text-[#A89A78] mb-1">Email us at</p>
                <p style={fredoka} className="text-lg font-bold text-[#2D1810] break-all">{CONTACT}</p>
                <button
                  type="button"
                  onClick={() => copyText(CONTACT).then((ok) => ok && flash('email'))}
                  style={{ background: '#E84A8B', ...fredoka }}
                  className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 text-white font-bold"
                >
                  {copied === 'email' ? <><FiCheck /> Copied</> : <><FiCopy /> Copy address</>}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-xs text-[#8B6347] mb-1">
                  Handy to paste in &mdash; it tells us where you were:
                </p>
                <button
                  type="button"
                  onClick={() => copyText(contextLine()).then((ok) => ok && flash('both'))}
                  className="w-full text-left rounded-xl border-2 border-[#FFE8C8] bg-white px-3 py-2 text-xs text-[#4A2D1B] hover:border-[#E84A8B]"
                >
                  <span className="font-mono break-all">{contextLine()}</span>
                  <span className="block mt-1 font-semibold text-[#3D8B5A]">
                    {copied === 'both' ? 'Copied' : 'Tap to copy'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
