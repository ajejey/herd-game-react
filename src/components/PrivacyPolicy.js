import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <Helmet>
        <title>Privacy Policy | Herd Game</title>
        <meta name="description" content="Privacy Policy for Herd Game - Learn how we collect, use, and protect your information when you play our online multiplayer game." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
          <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
            Return Home
          </Link>
        </div>
        
        <div className="prose max-w-none text-gray-700">
          <p className="text-lg">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">1. Introduction</h2>
          <p>
            Welcome to Herd Game. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li><strong>Personal Information:</strong> Username and optional contact information if provided.</li>
            <li><strong>Game Data:</strong> Information about your game sessions, scores, and in-game actions.</li>
            <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our website.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website and game.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">3. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our game</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To serve relevant advertisements (if applicable)</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
            Cookies are files with a small amount of data which may include an anonymous unique identifier. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">5. Google AdSense</h2>
          <p>
            We use Google AdSense to serve ads on our website. Google AdSense uses cookies to serve ads based on your visit to our site and other sites on the Internet. 
            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-purple-600 hover:text-purple-800" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">6. Data Security</h2>
          <p>
            We value your trust in providing us your personal information, thus we strive to use commercially acceptable means of protecting it. 
            But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">7. Children's Privacy</h2>
          <p>
            Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. 
            If we discover that a child under 13 has provided us with personal information, we will delete this from our servers.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. 
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:ajejey@gmail.com" className="text-purple-600 hover:text-purple-800">ajejey@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
