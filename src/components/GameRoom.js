import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const GameRoom = () => {
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const { roomCode } = useParams();
  const { socket } = useSocket();
  const { gameState, dispatch } = useGame();
  const navigate = useNavigate();

  console.log("gameState: ", gameState);

  useEffect(() => {
    if (!socket) return;

    // get username from local storage
    // const username = localStorage.getItem('username');
    // if (username) {
    //   socket.emit('join_game', { username, roomCode });
    // }

    socket.on('players_updated', ({ players }) => {
      dispatch({ type: 'PLAYERS_UPDATED', payload: { players } });
    });

    socket.on('game_started', (payload) => {
      dispatch({ type: 'GAME_STARTED', payload });
    });

    socket.on('player_answered', (payload) => {
      dispatch({ type: 'PLAYER_ANSWERED', payload });
    });

    socket.on('round_completed', (payload) => {
      dispatch({ type: 'ROUND_COMPLETED', payload });
      setHasAnswered(false);
      setAnswer('');
    });

    socket.on('next_round', (payload) => {
      dispatch({ type: 'NEXT_ROUND', payload });
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('players_updated');
      socket.off('game_started');
      socket.off('player_answered');
      socket.off('round_completed');
      socket.off('next_round');
      socket.off('error');
    };
  }, [socket, dispatch]);

  const handleStartGame = () => {
    socket.emit('start_game', { gameId: gameState.gameId });
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      alert('Please enter an answer');
      return;
    }

    socket.emit('submit_answer', {
      gameId: gameState.gameId,
      answer: answer.trim()
    });
    setHasAnswered(true);
  };

  const renderPlayerList = () => (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Players</h2>
      <div className="space-y-2">
        {gameState.players.map((player) => (
          <div
            key={player._id}
            className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <span>{player.username}</span>
              {player.isHost && (
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Host
                </span>
              )}
              {gameState.pinkCowHolder === player._id && (
                <span className="text-xl">🐄</span>
              )}
            </div>
            <span>Score: {player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGameContent = () => {
    if (gameState.gameStatus === 'waiting') {
      return (
        <div className="space-y-4 text-center">
          <p className="text-lg">Room Code: {roomCode}</p>
          <p>Waiting for players...</p>
          {gameState.isHost && (
            <button
              className="btn btn-primary"
              onClick={handleStartGame}
              disabled={gameState.players.length < 2}
            >
              Start Game
            </button>
          )}
        </div>
      );
    }

    if (gameState.roundResults) {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Round {gameState.currentRound} Results</h2>
            <p className="text-lg text-gray-600">Question: "{gameState.currentQuestion}"</p>
            <div className="inline-block px-4 py-2 bg-green-100 rounded-lg">
              <p className="text-lg">
                {gameState.roundResults.majorityAnswer ? (
                  <>
                    Majority Answer: <span className="font-bold text-green-700">{gameState.roundResults.majorityAnswer}</span>
                  </>
                ) : (
                  <span className="text-yellow-700">No majority answer - it's a tie!</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Player Answers:</h3>
            <div className="grid gap-3">
              {gameState.roundResults.allAnswers.map((answer, index) => {
                const player = gameState.players.find(p => p._id === answer.playerId);
                const isInHerd = answer?.answer && gameState.roundResults?.majorityAnswer 
                  ? answer.answer.toLowerCase() === gameState.roundResults.majorityAnswer.toLowerCase()
                  : false;
                const scoreChange = isInHerd ? '+1' : '0';
                
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{answer.username}</span>
                      {gameState.pinkCowHolder === answer.playerId && <span title="Pink Cow Holder">🐄</span>}
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        gameState.roundResults.majorityAnswer
                          ? isInHerd ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {gameState.roundResults.majorityAnswer ? (isInHerd ? 'In Herd' : 'Unique') : 'Tied'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">"{answer.answer || ''}"</span>
                      <span className="text-sm">{player?.score || 0} ({scoreChange})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {gameState.isHost && !gameState.winner && (
            <div className="text-center mt-6">
              <button
                onClick={() => socket.emit('next_round', { gameId: gameState.gameId })}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Next Round
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Round TESTING {gameState.currentRound}
        </h2>
        <p className="text-lg text-center">{gameState.currentQuestion}</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(gameState.playersAnswered / gameState.players.length) * 100}%`
            }}
          />
        </div>
        <p className="text-center">
          {gameState.playersAnswered} of {gameState.players.length} answered
        </p>
        
        {!hasAnswered ? (
          <div className="flex space-x-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button
              className="btn btn-primary whitespace-nowrap"
              onClick={handleSubmitAnswer}
            >
              Submit
            </button>
          </div>
        ) : (
          <p className="text-center">Waiting for other players...</p>
        )}
      </div>
    );
  };

  if (gameState.winner) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center space-y-8">
          <h1 className="text-3xl font-bold">Game Over!</h1>
          <p className="text-xl">
            {gameState.winner.username} wins with {gameState.winner.score} points!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          {renderPlayerList()}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {renderGameContent()}
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
