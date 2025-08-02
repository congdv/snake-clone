import './App.css';
import GameBoy from './components/GameBoy.jsx';
import GameBoyScreen from './components/GameBoyScreen.jsx';
import { GameProvider } from './contexts/GameContext.jsx';
import useGame from './hooks/useGame';

function App() {
  const gameControls = useGame();

  return (
    <GameProvider>
      <div className="App">
        <GameBoy>
          <GameBoyScreen />
        </GameBoy>
      </div>
    </GameProvider>
  );
}

export default App;
