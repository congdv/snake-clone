import Board from "./Board";
import Dashboard from "./Dashboard";
import './GameBoyScreen.css';

const GameBoyScreen = () => {
  return (
    <div className="screen-inner" >
      <div className="board-container" >
        <Board />
      </div>
      <div className="dashboard-container">
        <Dashboard />
      </div>
    </div>
  )
}

export default GameBoyScreen;