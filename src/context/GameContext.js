import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  gameId: null,
  roomCode: null,
  playerId: null,
  isHost: false,
  players: [],
  currentRound: 0,
  currentQuestion: '',
  gameStatus: 'waiting', // waiting, in-progress, completed
  pinkCowHolder: null,
  roundResults: null,
  playersAnswered: 0,
  winner: null,
  /*
    The wait, described well enough to draw.

    All of this comes from the server, and it exists because "Waiting for other
    players…" — the entire previous UI for this state — told a room nothing it
    could act on. `waitingFor` names the people we are actually short of;
    `hasAnswered` is the server's answer rather than a local flag that reset on
    every remount and handed refreshers the answer box for a question they had
    already answered; `roundEndsAt` / `resultsAt` are when the escape hatches
    stop being the host's alone.
  */
  waitingFor: [],
  totalPlayers: 0,
  hasAnswered: false,
  roundEndsAt: null,
  resultsAt: null,
  unlockAfterMs: 60000
};

/*
  At the start of a round we are waiting for EVERYONE.

  This used to be an empty list until the first answer arrived and the server
  sent its first progress broadcast. Empty reads as "nobody outstanding", so for
  the opening seconds of every round the screen said "that's everyone, scoring
  the round…" and hid the escape hatches — the same dead state the whole fix is
  about, just one beat earlier. Caught by e2e/herd-stuck.spec.js on the one
  scenario where nobody answers at all, which is exactly when it matters.
*/
/*
  Translate a server deadline into THIS browser's clock.

  Both deadlines arrived as absolute server timestamps and were compared against
  a local Date.now(). The server allows three seconds of skew, which covers a
  clock that is slightly off and not one that is ten minutes out — and phones
  with badly wrong clocks are not rare. Such a player either never saw the
  escape hatch at all (clock behind: the precise dead screen this work exists to
  remove) or saw it immediately and got a red refusal from a server that
  disagreed.

  Only the DIFFERENCE between the two clocks travels, so the countdown is
  correct on any clock. Falls back to the raw value if a server has not sent its
  own time yet — a client can be newer than the backend during a deploy.
*/
const toLocalDeadline = (serverDeadline, serverNow) => {
  if (!serverDeadline) return null;
  if (!serverNow) return serverDeadline;
  return Date.now() + (serverDeadline - serverNow);
};

const everyoneOutstanding = (players) => (players || [])
  .filter((p) => p.isConnected !== false)
  .map((p) => ({ id: String(p._id), username: p.username }));

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'GAME_CREATED':
      return {
        ...state,
        gameId: action.payload.gameId,
        roomCode: action.payload.roomCode,
        playerId: action.payload.playerId,
        isHost: true,
        // The host is in the room. Nothing else tells us that until a second
        // player arrives, so the lobby counted zero people and asked for one
        // friend too many.
        players: action.payload.players || state.players
      };
    
    /*
      Take isHost from the server, never assume it.

      This hardcoded `false`, which is wrong for the host arriving through
      join_game rather than create_game — a fresh tab, the invite link, a
      cleared localStorage. They were shown the player's screen with no Start
      button, and since only the host can start, the room could not begin.
    */
    case 'GAME_JOINED':
      return {
        ...state,
        gameId: action.payload.gameId,
        playerId: action.payload.playerId,
        isHost: !!action.payload.isHost,
        currentRound: action.payload.currentRound ?? state.currentRound,
        currentQuestion: action.payload.currentQuestion ?? state.currentQuestion,
        gameStatus: action.payload.gameStatus || state.gameStatus,
        pinkCowHolder: action.payload.pinkCowHolder ?? state.pinkCowHolder,
        players: action.payload.players || state.players,
        roundResults: action.payload.roundResults ?? state.roundResults,
        playersAnswered: action.payload.playersAnswered ?? 0,
        totalPlayers: action.payload.totalPlayers ?? 0,
        waitingFor: action.payload.waitingFor || [],
        hasAnswered: !!action.payload.hasAnswered,
        roundEndsAt: toLocalDeadline(action.payload.roundEndsAt, action.payload.serverNow),
        resultsAt: toLocalDeadline(action.payload.resultsAt, action.payload.serverNow),
        unlockAfterMs: action.payload.unlockAfterMs ?? state.unlockAfterMs
      };

    case 'PLAYERS_UPDATED':
      return {
        ...state,
        players: action.payload.players
      };

    case 'GAME_STARTED':
      return {
        ...state,
        gameStatus: 'in-progress',
        currentRound: action.payload.gameState.currentRound,
        currentQuestion: action.payload.gameState.currentQuestion,
        players: action.payload.players,
        roundEndsAt: toLocalDeadline(action.payload.roundEndsAt, action.payload.serverNow),
        resultsAt: null,
        roundResults: null,
        hasAnswered: false,
        waitingFor: everyoneOutstanding(action.payload.players),
        totalPlayers: everyoneOutstanding(action.payload.players).length,
        playersAnswered: 0
      };

    // Now carries WHO, not just how many. The count alone is what made the old
    // screen unactionable — "2 of 3 answered" never told anybody which of them
    // to nudge.
    case 'PLAYER_ANSWERED':
      return {
        ...state,
        playersAnswered: action.payload.playersAnswered,
        totalPlayers: action.payload.totalPlayers ?? state.totalPlayers,
        waitingFor: action.payload.waitingFor || [],
        roundEndsAt: action.payload.roundEndsAt
          ? toLocalDeadline(action.payload.roundEndsAt, action.payload.serverNow)
          : state.roundEndsAt,
        hasAnswered: Array.isArray(action.payload.answeredIds) && state.playerId
          ? action.payload.answeredIds.map(String).includes(String(state.playerId))
          : state.hasAnswered
      };

    case 'ROUND_COMPLETED':
      return {
        ...state,
        roundResults: action.payload.results,
        players: action.payload.players,
        pinkCowHolder: action.payload.pinkCowHolder,
        winner: action.payload.winner,
        playersAnswered: 0,
        waitingFor: [],
        hasAnswered: false,
        roundEndsAt: null,
        resultsAt: toLocalDeadline(action.payload.resultsAt, action.payload.serverNow) ?? Date.now(),
        unlockAfterMs: action.payload.unlockAfterMs ?? state.unlockAfterMs
      };

    case 'NEXT_ROUND':
      return {
        ...state,
        currentRound: action.payload.roundNumber,
        currentQuestion: action.payload.question,
        roundResults: null,
        hasAnswered: false,
        waitingFor: everyoneOutstanding(state.players),
        totalPlayers: everyoneOutstanding(state.players).length,
        playersAnswered: 0,
        resultsAt: null,
        roundEndsAt: toLocalDeadline(action.payload.roundEndsAt, action.payload.serverNow)
      };

    // The server refused this answer. 'already-answered' is the truth the client
    // was missing after a refresh; 'round-over' is not the player's fault and
    // must not be shown as a failure.
    case 'ANSWER_REJECTED':
      return {
        ...state,
        hasAnswered: action.payload.reason === 'already-answered' ? true : state.hasAnswered
      };

    case 'GAME_COMPLETED':
      return {
        ...state,
        gameStatus: 'completed',
        winner: action.payload.winner
      };

    case 'RESET_GAME':
      return initialState;

    case 'PINK_COW_MOVED':
      return {
        ...state,
        pinkCowHolder: action.payload.pinkCowHolder,
        players: action.payload.players || state.players
      };

    /*
      Rebuilding from initialState here quietly reset isHost to false.

      A host who refreshed, locked their phone, or had a tab restored came back
      as an ordinary player: no Start button, no Next Round button. The server
      agreed with that verdict for its own reason (a stale socket id), so the
      room was finishable by nobody. Both halves are fixed; the server now sends
      isHost and this reads it.

      gameStatus was hardcoded 'in-progress' too, which put a host who refreshed
      in the LOBBY straight into the round view of a game that had not started.
    */
    case 'GAME_REJOINED':
      return {
        ...initialState,
        gameId: action.payload.gameId,
        playerId: action.payload.playerId,
        roomCode: action.payload.roomCode,
        isHost: !!action.payload.isHost,
        gameStatus: action.payload.gameState.gameStatus || 'in-progress',
        currentRound: action.payload.gameState.currentRound,
        currentQuestion: action.payload.gameState.currentQuestion,
        players: action.payload.gameState.players || [],
        pinkCowHolder: action.payload.gameState.pinkCowHolder,
        playersAnswered: action.payload.gameState.playersAnswered || 0,
        totalPlayers: action.payload.gameState.totalPlayers || 0,
        waitingFor: action.payload.gameState.waitingFor || [],
        hasAnswered: !!action.payload.gameState.hasAnswered,
        roundEndsAt: toLocalDeadline(action.payload.gameState.roundEndsAt, action.payload.gameState.serverNow),
        resultsAt: toLocalDeadline(action.payload.gameState.resultsAt, action.payload.gameState.serverNow),
        unlockAfterMs: action.payload.gameState.unlockAfterMs ?? 60000,
        // Comes back null mid-round, which is what initialState had anyway.
        // When the round IS finished this is the difference between the results
        // screen and an answer box for a round already scored.
        roundResults: action.payload.gameState.roundResults || null
      };

    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
