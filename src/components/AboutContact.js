import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import MeadowLayout, { GrassStrip, fredokaStyle } from './MeadowLayout';

/*
  About page.

  Ad networks (and Google's own quality guidance) want to see that a real,
  accountable person stands behind the site and that the content is genuinely
  original. The obvious way to do that is a photo and a life story — which the
  site owner does not want, and which is not actually the requirement.

  So this page answers the same questions with EVIDENCE instead of biography:
  who is accountable (named once, with a working email), what else they have
  shipped, how the games are made, where any third-party data comes from and
  under what licence, and how often the site changes. That is a stronger
  originality signal than a headshot, and it is all verifiable.

  Deliberately: first name only, no photo, no personal details, and NO game count —
  any number invites a wrong claim the moment a game is added or reclassified.
*/

const SectionCard = ({ children, accent = '#FFE8C8' }) => (
  <div
    className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 p-6 md:p-8 mb-8"
    style={{ borderColor: accent }}
  >
    {children}
    <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
  </div>
);

const H2 = ({ children }) => (
  <h2 style={fredokaStyle} className="text-2xl font-bold text-[#3D8B5A] mt-6">{children}</h2>
);

const Ext = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#E84A8B] font-semibold underline">{children}</a>
);

const AboutContact = () => {
  return (
    <MeadowLayout>
      <Helmet>
        <title>About Herd Game — Who Makes It and How</title>
        <meta name="description" content="Herd Game is an independent collection of free browser party games and puzzles. Who builds it, how the games are made and tested, where the data comes from, and how to get in touch." />
        <link rel="canonical" href="https://herdgamesonline.com/about-contact" />
      </Helmet>

      <SectionCard>
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">About Herd Game</h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        <div className="text-[#4A2D1B] space-y-4">
          <p className="text-lg">
            Herd Game is a small, independent growing collection of free browser games — party games you play
            with friends over a video call, daily puzzles, and single-player games you can pick up for a minute.
            No download, no signup, no app store.
          </p>

          <H2>Who makes it</H2>
          <p>
            The site is built and run by <strong>Ajey</strong>, an independent web developer, working
            on it directly rather than through an agency or a content team. Every game, every page and every word
            here is made in-house. Previous free, no-signup projects include a{' '}
            <Ext href="https://playbingoonline.vercel.app">browser bingo game</Ext>, an{' '}
            <Ext href="https://emoji-guess-game-seven.vercel.app">emoji guessing game</Ext> and a{' '}
            <Ext href="https://globleguess.vercel.app">daily geography game</Ext>. Herd Game is where the
            party-game ideas ended up in one place.
          </p>
          <p>
            If something on the site is broken, wrong or unfair, there is one person to tell, and the email
            address below reaches them.
          </p>

          <H2>Why it exists</H2>
          <p>
            Most online party games want you to download an app, make an account, or pay before the fun starts.
            This is the opposite: open a link, share a four-letter room code, and you are playing in under a
            minute on whatever phone or laptop is already in the room. Nothing here is gated, and the games are
            built for the awkward reality of a group where one person is on a laptop, two are on phones and
            somebody is joining late.
          </p>

          <H2>How the games are made</H2>
          <p>
            Each game is designed and coded from scratch, then play-tested with actual people before it goes
            live — which is where most of the changes come from. Questions that never land get cut, rounds that
            drag get shortened, and rules that need explaining twice get redesigned. Games are revised after
            launch based on how real sessions go and what players write in.
          </p>
          <p>
            Nothing here is scraped, spun or aggregated from other sites, and the written guides are not
            round-ups of someone else&rsquo;s content. Where a game uses outside data, it is openly licensed and
            credited: trivia questions come from the{' '}
            <Ext href="https://opentdb.com/">Open Trivia Database</Ext> under CC BY-SA 4.0, and facts behind
            games like Higher or Lower and Guess the Year come from{' '}
            <Ext href="https://www.wikidata.org/">Wikidata</Ext>, which is public domain (CC0). The artwork is
            drawn in code rather than taken from stock libraries, so there are no third-party photographs on
            the site at all.
          </p>

          <H2>What you&rsquo;ll find</H2>
          <p>
            Live multiplayer party games like <Link to="/say-anything" className="text-[#E84A8B] font-semibold underline">Say Anything</Link>,{' '}
            <Link to="/guesstimate" className="text-[#E84A8B] font-semibold underline">Guesstimate</Link> and{' '}
            <Link to="/clover" className="text-[#E84A8B] font-semibold underline">Clover Clues</Link>; a fresh puzzle
            every day in the <Link to="/daily" className="text-[#E84A8B] font-semibold underline">Daily Herd</Link>,{' '}
            <Link to="/trivia" className="text-[#E84A8B] font-semibold underline">Daily Trivia</Link> and{' '}
            <Link to="/hot-takes" className="text-[#E84A8B] font-semibold underline">Daily Hot Takes</Link>; and a
            growing shelf of <Link to="/solo-games" className="text-[#E84A8B] font-semibold underline">games to play alone</Link>.
            There are also written guides on running games for{' '}
            <Link to="/office-games" className="text-[#E84A8B] font-semibold underline">remote teams and work socials</Link>,
            and a <Link to="/blog" className="text-[#E84A8B] font-semibold underline">blog</Link>. New games are added
            regularly and existing ones are updated far more often than that.
          </p>
          <p>
            Not sure where to start?{' '}
            <Link to="/which-game-should-i-play" className="text-[#E84A8B] font-semibold underline">Answer six questions
            and we will pick one for you</Link>.
          </p>

          <H2>Money and advertising</H2>
          <p>
            The games are free and always have been, and nothing here is locked behind a payment. Running the
            servers that host the multiplayer rooms costs money, and the intention is to cover that with
            advertising rather than by charging players. Ads will never be placed inside a live game round.
            What we collect and who we share it with is set out in full in the{' '}
            <Link to="/privacy-policy" className="text-[#E84A8B] font-semibold underline">Privacy Policy</Link>.
          </p>
        </div>
      </SectionCard>

      <SectionCard accent="#FFD56B">
        <h2 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810] mb-4">Contact</h2>

        <div className="text-[#4A2D1B] space-y-4">
          <p>
            Questions, bug reports, ideas for games, business enquiries or a privacy request — all of it goes to
            the same place and is read by the person who builds the site.
          </p>

          <div>
            <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810] mb-1">Email</h3>
            <p>
              <a href="mailto:ajejey@gmail.com" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold text-lg">
                ajejey@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm">
              We usually reply within a few days. If you are reporting a bug, telling us which game and which
              browser you were using makes it far quicker to fix.
            </p>
          </div>

          <p className="text-sm">
            See also our{' '}
            <Link to="/privacy-policy" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">Privacy Policy</Link>,{' '}
            <Link to="/terms-of-service" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">Terms of Service</Link> and{' '}
            <Link to="/faq" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">FAQ</Link>.
          </p>
        </div>
      </SectionCard>
    </MeadowLayout>
  );
};

export default AboutContact;
