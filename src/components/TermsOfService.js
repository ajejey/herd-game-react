import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <Helmet>
        <title>Terms of Service | Herd Game</title>
        <meta name="description" content="Terms of Service for Herd Game - Read our terms and conditions for using our online multiplayer game." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
          <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
            Return Home
          </Link>
        </div>
        
        <div className="prose max-w-none text-gray-700">
          <p className="text-lg">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Herd Game website and online game ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you disagree with any part of the terms, you may not access the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. Description of Service</h2>
          <p>
            Herd Game is an online multiplayer game where players answer questions and try to match answers with other players. 
            The Service may include features such as game rooms, chat functionality, and user profiles.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. User Accounts</h2>
          <p>
            When you create a game or join a game, you may be asked to provide certain information such as a username. 
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. User Conduct</h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Impersonate any person or entity</li>
            <li>Engage in any activity that interferes with or disrupts the Service</li>
            <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Use the Service for any commercial purpose without our express written consent</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Herd Game and its licensors. 
            The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. 
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. User-Generated Content</h2>
          <p>
            Users may generate content such as game answers and chat messages. By submitting content to the Service, you grant us a worldwide, non-exclusive, 
            royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">7. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, 
            including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">8. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. 
            The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, 
            fitness for a particular purpose, non-infringement or course of performance.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">9. Limitation of Liability</h2>
          <p>
            In no event shall Herd Game, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, 
            consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
            resulting from your access to or use of or inability to access or use the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">10. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Country/State], 
            without regard to its conflict of law provisions.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">11. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. 
            What constitutes a material change will be determined at our sole discretion.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: <a href="mailto:ajejey@gmail.com" className="text-purple-600 hover:text-purple-800">ajejey@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
