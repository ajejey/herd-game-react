import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import MeadowLayout, { GrassStrip, fredokaStyle } from './MeadowLayout';

const H2 = ({ children }) => (
  <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#3D8B5A] mt-6 mb-3">{children}</h2>
);

const TermsOfService = () => {
  return (
    <MeadowLayout>
      <Helmet>
        <title>Terms of Service | Herd Game</title>
        <meta name="description" content="Terms of Service for Herd Game — the terms for using our free party, solo and daily games on herdgamesonline.com and in the Herd Games Android app." />
      </Helmet>

      <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8">
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">Terms of Service</h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        <div className="text-[#4A2D1B] leading-relaxed">
          {/* Hardcoded, not new Date(). Rendering today's date made the terms
              claim to have been revised every single day, which is misleading in
              a legal document and told a reader nothing about when the terms
              actually last changed. Update this by hand when they do. */}
          <p className="text-lg">Last updated: 5 August 2026</p>

          <H2>1. Acceptance of Terms</H2>
          <p>
            By accessing or using the Herd Game website at herdgamesonline.com, or the Herd Games Android app
            (together, the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
            If you disagree with any part of the Terms, you may not use the Service.
          </p>

          <H2>2. Description of Service</H2>
          <p>
            Herd Game is a free collection of party, team and puzzle games. It includes multiplayer games played
            with friends in a shared room, single-player games you play on your own, and daily puzzles that
            change every day. The Service is provided in two forms: a website that needs no download, and an
            Android app distributed through Google Play.
          </p>
          <p className="mt-2">
            The app contains the same games as the website. It shows no advertising, offers no in-app purchases
            and has no subscription. It may ask for permission to show notifications, purely so it can remind you
            when the day&rsquo;s new games are ready; you can refuse, and every game still works. Updates are
            delivered through Google Play, and your use of the app is also subject to Google Play&rsquo;s own terms.
          </p>
          <p className="mt-2">
            We may add, change or remove games at any time. Because the games are free, we do not promise that
            any particular game will remain available.
          </p>

          <H2>3. No accounts</H2>
          <p>
            There are no user accounts, and there is nothing to sign up for. To join a multiplayer room you type
            a display name, which is shown to the other players in that room and is kept only for the life of
            that room. It does not need to be your real name. Because there is no account, there is no password
            to protect and nothing for you to keep confidential &mdash; but you remain responsible for what you
            type and share while using the Service.
          </p>

          <H2>4. User Conduct</H2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>Violate any applicable laws or regulations</li>
            <li>Impersonate any person or entity</li>
            <li>Engage in any activity that interferes with or disrupts the Service</li>
            <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Use the Service for any commercial purpose without our express written consent</li>
          </ul>

          <H2>5. Intellectual Property</H2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Herd Game and its licensors.
            The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent.
          </p>

          <H2>6. User-Generated Content</H2>
          <p>
            During a game you type things: a display name, and answers or clues that are shown to the other
            players in your room. That is the whole of the user-generated content here &mdash; there is no public
            profile, no comment section and no way to publish anything to other users outside your own game room.
            By submitting content you grant us a worldwide, non-exclusive, royalty-free licence to use it for the
            purpose of operating and improving the Service.
          </p>
          <p className="mt-2">
            Please do not type anything private, and do not submit content that is unlawful, hateful, harassing
            or obscene. Content is not stored beyond the life of the game room it was typed in.
          </p>

          <H2>7. Termination</H2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination.
          </p>

          <H2>8. Disclaimer</H2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
            The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability,
            fitness for a particular purpose, non-infringement or course of performance.
          </p>

          <H2>9. Limitation of Liability</H2>
          <p>
            In no event shall Herd Game, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special,
            consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
            resulting from your access to or use of or inability to access or use the Service.
          </p>

          <H2>10. Governing Law</H2>
          {/* TODO(ajey): name the actual jurisdiction here. This previously read
              "the laws of [Your Country/State]" — an unfilled template
              placeholder, live on a public legal page. Removed rather than
              guessed at, because naming the wrong jurisdiction is worse than
              naming none. Replace the sentence below once you decide. */}
          <p>
            These Terms are governed by the laws applicable where Herd Game is operated, without regard to
            conflict of law provisions. Nothing in these Terms removes any consumer protection rights you have
            under the law of the country you live in.
          </p>

          <H2>11. Changes to Terms</H2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole discretion.
          </p>

          <H2>12. Contact Us</H2>
          <p>
            If you have any questions about these Terms, please contact us at:{' '}
            <a href="mailto:ajejey@gmail.com" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">ajejey@gmail.com</a>
          </p>
        </div>

        <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
      </div>
    </MeadowLayout>
  );
};

export default TermsOfService;
