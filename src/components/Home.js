import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import { Helmet } from 'react-helmet';
import Navigation from './Navigation';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showReconnect, setShowReconnect] = useState(false);
  const [savedSession, setSavedSession] = useState(null);
  const [activeTab, setActiveTab] = useState('join');
  const { socket } = useSocket();
  const { dispatch } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('gameSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      setSavedSession(parsedSession);
      setShowReconnect(true);
      setUsername(parsedSession.username || '');
      setRoomCode(parsedSession.roomCode || '');
    }
  }, []);

  const saveGameSession = (gameId, roomCode, playerId, username) => {
    const session = { gameId, roomCode, playerId, username };
    localStorage.setItem('gameSession', JSON.stringify(session));
  };

  const handleReconnect = () => {
    if (!savedSession) return;

    socket.emit('reconnect_game', savedSession);

    socket.once('game_rejoined', (gameState) => {
      dispatch({
        type: 'GAME_REJOINED',
        payload: gameState
      });
      navigate(`/game/${savedSession.roomCode}`);
    });

    socket.once('reconnect_failed', ({ reason }) => {
      localStorage.removeItem('gameSession');
      setShowReconnect(false);
      setSavedSession(null);
      alert(`Couldn't rejoin game: ${reason}`);
    });
  };

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter a username to create a game');
      return;
    }

    setIsJoining(true);
    console.log('Attempting to create game with username:', username);

    // set username to local storage
    localStorage.setItem('username', username);

    socket.emit('create_game', { username });

    socket.once('game_created', ({ gameId, roomCode, playerId }) => {
      console.log('Game created:', { gameId, roomCode, playerId });
      saveGameSession(gameId, roomCode, playerId, username);
      dispatch({
        type: 'GAME_CREATED',
        payload: { gameId, roomCode, playerId }
      });
      navigate(`/game/${roomCode}`);
    });

    socket.once('error', ({ message }) => {
      console.error('Server error:', message);
      setIsJoining(false);
      alert(message);
    });
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!username.trim() || !roomCode.trim()) {
      alert('Please enter both username and room code');
      return;
    }

    setIsJoining(true);
    socket.emit('join_game', { username, roomCode });

    socket.once('game_joined', ({ gameId, playerId }) => {
      console.log('Game joined:', { gameId, playerId });
      saveGameSession(gameId, roomCode, playerId, username);
      dispatch({
        type: 'GAME_JOINED',
        payload: { gameId, playerId }
      });
      navigate(`/game/${roomCode}`);
    });

    socket.once('error', ({ message }) => {
      setIsJoining(false);
      alert(message);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Navigation Bar */}
      {/* <nav className="bg-white bg-opacity-10 backdrop-blur-sm py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center text-white font-bold text-xl">
            Herd Game
          </div>
          <div className="flex space-x-4 text-white text-sm md:text-base">
            <Link to="/" className="hover:text-purple-200 transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-purple-200 transition-colors">Blog</Link>
            <Link to="/faq" className="hover:text-purple-200 transition-colors">FAQ</Link>
            <Link to="/about-contact" className="hover:text-purple-200 transition-colors">About</Link>
          </div>
        </div>
      </nav> */}
      <Navigation />
      <Helmet>
        <title>Herd Board Game - Play Online | Think Like The Herd</title>
        <meta name="description" content="Play Herd Mentality board game online - the ultimate social party game where you think like the herd to win cows! Perfect for game nights, family gatherings, team building, birthday parties, and social events. Easy to join, unlimited players!" />
        <meta name="keywords" content="Herd Mentality, Herd Mentality board game, Herd Mentality game, board games, party games, family game night, team building, social games, multiplayer games, virtual hangouts, quiz games, ice breaker games, group activities, online party, game night ideas, birthday party games, team bonding, virtual events, think like the herd, Pink Cow, cow rustlers" />
        <meta property="og:title" content="Herd Game - The Ultimate Party Game for Everyone" />
        <meta property="og:description" content="The perfect game for any group! Great for parties, family nights, team building, and social events. Join instantly and play with unlimited players!" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Herd Game - Online Party Game for All Occasions" />
        <meta name="twitter:description" content="Looking for the perfect group game? Herd Game is great for parties, family fun, team events, and social gatherings. No player limit!" />
        <link rel="canonical" href="https://herdgame.vercel.app" />
        <meta name="google-site-verification" content="7nItEeuNSAIFL_unU4Ai5p-SGizDDaJU8XRYEKdtOgk" />
      </Helmet>

      <div className="container mx-auto px-4 py-6 md:py-12 max-w-lg md:max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-fade-in">
            🐄 Herd Game
          </h1>
          <p className="text-lg md:text-xl text-white opacity-90">
            Think like the herd to win!
          </p>
        </header>

        {/* Game Join Section */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-200">
              <button
                onClick={() => setActiveTab('join')}
                className={`px-4 py-2 rounded-l-lg ${
                  activeTab === 'join'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Join Game
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-r-lg ${
                  activeTab === 'create'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Create Game
              </button>
            </div>
          </div>

          {showReconnect && savedSession && (
            <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Rejoin Previous Game?
              </h3>
              <p className="text-sm text-purple-600 mb-4">
                You have an active game session as {savedSession.username}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReconnect}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Rejoin Game
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('gameSession');
                    setShowReconnect(false);
                    setSavedSession(null);
                  }}
                  className="flex-1 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Start New Game
                </button>
              </div>
            </div>
          )}

          <form 
            onSubmit={activeTab === 'join' ? handleJoinGame : handleCreateGame}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>

            {activeTab === 'join' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter room code"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isJoining}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
            >
              {isJoining ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {activeTab === 'join' ? 'Joining...' : 'Creating...'}
                </span>
              ) : (
                <span>{activeTab === 'join' ? 'Join Game' : 'Create New Game'}</span>
              )}
            </button>
          </form>
        </div>

        {/* Game Instructions - Always visible */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">How to Play Herd Game Online</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold text-purple-600">🎯 Objective</h3>
              <p className="text-gray-700">Think like the herd! Match your answers with other players to score points</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-semibold text-purple-600">🎮 How the Game Works</h3>
              <div className="space-y-4">
                <div className="pl-4 border-l-4 border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-2">1. Starting the Game</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>One player creates a game and shares the room code</li>
                    <li>Other players join using the room code</li>
                    <li>Game begins when host clicks "Start Game"</li>
                  </ul>
                </div>

                <div className="pl-4 border-l-4 border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-2">2. Playing Each Round</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Everyone sees the same fun question (e.g., "What's the best pizza topping?")</li>
                    <li>Players have 30 seconds to submit their answer</li>
                    <li>After everyone answers, all responses are revealed</li>
                    <li>Players who matched the most common answer get a point</li>
                  </ul>
                </div>

                <div className="pl-4 border-l-4 border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-2">3. Special Marker</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>The player with the most unique answer gets the special marker 🐄</li>
                    <li>You can't win the game while holding the marker</li>
                    <li>Pass it to someone else by matching answers with the group</li>
                  </ul>
                </div>

                <div className="pl-4 border-l-4 border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-2">4. Winning the Game</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>First player to reach 8 points wins</li>
                    <li>But remember: you can't win with the special marker!</li>
                    <li>Game continues until someone without the marker reaches 8 points</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold text-purple-600">👥 Perfect For</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Friends & Family</li>
                <li>Virtual Game Nights</li>
                <li>Team Building</li>
                <li>Office Games</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Featured Content Section */}
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 md:p-8 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Featured Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">5 Tips for Hosting the Perfect Virtual Game Night</h3>
              <p className="text-gray-700 mb-3">Learn how to host an engaging and fun virtual game night with friends and family using Herd Game.</p>
              <Link to="/blog" className="text-purple-600 hover:text-purple-800 font-medium">Read More →</Link>
            </div>
            
            <div className="bg-purple-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">The Psychology Behind Herd Game</h3>
              <p className="text-gray-700 mb-3">Discover why we enjoy thinking like others and the social science behind the game's mechanics.</p>
              <Link to="/blog" className="text-purple-600 hover:text-purple-800 font-medium">Read More →</Link>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/blog" className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View All Articles
            </Link>
          </div>
        </div>
        
        <footer className="text-center mt-8 text-white opacity-90 text-sm">
          <p>&copy; {new Date().getFullYear()} Herd Game. A social party game for everyone.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/privacy-policy" className="text-white hover:text-purple-200 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-white hover:text-purple-200 transition-colors">Terms of Service</Link>
            <Link to="/about-contact" className="text-white hover:text-purple-200 transition-colors">About Us / Contact</Link>
            <Link to="/faq" className="text-white hover:text-purple-200 transition-colors">FAQ</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
