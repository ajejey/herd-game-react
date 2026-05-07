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
        <meta name="description" content="Terms of Service for Herd Game - Read our terms and conditions for using our online multiplayer game." />
      </Helmet>

      <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8">
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">Terms of Service</h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        <div className="text-[#4A2D1B] leading-relaxed">
          <p className="text-lg">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <H2>1. Acceptance of Terms</H2>
          <p>
            By accessing or using the Herd Game website and online game ("Service"), you agree to be bound by these Terms of Service ("Terms").
            If you disagree with any part of the terms, you may not access the Service.
          </p>

          <H2>2. Description of Service</H2>
          <p>
            Herd Game is an online multiplayer game where players answer questions and try to match answers with other players.
            The Service may include features such as game rooms, chat functionality, and user profiles.
          </p>

          <H2>3. User Accounts</H2>
          <p>
            When you create a game or join a game, you may be asked to provide certain information such as a username.
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
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
            Users may generate content such as game answers and chat messages. By submitting content to the Service, you grant us a worldwide, non-exclusive,
            royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
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
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Country/State],
            without regard to its conflict of law provisions.
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
