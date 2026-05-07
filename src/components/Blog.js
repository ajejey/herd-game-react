import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PostOne from './blogPosts/PostOne';
import PostTwo from './blogPosts/PostTwo';
import PostThree from './blogPosts/PostThree';
import PostFour from './blogPosts/PostFour';
import PostFive from './blogPosts/PostFive';
import PostSix from './blogPosts/PostSix';
import PostSeven from './blogPosts/PostSeven';
import PostEight from './blogPosts/PostEight';
import MeadowLayout, { GrassStrip, fredokaStyle } from './MeadowLayout';

const Blog = () => {
  const blogPosts = [
    { id: '1', component: PostOne, title: 'The Psychology Behind Herd Mentality Games', excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.', date: 'January 15, 2025' },
    { id: '2', component: PostTwo, title: 'Hosting the Perfect Game Night with Herd Game', excerpt: 'Tips and tricks for organizing an unforgettable game night with friends and family.', date: 'February 22, 2025' },
    { id: '3', component: PostThree, title: 'Herd Game for Team Building: How Companies Are Using It', excerpt: 'Discover how businesses are utilizing Herd Game to improve team dynamics and communication.', date: 'March 28, 2025' },
    { id: '4', component: PostFour, title: 'What Your Herd Game Answers Say About You (Totally Scientific)', excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.', date: 'April 15, 2025' },
    { id: '5', component: PostFive, title: 'The Secret History of Herd Mentality (And Why You’d Probably Follow a Goat if Everyone Else Did)', excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.', date: 'April 15, 2025' },
    { id: '6', component: PostSix, title: 'How to Be the Most Average Person in the Room (and Win the Game Doing It)', excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.', date: 'May 2, 2025' },
    { id: '7', component: PostSeven, title: 'From Chaos to Consensus: Why the Funniest Part of the Herd Game is the Debate After', excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.', date: 'April 14, 2025' },
    { id: '8', component: PostEight, title: 'How to Host the Ultimate Herd Game Night (Without Lifting a Finger)', excerpt: "Learn how to host a Herd Game night that's fun, hilarious, and easy to organize.", date: 'April 15, 2025' }
  ];

  // Alternating polaroid colors + tilts to feel hand-pinned
  const cardThemes = [
    { bg: '#FFFBE8', rotate: '-1.5deg' },
    { bg: '#F2F9FF', rotate: '1.5deg' },
    { bg: '#FFF1F4', rotate: '-1deg' },
    { bg: '#F4FBF6', rotate: '1deg' }
  ];

  return (
    <MeadowLayout>
      <Helmet>
        <title>Herd Game Blog - Tips, Strategies & Game Night Ideas</title>
        <meta name="description" content="Explore our blog for tips on hosting game nights, strategies for winning Herd Game, and ideas for making your multiplayer sessions more fun!" />
      </Helmet>

      <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8">
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">
            From the meadow blog
          </h1>
          <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">
            &larr; Return Home
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {blogPosts.map((post, i) => {
            const t = cardThemes[i % cardThemes.length];
            return (
              <Link to={`/blog/${post.id}`} key={post.id} className="block">
                <div
                  className="relative h-full p-5 pt-6 rounded-md border border-[#E8DFC9] shadow-[0_10px_25px_-12px_rgba(45,24,16,0.4)] transition-transform hover:rotate-0 hover:-translate-y-1"
                  style={{ background: t.bg, transform: `rotate(${t.rotate})` }}
                >
                  <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-2">{post.title}</h2>
                  <p className="text-xs text-[#A89A78] mb-3">{post.date}</p>
                  <p className="text-[#4A2D1B] mb-4">{post.excerpt}</p>
                  <span className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold">Read more &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>

        <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
      </div>
    </MeadowLayout>
  );
};

export default Blog;
