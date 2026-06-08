import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/*
  Corporate waitlist CTA — the willingness-to-pay probe for "Teams Plus"
  (a fresh game auto-posted to Slack/Teams each week). Shown on the office pages.
  Captures work email + company + which tool. See CORPORATE_STRATEGY.md §7.
*/
export default function WaitlistCTA({ source = 'office' }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [tool, setTool] = useState('teams');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  async function submit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); return; }
    setStatus('sending');
    try {
      const res = await fetch(`${BACKEND_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, tool, source }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <section className="rounded-3xl border-4 border-[#3D8B5A] bg-[#EAF6EE] p-6 md:p-8 mb-4 text-center">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">You’re on the list 🎉</h2>
        <p className="text-[#4A2D1B] mt-1">We’ll email you when the weekly team game for Slack &amp; Teams is ready. Thanks!</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border-4 border-[#E84A8B] bg-[#FFF6E9] p-6 md:p-8 mb-4">
      <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810]">A new team game every week 🎁</h2>
      <p className="text-[#4A2D1B] mt-1 mb-4">
        Teams get bored of the same game. Join the waitlist and we’ll auto-post a <strong>fresh game or trivia to your Slack or Microsoft Teams</strong> every week — leaderboards, no setup. Free to join the list.
      </p>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email"
          className="px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-white" />
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company (optional)"
          className="px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-white" />
        <div className="flex items-center gap-3 text-sm text-[#4A2D1B] sm:col-span-2">
          <span className="font-semibold">We use:</span>
          {['teams', 'slack', 'other'].map((t) => (
            <label key={t} className="inline-flex items-center gap-1 cursor-pointer">
              <input type="radio" name="tool" value={t} checked={tool === t} onChange={() => setTool(t)} />
              <span className="capitalize">{t === 'teams' ? 'Microsoft Teams' : t}</span>
            </label>
          ))}
        </div>
        <button type="submit" disabled={status === 'sending'}
          style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          className="sm:col-span-2 py-3 rounded-xl text-white font-bold text-lg disabled:opacity-60">
          {status === 'sending' ? 'Joining…' : 'Join the waitlist →'}
        </button>
        {status === 'error' && <p className="sm:col-span-2 text-sm text-red-600">Please enter a valid email and try again.</p>}
      </form>
    </section>
  );
}
