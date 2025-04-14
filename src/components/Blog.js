import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PostOne from './blogPosts/PostOne';
import PostTwo from './blogPosts/PostTwo';
import PostThree from './blogPosts/PostThree';
import Navigation from './Navigation';
import PostFour from './blogPosts/PostFour';
import PostFive from './blogPosts/PostFive';
import PostSix from './blogPosts/PostSix';
import PostSeven from './blogPosts/PostSeven';
import PostEight from './blogPosts/PostEight';

const Blog = () => {
  // Array of blog post components and their metadata
  const blogPosts = [
    {
      id: '1',
      component: PostOne,
      title: 'The Psychology Behind Herd Mentality Games',
      excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.',
      date: 'January 15, 2025',
    },
    {
      id: '2',
      component: PostTwo,
      title: 'Hosting the Perfect Game Night with Herd Game',
      excerpt: 'Tips and tricks for organizing an unforgettable game night with friends and family.',
      date: 'February 22, 2025',
    },
    {
      id: '3',
      component: PostThree,
      title: 'Herd Game for Team Building: How Companies Are Using It',
      excerpt: 'Discover how businesses are utilizing Herd Game to improve team dynamics and communication.',
      date: 'March 28, 2025',
    },
    {
      id: '4',
      component: PostFour,
      title: 'What Your Herd Game Answers Say About You (Totally Scientific)',
      excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.',
      date: 'April 15, 2025',
    },
    {
      id: '5',
      component: PostFive,
      title: 'The Secret History of Herd Mentality (And Why You’d Probably Follow a Goat if Everyone Else Did)',
      excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.',
      date: 'April 15, 2025',
    },
    {
      id: '6',
      component: PostSix,
      title: 'How to Be the Most Average Person in the Room (and Win the Game Doing It)',
      excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.',
      date: 'May 2, 2025',
    },
    {
      id: '7',
      component: PostSeven,
      title: 'From Chaos to Consensus: Why the Funniest Part of the Herd Game is the Debate After',
      excerpt: 'Explore the fascinating psychology of why thinking like the group is so engaging in party games.',
      date: 'April 14, 2025',
    },
    {
      id: '8',
      component: PostEight,
      title: 'How to Host the Ultimate Herd Game Night (Without Lifting a Finger)',
      excerpt: 'Learn how to host a Herd Game night that\'s fun, hilarious, and easy to organize.',
      date: 'April 15, 2025',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <Helmet>
        <title>Herd Game Blog - Tips, Strategies & Game Night Ideas</title>
        <meta name="description" content="Explore our blog for tips on hosting game nights, strategies for winning Herd Game, and ideas for making your multiplayer sessions more fun!" />
      </Helmet>
      <Navigation />
      
      <div className="max-w-4xl mt-12 mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8 mb-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Herd Game Blog</h1>
            <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
              Return Home
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="block">
                <div className="bg-purple-50 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 h-full">
                  <h2 className="text-xl font-semibold text-purple-800 mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <span className="text-purple-600 hover:text-purple-800 font-medium">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
