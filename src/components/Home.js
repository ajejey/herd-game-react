import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { socket } = useSocket();
  const { dispatch } = useGame();
  const navigate = useNavigate();

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
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🐄 Herd Mentality</h1>
          <p className="text-lg text-gray-600">
            Think like the herd to win!
          </p>
        </div>

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
      </div>
    </div>
  );
};

export default Home;
