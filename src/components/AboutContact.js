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
      </Helmet>

      <SectionCard>
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">About Us</h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">&larr; Return Home</Link>
        </div>

        <div className="text-[#4A2D1B] space-y-4">
          <p className="text-lg">
            Welcome to Herd Game, the online multiplayer game where thinking like the herd is the key to victory!
          </p>

          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#3D8B5A] mt-6">Our Story</h2>
          <p>
            Herd Game was created by a small team of passionate game developers who wanted to bring the fun of party games to the online world.
            Inspired by popular board games where players try to match answers with others, we developed a digital version that allows friends
            to play together no matter where they are located.
          </p>

          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#3D8B5A] mt-6">Our Mission</h2>
          <p>
            Our mission is to create engaging, accessible games that bring people together. We believe that games have the power to
            strengthen relationships, spark conversations, and create memorable moments. With Herd Game, we aim to provide a platform
            for friends, family, and even strangers to connect and have fun together.
          </p>

          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#3D8B5A] mt-6">The Team</h2>
          <p>
            Behind Herd Game is a dedicated team of developers, designers, and game enthusiasts who are committed to creating the best
            possible experience for our players. We're constantly working on improving the game, adding new features, and ensuring
            that Herd Game remains a fun and safe space for everyone.
          </p>
        </div>
      </SectionCard>

      <SectionCard accent="#FFD56B">
        <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810] mb-6">Contact Us</h1>

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
