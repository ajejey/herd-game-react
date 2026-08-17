import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import Confetti from 'react-confetti';
import AdSlot from './AdSlot';
import ReportProblem from './common/ReportProblem';
import { share as shareSheet, copyText } from '../lib/shareSheet';

const ROUND_AD_SLOT = '5698170537';
const LOBBY_AD_SLOT = '5969633275';
const GAMEOVER_AD_SLOT = '9390003532';

/*
  Quote and list the tied herds properly.

  A three-way tie is not rare enough to fudge — {"coffee":2,"breakfast":2,"eat":2}
  is a real round from the data that motivated the tie fix, so the players most
  likely to read this sentence are exactly the ones a hardcoded "both" gets
  wrong.
*/
function listHerds(herds) {
  const quoted = herds.map((h) => `“${h}”`);
  if (quoted.length <= 1) return quoted.join('');
  return `${quoted.slice(0, -1).join(', ')} and ${quoted[quoted.length - 1]}`;
}

const GameRoom = () => {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket } = useLiveSocket();
  const { gameState, dispatch } = useGame();

  // Handle initial connection and reconnection
  useEffect(() => {
    if (!socket) return;

    const attemptReconnection = () => {
      const savedSession = localStorage.getItem('gameSession');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.roomCode === roomCode) {
          socket.emit('reconnect_game', session);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    if (!gameState.gameId) {
      attemptReconnection();
    } else {
      setIsLoading(false);
    }
  }, [socket, gameState.gameId, roomCode, navigate]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('game_rejoined', (gameState) => {
      dispatch({
        type: 'GAME_REJOINED',
        payload: gameState
      });
      setIsLoading(false);
    });

    socket.on('reconnect_failed', ({ reason }) => {
      console.error('Reconnection failed:', reason);
      navigate('/');
    });

    return () => {
      socket.off('game_rejoined');
      socket.off('reconnect_failed');
    };
  }, [socket, dispatch, navigate]);

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

    socket.on('game_completed', ({ winner }) => {
      dispatch({
        type: 'GAME_COMPLETED',
        payload: { winner }
      });
    });

    socket.on('next_round', (payload) => {
      dispatch({ type: 'NEXT_ROUND', payload });
    });

    socket.on('pink_cow_moved', (payload) => {
      dispatch({ type: 'PINK_COW_MOVED', payload });
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('players_updated');
      socket.off('game_started');
      socket.off('player_answered');
      socket.off('round_completed');
      socket.off('game_completed');
      socket.off('next_round');
      socket.off('pink_cow_moved');
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

  // Hand the cow to somebody, or to nobody. The server does the authorising and
  // re-runs the win check, because moving it off a player on 8 points is what
  // ends the game.
  const handleMoveCow = (playerId) => {
    socket.emit('move_pink_cow', {
      gameId: gameState.gameId,
      playerId: playerId || null,
    });
  };

  const handleLeaveGame = () => {
    localStorage.removeItem('gameSession');
    socket.emit('leave_game', { gameId: gameState.gameId });
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  };

  const handleCopyRoomCode = () => {
    // navigator.clipboard is unreliable in the Android WebView and rejects
    // silently, which showed "Copied!" for something never copied.
    copyText(roomCode).then((ok) => {
      if (!ok) return;
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // One-tap invite: a clickable link that drops friends onto the Join form with
  // the code prefilled.
  //
  // navigator.share does NOT exist in an Android WebView, so the old code here
  // fell straight through to a clipboard copy and the app's main game could
  // never open a share sheet. shareSheet() uses the native Android intent there
  // and the Web Share API in a browser, and is not async so the web call still
  // happens inside the click's user activation.
  const inviteUrl = `${window.location.origin}/?join=${roomCode}`;
  const handleShareInvite = () => {
    const shareText = `Join my Herd Mentality game! Room code ${roomCode}`;
    shareSheet({
      title: 'Herd Mentality',
      text: shareText,
      url: inviteUrl,
      dialogTitle: 'Invite friends to your game',
    }).then((res) => {
      if (res.via !== 'clipboard') return;
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const renderPlayerList = () => {
    if (!gameState.players) return null;
    
    return (
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
                  <span className="px-2 py-0.5 text-sm bg-blue-100 text-blue-800 rounded-full">
                    Host
                  </span>
                )}
                {gameState.pinkCowHolder === player._id && (
                  <span className="px-2 py-0.5 text-sm bg-pink-100 text-pink-800 rounded-full">
                    🐄
                  </span>
                )}
                {!player.isConnected && (
                  <span className="px-2 py-0.5 text-sm bg-red-100 text-red-800 rounded-full">
                    Disconnected
                  </span>
                )}
              </div>
              <span className="text-gray-600">{player.score || 0} points</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /*
    One row of names; tap one to give them the cow, or "Nobody" to take it off
    the table. Shown to the host only — everyone else gets the sentence that
    explains what they are waiting for, which is the same principle as naming
    the host in the lobby rather than saying "waiting for players".
  */
  const renderCowPicker = () => (
    <div className="flex flex-wrap justify-center gap-2">
      {(gameState.players || []).map((p) => {
        const holds = String(gameState.pinkCowHolder || '') === String(p._id);
        return (
          <button
            key={p._id}
            onClick={() => handleMoveCow(p._id)}
            aria-pressed={holds}
            className={`px-3 py-2 rounded-full text-base border transition-colors ${
              holds
                ? 'bg-pink-100 border-pink-400 text-pink-800 font-semibold'
                : 'bg-white border-gray-300 text-gray-700 hover:border-pink-400 hover:bg-pink-50'
            }`}
          >
            {holds && <span className="mr-1">🐄</span>}
            {p.username}
          </button>
        );
      })}
      <button
        onClick={() => handleMoveCow(null)}
        aria-pressed={!gameState.pinkCowHolder}
        className={`px-3 py-2 rounded-full text-base border transition-colors ${
          !gameState.pinkCowHolder
            ? 'bg-gray-200 border-gray-400 text-gray-800 font-semibold'
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        Nobody
      </button>
    </div>
  );

  const renderGameContent = () => {
    // Naming the host turns "nothing is happening" into "we are waiting for
    // Sam" — the difference between a room that quietly dies and one where
    // somebody nudges the person holding the button.
    const hostName = (gameState.players || []).find((p) => p.isHost)?.username || '';

    if (gameState.gameStatus === 'waiting') {
      return (
        <div className="space-y-4 text-center">
          <div className="flex flex-col items-center space-y-3">
            <p className="text-lg font-medium">Room Code:</p>
            <div className="flex items-center space-x-2">
              <div className="bg-white px-4 py-2 rounded-lg font-mono text-xl border border-gray-200">
                {roomCode}
              </div>
              <button
                onClick={handleCopyRoomCode}
                className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-1"
                title="Copy room code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {isCopied && <span className="text-base">Copied!</span>}
              </button>
            </div>
          </div>

          {/* Primary invite action — one tap to bring friends in (the create→start
              drop-off was driven by the manual code-copy handoff). */}
          <button
            onClick={handleShareInvite}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {linkCopied ? 'Invite link copied!' : 'Invite friends'}
          </button>
          <p className="text-sm text-gray-500">Shares a link that opens straight to this room — friends just enter their name.</p>

          {/*
            Say WHO everyone is waiting for.

            This used to read "Waiting for players..." to every person in the
            room, and only the host was shown a Start button. So four people
            could sit in a lobby indefinitely, each assuming the game was still
            loading, while the one person who could start it had no idea it was
            on them. Room 49HREF had five players stuck in `waiting` at round 0
            when someone wrote in with "No question displayed" — the question
            was never displayed because the game was never started.

            931 of 2,733 rooms in the last 30 days were created and never
            started. This is the cheapest thing that could move that number.
          */}
          {gameState.isHost ? (
            <p className="text-gray-700 font-medium">
              {gameState.players.length < 2
                ? 'Share the code above — you need one more player to start.'
                : "Everyone in? You're the host, so it's your call to start."}
            </p>
          ) : (
            <p className="text-gray-700 font-medium">
              {hostName ? `Waiting for ${hostName} to start the game…` : 'Waiting for the host to start the game…'}
            </p>
          )}
          {gameState.isHost && (
            <button
              className="btn btn-primary"
              onClick={handleStartGame}
              disabled={gameState.players.length < 2}
            >
              {gameState.players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
            </button>
          )}
          <AdSlot slot={LOBBY_AD_SLOT} format="auto" className="my-2" />

          <div className="mt-4">
            <p className="text-base text-gray-500 mb-2">Players in room:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {gameState.players.map((player) => (
                <div
                  key={player._id}
                  className="bg-purple-50 px-3 py-1 rounded-full text-purple-700 text-base"
                >
                  {player.username} {player._id === gameState.hostId && '(Host)'}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (gameState.roundResults) {
      /*
        Who scored is read from `scoringPlayers` — the server's own list of
        player IDs — not by comparing text.

        The old check was `answer.answer.toLowerCase() === majorityAnswer.toLowerCase()`,
        which compares what the player TYPED against the NORMALISED herd answer.
        Normalisation strips plurals and punctuation, so anyone who typed
        "Chips" when the herd answer was "chip" was shown "Unique" and "0"
        while the server had already given them the point. The badge disagreed
        with the score, on the one screen where players check whether they
        matched.

        `majorityAnswers` is new; older payloads only have `majorityAnswer`, so
        fall back to it rather than showing nothing to a client mid-deploy.
      */
      const rr = gameState.roundResults;
      const herds = rr.majorityAnswers?.length
        ? rr.majorityAnswers
        : (rr.majorityAnswer ? [rr.majorityAnswer] : []);
      const scored = new Set((rr.scoringPlayers || []).map(String));

      /*
        The game is over except it cannot end.

        You win on 8 points AND not holding the cow, and the cow only moves on
        a round with exactly one odd answer. So a leader who takes the cow at 8
        is stuck there until such a round happens, which in an agreeable group
        may be never — room RK6J7L played 34 rounds in this state.

        Nothing on screen said so. The host saw an ordinary Next Round button
        and no reason to press anything else, and the player on 8 just kept not
        winning. Say it outright, to everyone, and put the fix next to it.
      */
      const cowBlocked = gameState.gameStatus === 'in-progress'
        ? (gameState.players || []).find(
            (p) => String(p._id) === String(gameState.pinkCowHolder || '') && (p.score || 0) >= 8
          )
        : null;

      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Round {gameState.currentRound} Results</h2>
            <p className="text-lg text-gray-600">Question: "{gameState.currentQuestion}"</p>
            {/* A tie between two or more herds is not "no result" — everyone in
                a tied herd scores. Saying "no majority answer" while quietly
                awarding points would be the same confusion from the other side. */}
            <div className="inline-block px-4 py-2 bg-green-100 rounded-lg">
              <p className="text-lg">
                {herds.length === 1 ? (
                  <>
                    Majority Answer: <span className="font-bold text-green-700">{herds[0]}</span>
                  </>
                ) : herds.length > 1 ? (
                  <>
                    It's a tie — <span className="font-bold text-green-700">{listHerds(herds)}</span>{' '}
                    {herds.length === 2 ? 'both score' : 'all score'}
                  </>
                ) : (
                  <span className="text-yellow-700">Everyone said something different — no points this round</span>
                )}
              </p>
            </div>
          </div>

          {cowBlocked && (
            <div className="border-2 border-pink-300 bg-pink-50 rounded-xl p-4 space-y-3 text-center">
              <p className="text-lg text-pink-900">
                <span className="font-semibold">{cowBlocked.username}</span> has{' '}
                {cowBlocked.score} points and is holding the pink cow 🐄, so the game
                can't end.
              </p>
              {gameState.isHost ? (
                <>
                  <p className="text-base text-pink-800">
                    Pass the cow to someone else and {cowBlocked.username} wins.
                  </p>
                  {renderCowPicker()}
                </>
              ) : (
                <p className="text-base text-pink-800">
                  {hostName
                    ? `${hostName} can move the cow to end it, or keep playing until someone gives the only odd answer.`
                    : 'The host can move the cow to end it, or keep playing until someone gives the only odd answer.'}
                </p>
              )}
            </div>
          )}

          <AdSlot
            key={`round-ad-${gameState.currentRound}`}
            slot={ROUND_AD_SLOT}
            format="auto"
            className="my-2"
          />

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Player Answers:</h3>
            {gameState.isHost && gameState.gameStatus === 'in-progress' && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAdjust(s => !s)}
                  className="text-base text-gray-500 hover:text-purple-600 underline-offset-2 hover:underline transition-colors"
                  title="Adjust scores for typos or synonyms, or move the pink cow"
                >
                  {/* The old label was "Dispute scores?", which gave no hint
                      that the cow lives in here too. */}
                  {showAdjust ? 'Hide host controls' : 'Fix scores or move the cow'}
                </button>
              </div>
            )}
            {showAdjust && gameState.isHost && gameState.gameStatus === 'in-progress' && (
              <div className="space-y-3 border border-gray-200 rounded-xl p-3 bg-gray-50">
                <p className="text-base text-gray-600">
                  Tap a player's <span className="text-green-700 font-medium">+</span> to award a point (a typo of the herd answer) or <span className="text-red-700 font-medium">−</span> to remove one.
                </p>
                {/* Only one picker on screen. When the game is cow-locked the
                    callout above is already showing this, and two identical
                    rows of names is a question about which one is the real one. */}
                {!cowBlocked && (
                  <div className="space-y-2">
                    <p className="text-base text-gray-600">
                      Pink cow 🐄 — it moves on its own to whoever gives the only odd answer, but you can hand it to anyone.
                    </p>
                    {renderCowPicker()}
                  </div>
                )}
              </div>
            )}
            <div className="grid gap-3">
              {gameState.roundResults.allAnswers.map((answer, index) => {
                const player = gameState.players.find(p => p._id === answer.playerId);
                const isInHerd = scored.has(String(answer.playerId));
                const scoreChange = isInHerd ? '+1' : '0';
                
                return (
                  <div key={index} className="flex flex-wrap justify-between items-center gap-x-3 gap-y-2 p-2 bg-white rounded-md shadow-sm mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">{answer.username}</span>
                      {gameState.pinkCowHolder === answer.playerId && <span title="Pink Cow Holder">🐄</span>}
                      {/* Without whitespace-nowrap "In Herd" wraps to two lines
                          inside a rounded-full pill, which renders as a green
                          circle with the words stacked in it. */}
                      <span className={`text-base px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${
                        herds.length
                          ? isInHerd ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {herds.length ? (isInHerd ? 'In Herd' : 'Unique') : 'No match'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      {/* Not truncated — the answer is the thing people came to
                          this screen to read. It wraps instead. */}
                      <span className="text-gray-600 break-words">"{answer.answer || ''}"</span>
                      <span className="text-base whitespace-nowrap">{player?.score || 0} ({scoreChange})</span>
                      {showAdjust && gameState.isHost && gameState.gameStatus === 'in-progress' && (
                        <span className="flex items-center ml-2 border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                          <button
                            onClick={() => socket.emit('adjust_score', { gameId: gameState.gameId, playerId: answer.playerId, delta: -1 })}
                            className="w-8 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 text-lg font-semibold leading-none"
                            title="Remove a point"
                            aria-label="Remove a point"
                          >
                            −
                          </button>
                          <span className="w-px h-5 bg-gray-200" />
                          <button
                            onClick={() => socket.emit('adjust_score', { gameId: gameState.gameId, playerId: answer.playerId, delta: 1 })}
                            className="w-8 h-7 flex items-center justify-center text-green-600 hover:bg-green-50 text-lg font-semibold leading-none"
                            title="Award a point"
                            aria-label="Award a point"
                          >
                            +
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Same omission as the lobby: the host got a button and everyone
              else got silence, so "How to go to next round" was a fair
              question with no answer anywhere on the screen. */}
          {gameState.gameStatus === 'in-progress' && (
            <div className="text-center mt-6">
              {gameState.isHost ? (
                <button
                  onClick={() => socket.emit('next_round', { gameId: gameState.gameId })}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Next Round
                </button>
              ) : (
                <p className="text-gray-700 font-medium">
                  {hostName ? `Waiting for ${hostName} to start the next round…` : 'Waiting for the host to start the next round…'}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Round {gameState.currentRound}
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
          {gameState.playersAnswered} of {gameState.players.length} players answered
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

  useEffect(() => {
    // Reset the adjust-scores panel whenever the round changes
    setShowAdjust(false);
  }, [gameState.currentRound, gameState.roundResults]);

  useEffect(() => {
    // Clean up session when game completes
    if (gameState.gameStatus === 'completed') {
      localStorage.removeItem('gameSession');
    }
  }, [gameState.gameStatus]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Joining Game...</h1>
          <p>Please wait while we connect you to the game.</p>
        </div>
      </div>
    );
  }

  if (gameState.winner) {
    // Sort players by score in descending order
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={200}
        />
        <div className="bg-white rounded-lg shadow-2xl p-8 m-4 max-w-sm w-full space-y-8 relative z-10">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold text-gray-800">Game Over!</h1>
            <div className="py-4">
              <p className="text-xl font-semibold text-purple-600">
                Congratulations!
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {gameState.winner.username}
              </p>
              <p className="text-lg text-gray-600 mt-1">
                wins with <span className="font-bold text-purple-600">{gameState.winner.score}</span> points!
              </p>
            </div>

            <AdSlot slot={GAMEOVER_AD_SLOT} format="auto" className="my-2" />

            {/* Final Scoreboard */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Final Scores</h2>
              <div className="space-y-2">
                {sortedPlayers.map((player, index) => (
                  <div 
                    key={player._id}
                    className={`flex justify-between items-center p-2 rounded ${
                      player._id === gameState.winner._id ? 'bg-purple-100' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{index + 1}.</span>
                      <span className={player._id === gameState.winner._id ? 'font-semibold' : ''}>
                        {player.username}
                      </span>
                      {gameState.pinkCowHolder === player._id && (
                        <span className="text-base">🐄</span>
                      )}
                    </div>
                    <span className="font-semibold">
                      {player.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleLeaveGame}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
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

      {/* GameRoom does not use MeadowLayout, so it did not inherit the footer's
          report link — the original Herd Mentality room was the one place a
          stuck player had no way to tell us. */}
      <div className="mt-6 text-center">
        <ReportProblem />
      </div>
    </div>
  );
};

export default GameRoom;
