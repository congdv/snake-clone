import { createContext, useContext } from 'react';
import useGame from '../hooks/useGame';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const gameControls = useGame();

  return (
    <GameContext.Provider value={gameControls}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};