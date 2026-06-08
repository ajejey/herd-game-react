import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import { Helmet } from 'react-helmet';
import Navigation from './Navigation';
import AdSlot from './AdSlot';
import RemotePlayNotice from './common/RemotePlayNotice';

import { Sheep } from './daily/HerdCritters';

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const quicksand = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const SITE = 'https://herdgamesonline.com';
const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Herd Game',
      description: 'Free online party games you can play in your browser — Herd Mentality, Guesstimate, and Say Anything. No download, no signup.',
      publisher: { '@id': `${SITE}/#org` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}/#org`,
      name: 'Herd Game',
      url: `${SITE}/`,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo512.png` },
    },
    {
      '@type': 'VideoGame',
      '@id': `${SITE}/#herd-mentality`,
      name: 'Herd Mentality (Online)',
      alternateName: ['Herd Mentality Online', 'Herd Game', 'Think Like the Herd'],
      url: `${SITE}/`,
      description: 'Free online version of the Herd Mentality party game. Answer questions the way you think the group will — match the majority to win, get the Pink Cow if you are the odd one out. Unlimited players, no download.',
      image: `${SITE}/og-image.png`,
      genre: ['Party', 'Trivia', 'Social', 'Family'],
      gamePlatform: ['Web browser'],
      playMode: 'MultiPlayer',
      numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 3 },
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${SITE}/#org` },
    },
  ],
};

/* ─────────── SVG primitives (inline, no deps) ─────────── */

const CowMascot = ({ className = '', style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className={className} style={style} aria-hidden="true">
    <defs>
      <filter id="cm-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
      </filter>
      <clipPath id="cm-bodyClip">
        <path d="M 90 400 C 90 290, 130 250, 200 250 C 270 250, 310 290, 310 400 Z" />
      </clipPath>
      <clipPath id="cm-headClip">
        <rect x="110" y="110" width="180" height="150" rx="65" />
      </clipPath>
    </defs>

    {/* Horns */}
    <path d="M 140 120 C 120 60, 70 70, 80 90 C 90 110, 110 120, 120 135 Z" fill="#FFF59D" filter="url(#cm-shadow)" />
    <path d="M 260 120 C 280 60, 330 70, 320 90 C 310 110, 290 120, 280 135 Z" fill="#FFF59D" filter="url(#cm-shadow)" />

    {/* Ears */}
    <g filter="url(#cm-shadow)">
      <path d="M 125 155 Q 60 140 50 180 Q 80 200 115 175 Z" fill="#ffffff" />
      <path d="M 120 162 Q 70 152 65 178 Q 85 190 110 173 Z" fill="#F8BBD0" />
      <path d="M 275 155 Q 340 140 350 180 Q 320 200 285 175 Z" fill="#ffffff" />
      <path d="M 280 162 Q 330 152 335 178 Q 315 190 290 173 Z" fill="#F8BBD0" />
    </g>

    {/* Body */}
    <g filter="url(#cm-shadow)">
      <path d="M 90 400 C 90 290, 130 250, 200 250 C 270 250, 310 290, 310 400 Z" fill="#ffffff" />
    </g>
    <g clipPath="url(#cm-bodyClip)">
      <circle cx="100" cy="290" r="45" fill="#212121" />
      <circle cx="290" cy="320" r="60" fill="#212121" />
      <circle cx="220" cy="420" r="55" fill="#212121" />
    </g>

    {/* Cowbell */}
    <g filter="url(#cm-shadow)">
      <path d="M 182 278 L 218 278 L 228 315 C 228 330, 172 330, 172 315 Z" fill="#FBC02D" />
      <rect x="196" y="290" width="8" height="15" rx="4" fill="#F57F17" />
      <circle cx="200" cy="315" r="8" fill="#F57F17" />
    </g>
    <circle cx="200" cy="272" r="6" fill="none" stroke="#F57F17" strokeWidth="4" />

    {/* Collar */}
    <rect x="120" y="250" width="160" height="22" rx="11" fill="#EF5350" filter="url(#cm-shadow)" />

    {/* Head */}
    <rect x="110" y="110" width="180" height="150" rx="65" fill="#ffffff" filter="url(#cm-shadow)" />
    <g clipPath="url(#cm-headClip)">
      <circle cx="110" cy="110" r="45" fill="#212121" />
      <circle cx="270" cy="180" r="55" fill="#212121" />
    </g>

    {/* Eyes */}
    <g>
      <circle cx="160" cy="175" r="13" fill="#212121" />
      <circle cx="156" cy="171" r="4.5" fill="#ffffff" />
      <circle cx="163" cy="178" r="2" fill="#ffffff" />
      <circle cx="240" cy="175" r="17" fill="#ffffff" />
      <circle cx="240" cy="175" r="13" fill="#212121" />
      <circle cx="236" cy="171" r="4.5" fill="#ffffff" />
      <circle cx="243" cy="178" r="2" fill="#ffffff" />
    </g>

    {/* Cheeks */}
    <ellipse cx="140" cy="200" rx="12" ry="8" fill="#FF8A80" opacity="0.8" />
    <ellipse cx="260" cy="200" rx="12" ry="8" fill="#FF8A80" opacity="0.8" />

    {/* Muzzle */}
    <g filter="url(#cm-shadow)">
      <ellipse cx="200" cy="230" rx="70" ry="45" fill="#F48FB1" />
    </g>
    <ellipse cx="180" cy="205" rx="15" ry="6" transform="rotate(-10 180 205)" fill="#ffffff" opacity="0.5" />

    {/* Nostrils */}
    <ellipse cx="175" cy="215" rx="6" ry="10" transform="rotate(-20 175 215)" fill="#D81B60" />
    <ellipse cx="225" cy="215" rx="6" ry="10" transform="rotate(20 225 215)" fill="#D81B60" />

    {/* Mouth + tongue */}
    <path d="M 185 245 Q 200 260 215 245" fill="none" stroke="#D81B60" strokeWidth="3" strokeLinecap="round" />
    <path d="M 194 252 C 194 265, 206 265, 206 252 Z" fill="#FF4081" />

    {/* Hair tuft */}
    <g filter="url(#cm-shadow)">
      <circle cx="180" cy="110" r="18" fill="#ffffff" />
      <circle cx="220" cy="110" r="18" fill="#ffffff" />
      <circle cx="200" cy="95" r="22" fill="#ffffff" />
    </g>

    {/* Flower */}
    <g transform="translate(100, 90)">
      <circle cx="0" cy="-10" r="8" fill="#ffffff" />
      <circle cx="10" cy="-3" r="8" fill="#ffffff" />
      <circle cx="6" cy="8" r="8" fill="#ffffff" />
      <circle cx="-6" cy="8" r="8" fill="#ffffff" />
      <circle cx="-10" cy="-3" r="8" fill="#ffffff" />
      <circle cx="0" cy="0" r="7" fill="#FBC02D" />
    </g>

    {/* Front hooves */}
    <g filter="url(#cm-shadow)">
      <rect x="120" y="360" width="45" height="40" rx="15" fill="#424242" />
      <line x1="142.5" y1="375" x2="142.5" y2="400" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
      <rect x="235" y="360" width="45" height="40" rx="15" fill="#424242" />
      <line x1="257.5" y1="375" x2="257.5" y2="400" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

const Cloud = ({ className = '', delay = 0 }) => (
  <svg
    viewBox="0 0 100 50"
    className={className}
    style={{ animation: `cloud-drift 22s ease-in-out ${delay}s infinite` }}
    aria-hidden="true"
  >
    <ellipse cx="25" cy="32" rx="18" ry="14" fill="#FFFFFF" />
    <ellipse cx="50" cy="26" rx="22" ry="18" fill="#FFFFFF" />
    <ellipse cx="75" cy="32" rx="18" ry="14" fill="#FFFFFF" />
  </svg>
);

const GrassStrip = ({ className = '' }) => (
  <svg viewBox="0 0 400 24" className={className} preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 24 L0 16 Q5 6 10 16 Q15 4 20 16 Q25 8 30 16 Q35 2 40 16 Q45 8 50 16 Q55 6 60 16 Q65 4 70 16 Q75 8 80 16 Q85 2 90 16 Q95 8 100 16 Q105 6 110 16 Q115 4 120 16 Q125 8 130 16 Q135 2 140 16 Q145 8 150 16 Q155 6 160 16 Q165 4 170 16 Q175 8 180 16 Q185 2 190 16 Q195 8 200 16 Q205 6 210 16 Q215 4 220 16 Q225 8 230 16 Q235 2 240 16 Q245 8 250 16 Q255 6 260 16 Q265 4 270 16 Q275 8 280 16 Q285 2 290 16 Q295 8 300 16 Q305 6 310 16 Q315 4 320 16 Q325 8 330 16 Q335 2 340 16 Q345 8 350 16 Q355 6 360 16 Q365 4 370 16 Q375 8 380 16 Q385 2 390 16 Q395 8 400 16 L400 24 Z" fill="#3D8B5A" />
  </svg>
);

const PinkCowIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <ellipse cx="32" cy="36" rx="22" ry="20" fill="#FFB6C1" stroke="#2D1810" strokeWidth="2.5" />
    <ellipse cx="32" cy="44" rx="13" ry="10" fill="#FFE0E8" stroke="#2D1810" strokeWidth="2" />
    <ellipse cx="20" cy="28" rx="6" ry="9" fill="#FFB6C1" stroke="#2D1810" strokeWidth="2" transform="rotate(-25 20 28)" />
    <ellipse cx="44" cy="28" rx="6" ry="9" fill="#FFB6C1" stroke="#2D1810" strokeWidth="2" transform="rotate(25 44 28)" />
    <ellipse cx="24" cy="30" rx="3" ry="4" fill="#E84A8B" transform="rotate(-25 24 30)" />
    <path d="M22 18 Q18 12 14 14" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M42 18 Q46 12 50 14" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="29" cy="40" r="0.9" fill="#2D1810" />
    <circle cx="35" cy="40" r="0.9" fill="#2D1810" />
  </svg>
);

const SpeechBubble = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M8 12 Q8 4 16 4 L48 4 Q56 4 56 12 L56 36 Q56 44 48 44 L26 44 L18 56 L20 44 L16 44 Q8 44 8 36 Z" fill="#BEE3F8" stroke="#2D1810" strokeWidth="2" />
    <circle cx="22" cy="24" r="2.5" fill="#2D1810" />
    <circle cx="32" cy="24" r="2.5" fill="#2D1810" />
    <circle cx="42" cy="24" r="2.5" fill="#2D1810" />
  </svg>
);

const Rosette = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <g transform="translate(32 28)">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <ellipse key={i} rx="6" ry="14" cx="0" cy="-16" fill="#FFD56B" stroke="#2D1810" strokeWidth="1.5" transform={`rotate(${deg})`} />
      ))}
    </g>
    <circle cx="32" cy="28" r="11" fill="#E84A8B" stroke="#2D1810" strokeWidth="2" />
    <text x="32" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FFFFFF" style={fredoka}>1</text>
    <path d="M22 38 L18 60 L26 54 L32 60 L38 54 L46 60 L42 38" fill="#E84A8B" stroke="#2D1810" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const HerdIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 80 64" aria-hidden="true">
    {[6, 30, 54].map((cx, i) => (
      <g key={i} transform={`translate(${cx} ${i === 1 ? 8 : 16})`}>
        <ellipse cx="10" cy="28" rx="12" ry="11" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.6" />
        <ellipse cx="10" cy="32" rx="7" ry="5" fill="#FFE8C8" stroke="#2D1810" strokeWidth="1.4" />
        <ellipse cx="4" cy="22" rx="3" ry="5" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.4" transform="rotate(-25 4 22)" />
        <ellipse cx="16" cy="22" rx="3" ry="5" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.4" transform="rotate(25 16 22)" />
        <circle cx="7.5" cy="28" r="0.8" fill="#2D1810" />
        <circle cx="12.5" cy="28" r="0.8" fill="#2D1810" />
        {i === 1 && <ellipse cx="6" cy="26" rx="3" ry="4" fill="#2D1810" />}
      </g>
    ))}
  </svg>
);

const RunningCow = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 24" className={className} aria-hidden="true">
    <ellipse cx="16" cy="14" rx="10" ry="6" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.5" />
    <ellipse cx="11" cy="13" rx="2" ry="2" fill="#2D1810" />
    <circle cx="24" cy="11" r="4" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.5" />
    <circle cx="25" cy="10" r="0.8" fill="#2D1810" />
    <line x1="9" y1="20" x2="9" y2="23" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="20" x2="14" y2="23" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="19" y1="20" x2="19" y2="23" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="14" x2="3" y2="13" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Thumbtack = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="9" r="6" fill="#E84A8B" stroke="#2D1810" strokeWidth="1.5" />
    <circle cx="10" cy="7" r="1.5" fill="#FFFFFF" opacity="0.7" />
    <line x1="12" y1="15" x2="12" y2="22" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─────────── Component ─────────── */

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
    localStorage.setItem('gameSession', JSON.stringify({ gameId, roomCode, playerId, username }));
  };

  const handleReconnect = () => {
    if (!savedSession) return;
    socket.emit('reconnect_game', savedSession);
    socket.once('game_rejoined', (gameState) => {
      dispatch({ type: 'GAME_REJOINED', payload: gameState });
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
    localStorage.setItem('username', username);
    socket.emit('create_game', { username });
    socket.once('game_created', ({ gameId, roomCode, playerId }) => {
      saveGameSession(gameId, roomCode, playerId, username);
      dispatch({ type: 'GAME_CREATED', payload: { gameId, roomCode, playerId } });
      navigate(`/game/${roomCode}`);
    });
    socket.once('error', ({ message }) => {
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
      saveGameSession(gameId, roomCode, playerId, username);
      dispatch({ type: 'GAME_JOINED', payload: { gameId, playerId } });
      navigate(`/game/${roomCode}`);
    });
    socket.once('error', ({ message }) => {
      setIsJoining(false);
      alert(message);
    });
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border-2 border-[#E8DFC9] bg-[#FFFDF6] text-[#2D1810] placeholder-[#A89A78] focus:ring-2 focus:ring-[#3D8B5A] focus:border-[#3D8B5A] outline-none transition';

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        ...quicksand,
        background:
          'radial-gradient(circle at 12% 18%, #BEE3F8 0%, transparent 35%),' +
          'radial-gradient(circle at 88% 12%, #FFD56B 0%, transparent 30%),' +
          '#FFF8E7'
      }}
    >
      {/* keyframes for cloud drift + cow tail */}
      <style>{`
        @keyframes cloud-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .cow-spots-bg {
          background-image:
            radial-gradient(ellipse 18px 12px at 20px 30px, rgba(45,24,16,0.05) 50%, transparent 51%),
            radial-gradient(ellipse 24px 16px at 90px 80px, rgba(45,24,16,0.05) 50%, transparent 51%),
            radial-gradient(ellipse 14px 10px at 150px 40px, rgba(45,24,16,0.05) 50%, transparent 51%);
          background-size: 180px 120px;
        }
        @keyframes jiggle {
          0%, 100% { transform: translateY(0) rotate(0); }
          25%      { transform: translateY(-6px) rotate(-1.5deg); }
          75%      { transform: translateY(-3px) rotate(1.5deg); }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .game-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .game-card:hover {
          transform: translateY(-6px) rotate(-0.5deg);
          box-shadow: 0 24px 50px -18px rgba(45,24,16,0.4);
        }
        .game-card:hover .game-card-mascot {
          animation: jiggle 0.5s ease-in-out;
        }
        .soon-card {
          background: linear-gradient(120deg, #F5F0E6, #FFF5E8, #F5F0E6);
          background-size: 200% 200%;
          animation: shimmer 6s ease-in-out infinite;
        }
        .ribbon {
          position: absolute;
          top: 10px;
          right: -28px;
          transform: rotate(35deg);
          padding: 3px 32px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="cow-spots-bg absolute inset-0 pointer-events-none" />
      <Cloud className="absolute top-20 left-[6%] w-28 opacity-90 pointer-events-none" delay={0} />
      <Cloud className="absolute top-32 right-[8%] w-36 opacity-90 pointer-events-none" delay={3} />
      <Cloud className="absolute top-72 left-[40%] w-20 opacity-80 pointer-events-none hidden md:block" delay={6} />

      <Navigation />

      <Helmet>
        <title>Herd Mentality Online — Free Party Game, No Download</title>
        <meta name="description" content="Play Herd Mentality online free — think like the herd to win, dodge the Pink Cow if you're the odd one out. Unlimited players, no download, no signup. Start in seconds →" />
        <meta name="keywords" content="Herd Mentality, Herd Mentality board game, Herd Mentality online, party games, family game night, team building, social games, multiplayer games, virtual hangouts, quiz games, ice breaker games, game night ideas, think like the herd, Pink Cow" />
        <meta property="og:title" content="Herd Mentality Online — Free Party Game, No Download" />
        <meta property="og:description" content="Think like the herd to win! The free online party game for friends, family, and teams. Unlimited players, no download, no signup. Play free →" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://herdgamesonline.com/" />
        <meta property="og:image" content="https://herdgamesonline.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Herd Mentality Online — Free Party Game, No Download" />
        <meta name="twitter:description" content="Think like the herd to win! Free online party game for friends, family & teams. No download, no signup — play instantly." />
        <meta name="twitter:image" content="https://herdgamesonline.com/twitter-image.png" />
        <link rel="canonical" href="https://herdgamesonline.com/" />
        <meta name="google-site-verification" content="7nItEeuNSAIFL_unU4Ai5p-SGizDDaJU8XRYEKdtOgk" />
        <script type="application/ld+json">{JSON.stringify(HOME_SCHEMA)}</script>
      </Helmet>

      <div className="relative container mx-auto px-4 pt-24 pb-12 max-w-lg md:max-w-6xl">
        {/* Hero */}
        <header className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4 mb-12">
          <div className="hidden md:block" />
          <div className="text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <CowMascot className="w-48 md:w-56 drop-shadow-lg" style={{ animation: 'float-y 4s ease-in-out infinite' }} />
              <div>
                <h1
                  style={fredoka}
                  className="text-5xl md:text-7xl font-bold text-[#2D1810] leading-none"
                >
                  Herd <span className="text-[#3D8B5A]">Game</span>
                </h1>
                <p style={quicksand} className="text-lg md:text-xl text-[#6B4226] mt-2 font-medium">
                  A meadow full of party games. <span className="text-[#E84A8B] font-semibold">Pick yours.</span>
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-end pr-4">
            <div className="opacity-80" style={{ animation: 'wiggle 3s ease-in-out infinite' }}>
              <PinkCowIcon size={56} />
            </div>
          </div>
        </header>

        {/* Daily games — solo, no friends needed. The come-back-every-day habit loop. */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <h2 style={fredoka} className="text-2xl md:text-3xl font-bold text-[#2D1810]">☀ Daily games</h2>
            <span className="text-sm text-[#6B4226]">Play solo · no friends needed · new every day</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Daily Herd */}
            <Link to="/daily" className="group rounded-3xl border-4 border-[#E84A8B] bg-[#FFF6E9] p-4 flex flex-col items-center text-center transition-transform hover:-translate-y-0.5">
              <Sheep size={48} />
              <h3 style={fredoka} className="text-lg font-bold text-[#2D1810] mt-2">Daily Herd</h3>
              <p className="text-sm text-[#6B4226] mt-0.5 flex-1">Match the herd — 5 quick questions, find out what you are.</p>
              <span className="mt-2 text-[#E84A8B] font-semibold text-sm">Play today →</span>
            </Link>
            {/* Daily Trivia */}
            <Link to="/trivia" className="group rounded-3xl border-4 border-[#3D8B5A] bg-[#FFF6E9] p-4 flex flex-col items-center text-center transition-transform hover:-translate-y-0.5">
              <svg width="48" height="48" viewBox="0 0 24 24" aria-hidden="true" className="drop-shadow">
                <circle cx="12" cy="12" r="10" fill="#3D8B5A" />
                <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff" fontFamily="Fredoka, sans-serif">?</text>
              </svg>
              <h3 style={fredoka} className="text-lg font-bold text-[#2D1810] mt-2">Daily Trivia</h3>
              <p className="text-sm text-[#6B4226] mt-0.5 flex-1">10 questions a day across every topic. Keep your streak.</p>
              <span className="mt-2 text-[#3D8B5A] font-semibold text-sm">Play today →</span>
            </Link>
            {/* Huddle */}
            <Link to="/connections" className="group rounded-3xl border-4 border-[#4A90D9] bg-[#FFF6E9] p-4 flex flex-col items-center text-center transition-transform hover:-translate-y-0.5">
              <svg width="48" height="48" viewBox="0 0 24 24" aria-hidden="true" className="drop-shadow">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="#E9B949" />
                <rect x="13" y="3" width="8" height="8" rx="2" fill="#3D8B5A" />
                <rect x="3" y="13" width="8" height="8" rx="2" fill="#4A90D9" />
                <rect x="13" y="13" width="8" height="8" rx="2" fill="#7C4DFF" />
              </svg>
              <h3 style={fredoka} className="text-lg font-bold text-[#2D1810] mt-2">Huddle</h3>
              <p className="text-sm text-[#6B4226] mt-0.5 flex-1">Sort 16 words into 4 hidden groups. Free Connections-style.</p>
              <span className="mt-2 text-[#4A90D9] font-semibold text-sm">Play today →</span>
            </Link>
          </div>
        </section>

        {/* ─── GAME HUB ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="text-center mb-6">
            <h2 style={fredoka} className="text-3xl md:text-4xl font-bold text-[#2D1810]">
              Pick your game 🎲
            </h2>
            <p className="text-[#6B4226] mt-1">More games being added to the herd.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Herd Mentality — Featured */}
            <a
              href="#play"
              className="game-card relative bg-white rounded-3xl border-4 border-[#3D8B5A] p-5 overflow-hidden block group md:col-span-2 lg:col-span-1"
            >
              <div className="ribbon bg-[#3D8B5A] text-white">★ Popular</div>
              <div className="flex items-start gap-4">
                <div className="game-card-mascot shrink-0">
                  <CowMascot className="w-20 md:w-24 drop-shadow" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Herd Mentality
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Think like the herd. Dodge the pink cow. The OG.
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#3D8B5A] text-white px-3 py-1 text-xs font-bold">👥 Minimum 3 players</span>
                    <span className="text-xs text-[#8B6347]">🎥 great on video calls</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#3D8B5A] font-semibold">
                    Play now <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Say Anything */}
            <Link
              to="/say-anything"
              className="game-card relative bg-white rounded-3xl border-4 border-[#E84A8B] p-5 overflow-hidden block group"
            >
              <div className="ribbon bg-[#E84A8B] text-white">✨ New</div>
              <div className="flex items-start gap-4">
                <div className="game-card-mascot shrink-0 text-5xl md:text-6xl select-none" aria-hidden="true">💬</div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Say Anything
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Write the funniest answer. Bet on the judge's pick.
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E84A8B] text-white px-3 py-1 text-xs font-bold">👥 Minimum 3 players</span>
                    <span className="text-xs text-[#8B6347]">🎥 great on video calls</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#E84A8B] font-semibold">
                    Play now <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Guesstimate */}
            <Link
              to="/guesstimate"
              className="game-card relative bg-white rounded-3xl border-4 border-[#FBC02D] p-5 overflow-hidden block group"
            >
              <div className="ribbon bg-[#FBC02D] text-[#2D1810]">✨ New</div>
              <div className="flex items-start gap-4">
                <div className="game-card-mascot shrink-0 text-5xl md:text-6xl select-none" aria-hidden="true">🎯</div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Guesstimate
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Guess a trivia number. Bet on whose guess is closest. Free Wits &amp; Wagers-style.
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FB8C00] text-white px-3 py-1 text-xs font-bold">👥 Minimum 2 players</span>
                    <span className="text-xs text-[#8B6347]">🎥 great on video calls</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#FB8C00] font-semibold">
                    Play now <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Clover Clues */}
            <Link
              to="/clover"
              className="game-card relative bg-white rounded-3xl border-4 border-[#3D8B5A] p-5 overflow-hidden block group"
            >
              <div className="ribbon bg-[#3D8B5A] text-white">✨ New</div>
              <div className="flex items-start gap-4">
                <div className="game-card-mascot shrink-0">
                  <svg width="54" height="54" viewBox="0 0 24 24" aria-hidden="true" className="drop-shadow">
                    <g fill="#3D8B5A" stroke="#2F6E45" strokeWidth="0.8">
                      <circle cx="12" cy="8" r="3.6" />
                      <circle cx="16" cy="12" r="3.6" />
                      <circle cx="12" cy="16" r="3.6" />
                      <circle cx="8" cy="12" r="3.6" />
                    </g>
                    <circle cx="12" cy="12" r="1.7" fill="#2F6E45" />
                    <path d="M12 16 Q12.5 20 14.5 22" stroke="#3D8B5A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Clover Clues
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Write clues, rebuild each other's clovers. Co-op word game.
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#3D8B5A] text-white px-3 py-1 text-xs font-bold">👥 Minimum 3 players</span>
                    <span className="text-xs text-[#8B6347]">🎥 great on video calls</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#3D8B5A] font-semibold">
                    Play now <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Team Trivia */}
            <Link
              to="/team-trivia"
              className="game-card relative bg-white rounded-3xl border-4 border-[#7C4DFF] p-5 overflow-hidden block group"
            >
              <div className="ribbon bg-[#7C4DFF] text-white">✨ New</div>
              <div className="flex items-start gap-4">
                <div className="game-card-mascot shrink-0 text-5xl md:text-6xl select-none" aria-hidden="true">🧠</div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Team Trivia
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Host a live quiz, everyone answers from their own screen. Live leaderboard.
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#7C4DFF] text-white px-3 py-1 text-xs font-bold">👥 2+ players</span>
                    <span className="text-xs text-[#8B6347]">🎥 great on video calls</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#7C4DFF] font-semibold">
                    Play now <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Remote Work Bingo */}
            <Link
              to="/remote-work-bingo"
              className="game-card relative bg-white rounded-3xl border-4 border-[#D7263D] p-5 overflow-hidden block group"
            >
              <div className="ribbon bg-[#D7263D] text-white">✨ New</div>
              <div className="flex items-start gap-4">
                <div className="game-card-mascot shrink-0">
                  <svg width="54" height="54" viewBox="0 0 24 24" aria-hidden="true" className="drop-shadow">
                    <rect x="2" y="2" width="20" height="20" rx="3" fill="#FFF1DC" stroke="#D7263D" strokeWidth="1.5" />
                    {[6, 12, 18].map((y) => [6, 12, 18].map((x) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={x === 12 && y === 12 ? '#3D8B5A' : '#D7263D'} opacity={x === 12 && y === 12 ? 1 : 0.5} />
                    )))}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Remote Work Bingo
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Mark the meeting clichés — "you're on mute", "let's take this offline". Bingo!
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D7263D] text-white px-3 py-1 text-xs font-bold">🧑‍💻 Solo or team</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#D7263D] font-semibold">
                    Play now <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coming Soon — Monikers */}
            <div className="soon-card relative rounded-3xl border-4 border-dashed border-[#C9B98F] p-5 overflow-hidden">
              <div className="ribbon bg-[#8B6347] text-white">Soon</div>
              <div className="flex items-start gap-4 opacity-80">
                <div className="game-card-mascot shrink-0 text-5xl md:text-6xl select-none" aria-hidden="true">🎭</div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Monikers
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Describe, one-word, then charades. Pure chaos.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#8B6347] font-semibold text-sm">
                    Coming soon
                  </div>
                </div>
              </div>
            </div>

            {/* Suggest-a-game card */}
            <a
              href="mailto:ajejey@gmail.com?subject=New%20game%20idea%20for%20Herd"
              className="game-card relative rounded-3xl border-4 border-dashed border-[#FFD56B] bg-[#FFFBE8] p-5 overflow-hidden block group"
            >
              <div className="flex items-start gap-4">
                <div className="game-card-mascot shrink-0 text-5xl md:text-6xl select-none" aria-hidden="true">💡</div>
                <div className="flex-1 min-w-0">
                  <h3 style={fredoka} className="text-2xl font-bold text-[#2D1810] leading-tight">
                    Got a game?
                  </h3>
                  <p className="text-sm text-[#6B4226] mt-1">
                    Tell us what to build next. We're listening.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[#E84A8B] font-semibold text-sm">
                    Suggest a game <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </a>

          </div>
        </section>

        {/* Join / Create card */}
        <div id="play" className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.35)] border-4 border-[#FFE8C8] p-6 md:p-8 mb-10 scroll-mt-24">
          <div className="text-center mb-4">
            <p className="text-xs uppercase tracking-widest text-[#3D8B5A] font-bold">🐄 Herd Mentality</p>
            <h2 style={fredoka} className="text-2xl md:text-3xl font-bold text-[#2D1810]">Jump into a room</h2>
          </div>
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-[#FFF8E7] border-2 border-[#E8DFC9] rounded-full p-1">
              <button
                onClick={() => setActiveTab('join')}
                style={fredoka}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                  activeTab === 'join'
                    ? 'bg-[#3D8B5A] text-white shadow-md'
                    : 'text-[#2D1810] hover:bg-[#FFE8C8]'
                }`}
              >
                <HerdIcon size={22} />
                Join Game
              </button>
              <button
                onClick={() => setActiveTab('create')}
                style={fredoka}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-all ${
                  activeTab === 'create'
                    ? 'bg-[#E84A8B] text-white shadow-md'
                    : 'text-[#2D1810] hover:bg-[#FFE8C8]'
                }`}
              >
                <PinkCowIcon size={22} />
                Create Game
              </button>
            </div>
          </div>

          {showReconnect && savedSession && (
            <div className="mb-6 p-4 bg-[#FFFBE8] rounded-2xl border-2 border-[#FFD56B]">
              <h3 style={fredoka} className="text-lg font-bold text-[#2D1810] mb-1">
                🐄 Rejoin previous game?
              </h3>
              <p className="text-sm text-[#6B4226] mb-3">
                You have an active session as <span className="font-semibold">{savedSession.username}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReconnect}
                  style={fredoka}
                  className="flex-1 px-4 py-2 bg-[#3D8B5A] text-white rounded-xl font-semibold hover:bg-[#2F6E45] transition-colors"
                >
                  Rejoin
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('gameSession');
                    setShowReconnect(false);
                    setSavedSession(null);
                  }}
                  className="flex-1 px-4 py-2 text-[#6B4226] hover:text-[#2D1810] font-medium transition-colors"
                >
                  Start fresh
                </button>
              </div>
            </div>
          )}

          <form onSubmit={activeTab === 'join' ? handleJoinGame : handleCreateGame} className="space-y-4">
            <div>
              <label style={fredoka} className="block text-sm font-semibold text-[#2D1810] mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
                placeholder="What should the herd call you?"
                required
              />
            </div>

            {activeTab === 'join' && (
              <div>
                <label style={fredoka} className="block text-sm font-semibold text-[#2D1810] mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className={inputCls + ' tracking-[0.2em] uppercase font-semibold'}
                  placeholder="6-LETTER CODE"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isJoining}
              style={fredoka}
              className={`group w-full py-4 rounded-2xl text-white text-lg font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 ${
                activeTab === 'join'
                  ? 'bg-[#3D8B5A] hover:bg-[#2F6E45] focus:ring-[#3D8B5A]/40'
                  : 'bg-[#E84A8B] hover:bg-[#C73B73] focus:ring-[#E84A8B]/40'
              } ${isJoining ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {isJoining ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {activeTab === 'join' ? 'Joining the herd…' : 'Rounding up the herd…'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {activeTab === 'join' ? 'Join the Herd' : 'Start a New Herd'}
                  <span className="transition-transform group-hover:translate-x-1">
                    <RunningCow size={26} />
                  </span>
                </span>
              )}
            </button>
          </form>

          <RemotePlayNotice minPlayers={3} maxPlayers={20} accent="#E84A8B" />

          <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
        </div>

        {/* Ad — between play card and how-to-play */}
        <div className="mb-10 max-h-[300px] overflow-hidden">
          <AdSlot slot="5969633275" />
        </div>

        {/* How to Play — illustrated step cards */}
        <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8 mb-10">
          <h2 style={fredoka} className="text-3xl md:text-4xl font-bold text-[#2D1810] mb-2 text-center">
            How to Play Herd Game Online
          </h2>
          <p className="text-center text-[#6B4226] mb-8">Match the herd. Dodge the pink cow. First to 8 wins.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="rounded-2xl border-2 border-[#3D8B5A]/20 bg-[#F4FBF6] p-5 border-t-8 border-t-[#3D8B5A]">
              <div className="flex items-center gap-3 mb-3">
                <HerdIcon size={48} />
                <h3 style={fredoka} className="text-xl font-bold text-[#2D1810]">1. Gather your herd</h3>
              </div>
              <p className="text-[#4A2D1B] text-base leading-relaxed">
                One player creates a game and shares the room code. Friends join from anywhere — phones, laptops, you name it.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#BEE3F8]/60 bg-[#F2F9FF] p-5 border-t-8 border-t-[#5BA8D8]">
              <div className="flex items-center gap-3 mb-3">
                <SpeechBubble size={48} />
                <h3 style={fredoka} className="text-xl font-bold text-[#2D1810]">2. Answer the question</h3>
              </div>
              <p className="text-[#4A2D1B] text-base leading-relaxed">
                Everyone sees the same fun prompt — like “What's the best pizza topping?” Answers are revealed together.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#FFD56B]/60 bg-[#FFFBE8] p-5 border-t-8 border-t-[#FFD56B]">
              <div className="flex items-center gap-3 mb-3">
                <Rosette size={48} />
                <h3 style={fredoka} className="text-xl font-bold text-[#2D1810]">3. Match the herd</h3>
              </div>
              <p className="text-[#4A2D1B] text-base leading-relaxed">
                Players who matched the most common answer score a point. Stand out alone? You earn the pink cow 🐄 — and you can't win while you're holding it.
              </p>
            </div>
          </div>

          <div className="space-y-5 text-[#4A2D1B]">
            <div>
              <h3 style={fredoka} className="text-lg font-bold text-[#3D8B5A] mb-1">🎯 Objective</h3>
              <p>Think like the herd! Match your answers with other players to score points.</p>
            </div>

            <div>
              <h3 style={fredoka} className="text-lg font-bold text-[#3D8B5A] mb-2">🎮 The full rules</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="pl-4 border-l-4 border-[#FFE8C8]">
                  <h4 style={fredoka} className="font-bold text-[#2D1810] mb-1">Starting the game</h4>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>One player creates a game and shares the room code</li>
                    <li>Other players join using the room code</li>
                    <li>Game begins when host clicks “Start Game”</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-[#FFE8C8]">
                  <h4 style={fredoka} className="font-bold text-[#2D1810] mb-1">Each round</h4>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>Everyone sees the same fun question</li>
                    <li>Players have 30 seconds to submit their answer</li>
                    <li>After everyone answers, all responses are revealed</li>
                    <li>Players who matched the most common answer get a point</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-[#FFE8C8]">
                  <h4 style={fredoka} className="font-bold text-[#2D1810] mb-1">The pink cow 🐄</h4>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>The player with the most unique answer takes the pink cow</li>
                    <li>You can't win while holding it</li>
                    <li>Pass it on by matching answers with the herd</li>
                  </ul>
                </div>
                <div className="pl-4 border-l-4 border-[#FFE8C8]">
                  <h4 style={fredoka} className="font-bold text-[#2D1810] mb-1">Winning</h4>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>First player to reach 8 points wins</li>
                    <li>But you can't win with the pink cow!</li>
                    <li>Game continues until someone without it reaches 8</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 style={fredoka} className="text-lg font-bold text-[#3D8B5A] mb-2">👥 Perfect for</h3>
              <div className="flex flex-wrap gap-2">
                {['Friends & Family', 'Virtual Game Nights', 'Team Building', 'Office Games'].map(t => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#FFF8E7] border-2 border-[#FFE8C8] text-sm font-semibold text-[#6B4226]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
        </div>

        {/* Ad — between How to Play and Featured Articles */}
        <div className="mb-10 max-h-[300px] overflow-hidden">
          <AdSlot slot="5698170537" />
        </div>

        {/* Featured articles — polaroid cards */}
        <div className="relative bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6 md:p-8 mb-10">
          <h2 style={fredoka} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-6 text-center">
            From the meadow blog
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
            {[
              {
                rotate: '-2deg',
                bg: '#FFFBE8',
                title: '5 Tips for Hosting the Perfect Virtual Game Night',
                body: 'Learn how to host an engaging and fun virtual game night with friends and family using Herd Game.'
              },
              {
                rotate: '2deg',
                bg: '#F2F9FF',
                title: 'The Psychology Behind Herd Game',
                body: "Discover why we enjoy thinking like others and the social science behind the game's mechanics."
              }
            ].map((card, i) => (
              <div
                key={i}
                className="relative p-5 pt-7 rounded-md shadow-[0_10px_25px_-12px_rgba(45,24,16,0.4)] border border-[#E8DFC9] transition-transform hover:rotate-0 hover:-translate-y-1"
                style={{ transform: `rotate(${card.rotate})`, background: card.bg }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Thumbtack />
                </div>
                <h3 style={fredoka} className="text-lg font-bold text-[#2D1810] mb-2">{card.title}</h3>
                <p className="text-[#4A2D1B] text-base mb-3">{card.body}</p>
                <Link to="/blog" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold inline-flex items-center gap-1">
                  Read more
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/blog"
              style={fredoka}
              className="inline-block px-6 py-3 bg-[#FFD56B] text-[#2D1810] rounded-full font-bold border-2 border-[#2D1810] shadow-[2px_2px_0_#2D1810] hover:shadow-[4px_4px_0_#2D1810] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              View all articles
            </Link>
          </div>

          <GrassStrip className="absolute bottom-0 left-0 right-0 w-full h-5 -mb-[2px]" />
        </div>

        <footer className="text-center mt-8 text-[#6B4226] text-sm">
          <p style={fredoka} className="font-semibold">Made with 🐄 in the meadow.</p>
          <p className="opacity-80">&copy; {new Date().getFullYear()} Herd Game. A social party game for everyone.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link to="/privacy-policy" className="hover:text-[#3D8B5A] transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-[#3D8B5A] transition-colors">Terms of Service</Link>
            <Link to="/about-contact" className="hover:text-[#3D8B5A] transition-colors">About / Contact</Link>
            <Link to="/faq" className="hover:text-[#3D8B5A] transition-colors">FAQ</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
