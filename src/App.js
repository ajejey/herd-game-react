import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext';
import Home from './components/Home';
import GameRoom from './components/GameRoom';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutContact from './components/AboutContact';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import PostOne from './components/blogPosts/PostOne';
import PostTwo from './components/blogPosts/PostTwo';
import PostThree from './components/blogPosts/PostThree';
import PostFour from './components/blogPosts/PostFour';
import PostFive from './components/blogPosts/PostFive';
import PostSix from './components/blogPosts/PostSix';
import PostSeven from './components/blogPosts/PostSeven';
import PostEight from './components/blogPosts/PostEight';

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:roomCode" element={<GameRoom />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about-contact" element={<AboutContact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/1" element={<PostOne />} />
              <Route path="/blog/2" element={<PostTwo />} />
              <Route path="/blog/3" element={<PostThree />} />
              <Route path="/blog/4" element={<PostFour />} />
              <Route path="/blog/5" element={<PostFive />} />
              <Route path="/blog/6" element={<PostSix />} />
              <Route path="/blog/7" element={<PostSeven />} />
              <Route path="/blog/8" element={<PostEight />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </SocketProvider>
  );
}

export default App;
