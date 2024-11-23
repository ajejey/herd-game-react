import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showReconnect, setShowReconnect] = useState(false);
  const [savedSession, setSavedSession] = useState(null);
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

  const handleCreateGame = () => {
    if (!username.trim()) {
      alert('Please enter a username to create a game');
      return;
    }

    console.log('Attempting to create game with username:', username);

    // set username to local storage
    localStorage.setItem('username', username);

    socket.emit('create_game', { username }, (error) => {
      if (error) {
        console.error('Error sending create_game event:', error);
      } else {
        console.log('create_game event sent successfully');
      }
    });

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
      alert(message);
    });
  };

  const handleJoinGame = () => {
    if (!username.trim() || !roomCode.trim()) {
      alert('Please enter both username and room code');
      return;
    }

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
      alert(message);
    });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🐄 Herd Mentality</h1>
          <p className="text-lg text-gray-600">
            Think like the herd to win!
          </p>
        </div>

        {showReconnect ? (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">
                You have an active game in room <span className="font-mono font-medium">{savedSession?.roomCode}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleReconnect}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Rejoin Game
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('gameSession');
                  setShowReconnect(false);
                  setSavedSession(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Start New Game
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {isJoining && (
              <div>
                <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Room Code
                </label>
                <input
                  id="roomCode"
                  type="text"
                  className="input uppercase"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />
              </div>
            )}

            {!isJoining ? (
              <button
                className="btn btn-primary w-full"
                onClick={handleCreateGame}
              >
                Create New Game
              </button>
            ) : (
              <button
                className="btn btn-secondary w-full"
                onClick={handleJoinGame}
              >
                Join Game
              </button>
            )}

            <button
              className="w-full text-gray-600 hover:text-gray-900"
              onClick={() => setIsJoining(!isJoining)}
            >
              {isJoining ? 'Create a new game instead?' : 'Join an existing game?'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
