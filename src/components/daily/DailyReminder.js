import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  notificationsAvailable,
  getReminderPrefs,
  scheduleDailyReminder,
  cancelDailyReminder,
} from '../../lib/notifications';

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };

const BellIcon = ({ className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const pad = (n) => String(n).padStart(2, '0');

function friendlyTime(hour, minute) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${pad(minute)} ${hour < 12 ? 'am' : 'pm'}`;
}

/**
 * Daily reminder opt-in. Renders nothing on the web, where we cannot deliver a
 * scheduled notification — so this is app-only surface and the web page is
 * untouched.
 *
 * The reminder is a LOCAL notification: no server, no Firebase, no network. It
 * fires even in aeroplane mode, because the daily drop happens on a schedule
 * the device already knows.
 */
export default function DailyReminder() {
  const [prefs, setPrefs] = useState(() => getReminderPrefs());
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  // Mount-time re-read: the value can change from another screen.
  useEffect(() => { setPrefs(getReminderPrefs()); }, []);

  if (!notificationsAvailable()) return null;

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    setDenied(false);
    try {
      if (prefs.enabled) {
        await cancelDailyReminder();
        setPrefs({ ...prefs, enabled: false });
      } else {
        const ok = await scheduleDailyReminder(prefs.hour, prefs.minute);
        if (ok) setPrefs({ ...prefs, enabled: true });
        else setDenied(true);
      }
    } finally {
      setBusy(false);
    }
  };

  const changeTime = async (value) => {
    const [h, m] = value.split(':').map(Number);
    if (!Number.isInteger(h) || !Number.isInteger(m)) return;
    setPrefs((p) => ({ ...p, hour: h, minute: m }));
    if (prefs.enabled) await scheduleDailyReminder(h, m);
  };

  return (
    <div className="bg-[#FFF6E9] rounded-2xl border-2 border-[#FFE8C8] p-4 mt-5 max-w-sm mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="text-left">
          <p style={fredoka} className="font-bold text-[#2D1810] flex items-center gap-1.5">
            <BellIcon className="text-[#E84A8B]" />
            Daily reminder
          </p>
          <p className="text-xs text-[#8B6347] mt-0.5">
            {prefs.enabled
              ? `Every day at ${friendlyTime(prefs.hour, prefs.minute)}`
              : 'A nudge when the new herd lands'}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={prefs.enabled}
          aria-label="Daily reminder"
          onClick={toggle}
          disabled={busy}
          className={`relative w-14 h-8 rounded-full transition-colors shrink-0 disabled:opacity-60 ${
            prefs.enabled ? 'bg-[#3D8B5A]' : 'bg-[#E5D6C3]'
          }`}
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}
            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow"
            style={{ left: prefs.enabled ? 30 : 4 }}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {prefs.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-[#FFE8C8]">
              <span className="text-sm text-[#4A2D1B]">Remind me at</span>
              <input
                type="time"
                value={`${pad(prefs.hour)}:${pad(prefs.minute)}`}
                onChange={(e) => changeTime(e.target.value)}
                className="px-3 py-2 rounded-xl border-2 border-[#FFE8C8] bg-white text-[#2D1810] font-semibold outline-none focus:border-[#E84A8B]"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {denied && (
        <p className="text-xs text-[#C0392B] mt-3">
          Notifications are switched off for Herd Games. Turn them on in your phone's
          Settings &rarr; Apps &rarr; Herd Games &rarr; Notifications.
        </p>
      )}
    </div>
  );
}
