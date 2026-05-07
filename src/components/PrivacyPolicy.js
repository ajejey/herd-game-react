import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import MeadowLayout, { GrassStrip, fredokaStyle } from './MeadowLayout';

const H2 = ({ children }) => (
  <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#3D8B5A] mt-6 mb-3">{children}</h2>
);

const PrivacyPolicy = () => {
  return (
    <MeadowLayout>
      <Helmet>
        <title>Privacy Policy | Herd Game</title>
        <meta name="description" content="Privacy Policy for Herd Game - Learn how we collect, use, and protect your information when you play our online multiplayer game." />
      </Helmet>

      <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8">
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">Privacy Policy</h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        <div className="text-[#4A2D1B] leading-relaxed">
          <p className="text-lg">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <H2>1. Introduction</H2>
          <p>
            Welcome to Herd Game. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>

          <H2>2. Information We Collect</H2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li><strong className="text-[#2D1810]">Personal Information:</strong> Username and optional contact information if provided.</li>
            <li><strong className="text-[#2D1810]">Game Data:</strong> Information about your game sessions, scores, and in-game actions.</li>
            <li><strong className="text-[#2D1810]">Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our website.</li>
            <li><strong className="text-[#2D1810]">Usage Data:</strong> Information about how you use our website and game.</li>
          </ul>

          <H2>3. How We Use Your Information</H2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our game</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To serve relevant advertisements (if applicable)</li>
          </ul>

          <H2>4. Cookies and Tracking Technologies</H2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information.
            Cookies are files with a small amount of data which may include an anonymous unique identifier.
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <H2>5. Google AdSense</H2>
          <p>
            We use Google AdSense to serve ads on our website. Google AdSense uses cookies to serve ads based on your visit to our site and other sites on the Internet.
            You may opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
          </p>

          <H2>6. Data Security</H2>
          <p>
            We value your trust in providing us your personal information, thus we strive to use commercially acceptable means of protecting it.
            But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
          </p>

          <H2>7. Children's Privacy</H2>
          <p>
            Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
            If we discover that a child under 13 has provided us with personal information, we will delete this from our servers.
          </p>

          <H2>8. Changes to This Privacy Policy</H2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <H2>9. Contact Us</H2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:ajejey@gmail.com" className="text-[#E84A8B] hover:text-[#C73B73] font-semibold">ajejey@gmail.com</a>
          </p>
        </div>

        <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
      </div>
    </MeadowLayout>
  );
};

export default PrivacyPolicy;
