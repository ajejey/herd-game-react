import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import { ScaleIcon, PencilIcon, EyeIcon, TokenIcon, DiceIcon, SparkleIcon } from './icons/Icons';

/*
  Slim playful banner pinned above each phase.
  Tells the player what's happening and what's expected, in voice.
*/

const PHASES = {
  picking_judge:    { Icon: DiceIcon,   title: "You're the judge! Pick a question.",    sub: 'Make it fun — everyone has to answer this.' },
  picking_other:    { Icon: ScaleIcon,  title: 'Judge is choosing your fate…',          sub: 'Stand by. Pick something good, judge.' },
  answering_self:   { Icon: PencilIcon, title: 'Write something the judge will love',   sub: 'No wrong answers. Be funny, honest, or weird.' },
  answering_judge:  { Icon: EyeIcon,    title: 'Watching the answers roll in',          sub: "You'll pick a favourite next." },
  judging_self:     { Icon: EyeIcon,    title: 'Pick your favourite — quietly',         sub: "Don't say it out loud. The others have to guess." },
  judging_other:    { Icon: ScaleIcon,  title: 'Judge is choosing…',                    sub: 'While you wait, guess who they picked.' },
  betting_self:     { Icon: TokenIcon,  title: 'Place BOTH your tokens',                sub: 'Doubling-down for 2 points or hedging — your call.' },
  betting_judge:    { Icon: ScaleIcon,  title: "Everyone's placing bets",               sub: "You're done — enjoy the chaos." },
  reveal:           { Icon: SparkleIcon,title: 'Drumroll please…',                      sub: "Let's see who read the judge right." },
};

function keyFor(phase, isJudge) {
  if (phase === 'picking')   return isJudge ? 'picking_judge'  : 'picking_other';
  if (phase === 'answering') return isJudge ? 'answering_judge': 'answering_self';
  if (phase === 'judging')   return isJudge ? 'judging_self'   : 'judging_other';
  if (phase === 'betting')   return isJudge ? 'betting_judge'  : 'betting_self';
  if (phase === 'reveal')    return 'reveal';
  return null;
}

export default function PhaseBanner({ phase, isJudge }) {
  const key = keyFor(phase, isJudge);
  if (!key) return null;
  const { Icon, title, sub } = PHASES[key];

  return (
    <div className="mb-4 bg-gradient-to-r from-[#FFF0F7] to-[#FFFBE8] border-2 border-[#FFE8C8] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
      <div className="shrink-0">
        <Icon size={36} />
      </div>
      <div className="min-w-0">
        <p style={fredokaStyle} className="text-[#2D1810] font-bold text-sm md:text-base leading-tight">{title}</p>
        <p className="text-[#6B4226] text-xs md:text-sm leading-snug">{sub}</p>
      </div>
    </div>
  );
}
