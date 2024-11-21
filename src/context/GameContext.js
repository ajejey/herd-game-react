import React, { createContext, useContext, useReducer } from 'react';
import { ObjectId } from 'mongodb';

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
        playerId: new ObjectId(action.payload.playerId),
        isHost: true
      };
    
    case 'GAME_JOINED':
      return {
        ...state,
        gameId: action.payload.gameId,
        playerId: new ObjectId(action.payload.playerId),
        isHost: false
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
        gameStatus: 'completed'
      };

    case 'RESET_GAME':
      return initialState;

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
