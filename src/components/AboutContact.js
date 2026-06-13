import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import MeadowLayout, { GrassStrip, fredokaStyle } from './MeadowLayout';

const SectionCard = ({ children, accent = '#FFE8C8' }) => (
  <div
    className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 p-6 md:p-8 mb-8"
    style={{ borderColor: accent }}
  >
    {children}
    <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
  </div>
);

const AboutContact = () => {
  return (
    <MeadowLayout>
      <Helmet>
        <title>About Us & Contact | Herd Game</title>
        <meta name="description" content="Learn about the team behind Herd Game and get in touch with us. We'd love to hear your feedback about our online multiplayer game!" />
        <link rel="canonical" href="https://herdgamesonline.com/about-contact" />
      </Helmet>

      <SectionCard>
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">About Us</h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        <div className="text-[#4A2D1B] space-y-4">
          <p className="text-lg">
            Herd Games is a small, independent collection of free browser party games and daily puzzles — built to be played in seconds, with no download, no signup, and no app store.
          </p>

          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#3D8B5A] mt-6">Who's behind it</h2>
          <p>
            Herd Games is built and maintained by <strong>Ajey Nagarkatti</strong>, an independent web developer. Over the years I've shipped a number of free, no-signup web games and tools used by people around the world, including a <a href="https://playbingoonline.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#E84A8B] font-semibold underline">browser bingo game</a>, an <a href="https://emoji-guess-game-seven.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#E84A8B] font-semibold underline">emoji guessing game</a>, and a <a href="https://globleguess.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#E84A8B] font-semibold underline">daily geography game</a>. Herd Games is where I bring the party-game ideas together in one place.
          </p>

          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#3D8B5A] mt-6">Why this site exists</h2>
          <p>
            Most online party games want you to download an app, create an account, or pay before the fun starts. I wanted the opposite: open a link, share a room code, and you're playing in under a minute — on any phone or laptop. Every game here is designed and built from scratch, play-tested with real friends and family, and tuned from how those sessions actually go (which questions land, where people get confused, what makes a group laugh).
          </p>

          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#3D8B5A] mt-6">What you'll find</h2>
          <p>
            A growing library of free games: live multiplayer party games like <Link to="/say-anything" className="text-[#E84A8B] font-semibold underline">Say Anything</Link>, <Link to="/guesstimate" className="text-[#E84A8B] font-semibold underline">Guesstimate</Link> and <Link to="/clover" className="text-[#E84A8B] font-semibold underline">Clover Clues</Link> that you play with friends over a video call, and quick daily solo games like the <Link to="/daily" className="text-[#E84A8B] font-semibold underline">Daily Herd</Link>, <Link to="/trivia" className="text-[#E84A8B] font-semibold underline">Daily Trivia</Link> and <Link to="/hot-takes" className="text-[#E84A8B] font-semibold underline">Daily Hot Takes</Link>. New games are added regularly, and existing ones are improved based on player feedback.
          </p>
        </div>
      </SectionCard>

      <SectionCard accent="#FFD56B">
        <h2 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810] mb-6">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#4A2D1B]">
          <div>
            <p className="mb-6">
              We'd love to hear from you! Whether you have a question, feedback, or just want to say hello,
              feel free to reach out to us using the contact information below.
            </p>

            <div>
              <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810] mb-1">Email</h3>
              <p>
                <a href="mailto:ajejey@gmail.com" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">
                  ajejey@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </MeadowLayout>
  );
};

export default AboutContact;
