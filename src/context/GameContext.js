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
  winner: null
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'GAME_CREATED':
      return {
        ...state,
        gameId: action.payload.gameId,
        roomCode: action.payload.roomCode,
        playerId: action.payload.playerId,
        isHost: true
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
        isHost: !!action.payload.isHost
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
        players: action.payload.players
      };

    case 'PLAYER_ANSWERED':
      return {
        ...state,
        playersAnswered: action.payload.playersAnswered
      };

    case 'ROUND_COMPLETED':
      return {
        ...state,
        roundResults: action.payload.results,
        players: action.payload.players,
        pinkCowHolder: action.payload.pinkCowHolder,
        winner: action.payload.winner,
        playersAnswered: 0
      };

    case 'NEXT_ROUND':
      return {
        ...state,
        currentRound: action.payload.roundNumber,
        currentQuestion: action.payload.question,
        roundResults: null
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
