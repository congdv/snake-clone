import { useGameContext } from "../contexts/GameContext";
import { gameState } from "../hooks/useGame";
import "./Dashboard.css";
import Help from "./Help";
import Stats from "./Stats";

const Dashboard = () => {
  const { apples, state, highScore } = useGameContext();
  return (
    <div className="dashboard">
      <Stats score={apples} highScore={highScore} />
      <div className="state-bar">
        {state === gameState.GAMEOVER && 'Game over'}
        {state === gameState.PAUSED && 'Game paused'}
        {state === gameState.RUNNING && 'Game running'}
      </div>
      <Help />
    </div>
  )
}

export default Dashboard;