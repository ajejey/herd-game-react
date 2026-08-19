import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import MeadowLayout, { GrassStrip, fredokaStyle } from './MeadowLayout';

/*
  Privacy Policy.

  Written to describe what this site ACTUALLY does, not from a template. The
  previous version claimed "We use Google AdSense to serve ads" — which stopped
  being true in July 2026 when AdSense was removed (see AdSlot.js). An
  inaccurate disclosure is worse than a thin one, and it also read as a
  competing ad network to any reviewer.

  If the data we collect changes, THIS FILE MUST CHANGE TOO. The specifics
  below were taken from: lib/pingEvent.js (completion beacons), lib/reportError.js
  (error reports), the localStorage keys used across the games, and the
  daily_events / analytics_events collections in the backend.

  Covers the Android app as well as the site, which Google Play requires. The
  app's footprint is genuinely SMALLER than the website's, and the difference is
  load-bearing for the Play Data safety form:
    - gtag and the Grow/Mediavine script in public/index.html are both guarded on
      location.hostname, and the app's WebView origin is https://localhost. So
      NEITHER Google Analytics NOR any advertising runs in the app.
    - pingEvent.js, reportError.js and useGameStats.js are NOT guarded, so those
      do run there.
    - lib/analytics.js (PostHog) is guarded on hostname OR Capacitor native, so
      unlike gtag it DOES run in the app. This is the one place where the app's
      footprint is not smaller than the website's, which is why section 6 states
      it outright instead of leaving a reader to infer it from silence. It also
      means the Play Data safety form must declare product analytics and session
      replay for the app, not only for the site.
  Re-check those guards before changing this section.
*/

const H2 = ({ children }) => (
  <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#3D8B5A] mt-6 mb-3">{children}</h2>
);

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">{children}</a>
);

const PrivacyPolicy = () => {
  return (
    <MeadowLayout>
      <Helmet>
        <title>Privacy Policy | Herd Game</title>
        <meta name="description" content="Privacy Policy for Herd Game — what we collect, who we share it with, our advertising and analytics partners, and how to exercise your GDPR and CCPA rights." />
        <link rel="canonical" href="https://herdgamesonline.com/privacy-policy" />
      </Helmet>

      <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8">
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">Privacy Policy</h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        <div className="text-[#4A2D1B] leading-relaxed">
          <p className="text-lg">Last updated: 19 August 2026</p>

          <p className="mt-3">
            Herd Game (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates <strong className="text-[#2D1810]">herdgamesonline.com</strong>{' '}
            and the <strong className="text-[#2D1810]">Herd Games Android app</strong>.
            This policy explains what we collect, why, who we share it with, and the choices you have. It is
            written to be read rather than skimmed, because most of the answer is short:
            <strong className="text-[#2D1810]"> you do not need an account to play anything here, and we do not ask you for personal
            details in order to play.</strong>
          </p>

          <H2>1. The short version</H2>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>No signup, no account and no password is required to play any game, on the site or in the app.</li>
            <li>Your high scores and streaks are saved <strong className="text-[#2D1810]">on your own device</strong>, not on our servers.</li>
            <li>We record anonymous &ldquo;a game was finished&rdquo; events so we know which games people enjoy.</li>
            <li>We use analytics and advertising partners, described in section 5. Our advertising partner sets cookies; our analytics partner uses local storage rather than cookies.</li>
            <li>
              <strong className="text-[#2D1810]">The Android app shows no advertising and runs no Google Analytics.</strong>{' '}
              It does use PostHog for product analytics, including session replay when you create or join a
              multiplayer room — section 6.
            </li>
            <li>
              <strong className="text-[#2D1810]">If you create or join a multiplayer room, we record that visit</strong>{' '}
              — the pages, clicks and scrolling — so we can see where people get stuck starting a game. Text you
              type is masked. We do not record general browsing. Section 5.
            </li>
            <li>You can clear everything we store on your device at any time by clearing your browser data, or by clearing the app&rsquo;s storage.</li>
          </ul>

          <H2>2. Information you give us directly</H2>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li><strong className="text-[#2D1810]">A display name.</strong> To join a multiplayer room you type a name. It is shown to the other players in that room and is not required to be your real name. It is kept only for the life of the game room.</li>
            <li><strong className="text-[#2D1810]">Answers you type during a game.</strong> In games like Say Anything or Scattergories, what you write is shown to the other players in your room, which is the point of the game. Please do not type anything private.</li>
            <li><strong className="text-[#2D1810]">Your email address, only if you choose to give it.</strong> If you join a waiting list or email us, we keep your address to reply to you or to contact you about that specific thing. We do not sell it, and we do not add you to unrelated mailing lists.</li>
          </ul>

          <H2>3. Information collected automatically</H2>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>
              <strong className="text-[#2D1810]">An anonymous device identifier.</strong> A random string
              (for example <code className="bg-[#FFF8E7] px-1 rounded">a_k3f9x2</code>) is generated in your browser and stored
              on your device. It is not linked to your name, email or any account, and it exists so a daily
              puzzle knows you have already played today and so we can count players rather than page loads.
            </li>
            <li>
              <strong className="text-[#2D1810]">Game completion events.</strong> When you finish a game we send
              the game&rsquo;s name, your score, whether you won, and that anonymous identifier to our server.
              Our server also records the IP address the request came from, and the time.
            </li>
            <li>
              <strong className="text-[#2D1810]">Error reports.</strong> If something breaks, your browser sends us
              the error message and a technical stack trace so we can fix it. These do not contain your
              personal details.
            </li>
            <li>
              <strong className="text-[#2D1810]">Standard technical data.</strong> IP address, browser type and version,
              device type, operating system, language, referring page and the pages you view — the usual
              information any web server and analytics tool receives.
            </li>
            <li>
              <strong className="text-[#2D1810]">A notification token, in the app only, and only if you ask for
              notifications.</strong> If a future version of the app offers notifications that we send (rather
              than reminders your own phone schedules), turning them on creates an anonymous token issued by
              Google that lets us deliver a message to that installation. It is not linked to your name or
              email, and it stops working if you turn notifications off or uninstall the app.
            </li>
          </ul>

          <H2>4. Information stored on your device (not sent to us)</H2>
          <p>
            Your best scores, streaks and daily progress are kept in your browser&rsquo;s local storage — for example
            your best typing speed, your Minesweeper time or your daily streak. This data never leaves your
            device, we cannot read it, and it is the reason your scores are lost if you clear your browser data
            or switch to another device or browser.
          </p>

          <H2>5. Advertising, analytics and other third parties</H2>
          <p>
            <strong className="text-[#2D1810]">Advertising applies to the website only.</strong> The Android app serves no
            advertising and does not run Google Analytics. It does run PostHog, described below. See section 6.
          </p>
          <p className="mt-2">We work with the following third parties. Each has its own privacy policy, linked below.</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
            <li>
              <strong className="text-[#2D1810]">Journey by Mediavine (advertising and audience measurement).</strong>{' '}
              We use Mediavine&rsquo;s Grow software, and Mediavine manages advertising on this site. Mediavine and
              its advertising partners may use cookies and similar technologies to collect data about your
              browsing in order to measure audiences and to select and deliver advertising, including
              personalised advertising where you have consented or where it is otherwise permitted. See the{' '}
              <A href="https://www.mediavine.com/privacy-policy/">Mediavine Privacy Policy</A>.
            </li>
            <li>
              <strong className="text-[#2D1810]">Google Analytics.</strong> We use Google Analytics 4 to understand which
              pages and games people use, in aggregate. See{' '}
              <A href="https://policies.google.com/privacy">Google&rsquo;s Privacy Policy</A> and{' '}
              <A href="https://tools.google.com/dlpage/gaoptout">Google&rsquo;s opt-out browser add-on</A>.
            </li>
            <li>
              <strong className="text-[#2D1810]">PostHog (product analytics and session replay).</strong> We use PostHog to
              understand how games are actually used &mdash; which are played, whether people come back, and where they
              get stuck. It stores a random identifier in your browser&rsquo;s local storage; it sets no cookies, and that
              identifier is not linked to your name or email.
              <br />
              <strong className="text-[#2D1810]">Session replay:</strong> if you create or join a multiplayer room, PostHog
              records a reconstruction of that visit &mdash; the pages, clicks and scrolling &mdash; so we can see where
              people get stuck trying to start a game. We turn recording on only for that flow, not for general browsing.
              Text you type into input boxes is masked and is not captured. Recordings are deleted automatically after a
              short retention period. This runs in the Android app as well as on the website. See the{' '}
              <A href="https://posthog.com/privacy">PostHog Privacy Policy</A>.
            </li>
            <li>
              <strong className="text-[#2D1810]">Hosting and infrastructure providers</strong>, who process requests to
              the site and necessarily see IP addresses in order to deliver it.
            </li>
          </ul>
          <p>
            <strong className="text-[#2D1810]">We do not use Google AdSense.</strong> It was previously used on this site and
            was removed in July 2026. We do not sell your personal information for money.
          </p>

          <H2>6. The Herd Games Android app</H2>
          <p>
            The app is the same games, packaged for Android and distributed through Google Play. Everything
            above about display names, answers you type, anonymous completion events and error reports applies
            in the app too. The differences are all reductions:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
            <li>
              <strong className="text-[#2D1810]">No advertising.</strong> The app contains no ad code at all. Our
              advertising partner&rsquo;s software runs only on herdgamesonline.com and is switched off everywhere else.
            </li>
            <li>
              <strong className="text-[#2D1810]">No Google Analytics.</strong> For the same reason, Google Analytics does
              not run in the app.
            </li>
            <li>
              <strong className="text-[#2D1810]">PostHog does run in the app.</strong> This is the one item in this section
              that is not a reduction, so it is stated plainly rather than left to be inferred. The app uses PostHog for
              the same purpose as the website &mdash; understanding which games are played and where people get stuck &mdash;
              including session replay when you create or join a multiplayer room. Text you type is masked. See section 5.
            </li>
            <li>
              <strong className="text-[#2D1810]">Daily reminders are scheduled by your own phone.</strong> If you turn on
              the daily reminder, Android schedules it locally on your device. No reminder is sent from our
              servers, we are not told when it fires, and it works with no internet connection. Turning it off,
              or denying the notification permission, stops it completely.
            </li>
            <li>
              <strong className="text-[#2D1810]">Permissions.</strong> The app asks only for notification permission, and
              only at the moment you switch reminders on. You can refuse, and every game still works. It does
              not request contacts, location, camera, microphone, photos or files.
            </li>
            <li>
              <strong className="text-[#2D1810]">Your scores stay on the device</strong>, in the app&rsquo;s own storage. Clearing
              the app&rsquo;s data or uninstalling it removes them, and they are not synced to us or to another device.
            </li>
          </ul>
          <p>
            Google Play also collects its own data about installs and crashes under{' '}
            <A href="https://policies.google.com/privacy">Google&rsquo;s Privacy Policy</A>, which we do not control.
          </p>

          <H2>7. Cookies and similar technologies</H2>
          <p>
            Cookies are small files stored by your browser. We and the partners above use them, and comparable
            technologies such as local storage, to remember your progress, to measure how the site is used, and
            to deliver and measure advertising. You can refuse or delete cookies in your browser settings;
            games will still work, though your streaks and scores will not be remembered. Where required by
            law, we ask for your consent before non-essential cookies are set, and you can change or withdraw
            that consent at any time using the privacy controls provided on the site by our advertising partner.
          </p>

          <H2>8. Your rights in the EEA and UK (GDPR)</H2>
          <p>
            If you are in the European Economic Area or the United Kingdom, you have the right to access,
            correct, delete, restrict or object to our use of your personal data, the right to data portability,
            and the right to withdraw consent at any time. Where we rely on consent — principally for
            non-essential cookies and personalised advertising — you may withdraw it without affecting anything
            done beforehand. Our lawful bases are your consent, and our legitimate interest in running,
            securing and improving a free website. You also have the right to complain to your local data
            protection authority.
          </p>

          <H2>9. Your rights in California and other US states (CCPA/CPRA)</H2>
          <p>
            If you are a California resident, you have the right to know what personal information is collected
            and how it is used, to request deletion, to correct inaccurate information, and to opt out of the
            &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information for cross-context behavioural advertising. We do not
            sell personal information for money. However, the use of advertising cookies described in section 5
            may be treated as &ldquo;sharing&rdquo; under California law.
          </p>
          <p className="mt-2">
            <strong className="text-[#2D1810]">To exercise the right to opt out — &ldquo;Do Not Sell or Share My Personal
            Information&rdquo;</strong> — use the privacy settings link provided on this site by our advertising
            partner, or email us at{' '}
            <a href="mailto:hello@herdgamesonline.com?subject=Do%20Not%20Sell%20or%20Share%20My%20Personal%20Information" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">hello@herdgamesonline.com</a>{' '}
            with the subject &ldquo;Do Not Sell or Share My Personal Information&rdquo;. We will not discriminate against
            you for exercising any of these rights. Residents of other US states with similar laws have
            comparable rights and may use the same contact.
          </p>

          <H2>10. Children&rsquo;s privacy</H2>
          <p>
            The site and the app are intended for a general audience and are not directed at children under 13.
            The app is rated and distributed accordingly on Google Play, and is not part of the Google Play
            Families programme. We do not knowingly collect personal information from children under 13. If you
            believe a child has provided us with personal information, email us and we will delete it.
          </p>

          <H2>11. How long we keep things</H2>
          <p>
            Multiplayer game rooms and the names in them are deleted shortly after the game ends. Anonymous
            completion events and error reports are kept while they remain useful for understanding and fixing
            the site. Email addresses you have given us are kept until you ask us to remove them. Scores held
            on your own device stay there until you clear your browser data.
          </p>

          <H2>12. Security</H2>
          <p>
            The site and the app communicate with our servers over HTTPS, and we take reasonable measures to
            protect the limited data we hold.
            No method of transmission or storage is completely secure, and we cannot guarantee absolute
            security. Because we deliberately collect very little, there is very little to lose.
          </p>

          <H2>13. Changes to this policy</H2>
          <p>
            We may update this policy. Material changes will be reflected here with a new &ldquo;last updated&rdquo; date
            above. Continued use of the site or the app after a change means you accept the updated policy.
          </p>

          <H2>14. Contact</H2>
          <p>
            Questions, requests or complaints about privacy — including any request to access or delete your
            data — can be sent to{' '}
            <a href="mailto:hello@herdgamesonline.com" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">hello@herdgamesonline.com</a>.
            We aim to reply within a few days. See also our{' '}
            <Link to="/terms-of-service" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">Terms of Service</Link> and{' '}
            <Link to="/about-contact" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">About page</Link>.
          </p>
        </div>

        <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
      </div>
    </MeadowLayout>
  );
};

export default PrivacyPolicy;
