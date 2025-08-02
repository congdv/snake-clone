
import { useGameContext } from '../contexts/GameContext.jsx';
import { gameState } from '../hooks/useGame';
import useKeyboard from '../hooks/useKeyboard';
import './Board.css';
import Cell from './Square.jsx';

const Board = () => {
  const { state, board, foodPosX, foodPosY, snake, up, down, right, left, togglePause, restart } = useGameContext();

  useKeyboard(
    (event) => {
      switch (event.code) {
        case 'ArrowUp':
          up();
          break;
        case 'ArrowDown':
          down();
          break;
        case 'ArrowRight':
          right();
          break;
        case 'ArrowLeft':
          left();
          break;
        case 'Space':
          togglePause();
          break;
        case 'KeyR':
          restart();
          break;
        default:
          break;
      }
      event.preventDefault();
    },
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyR']
  );

  return (
    <div className="board">
      <div className="lines border">
        {board.map((line, y) => (
          <div key={y} className="block-line">
            {line.map((value, x) => {
              // const isHighlight = x === posX && y === posY;
              const isHighlight = snake.some((value) => value.x === x && value.y === y);
              const isFood = x === foodPosX && y === foodPosY;
              return (
                <Cell
                  isHighlight={isHighlight}
                  key={`${x}-${y}`}
                  isFood={isFood}
                  isGameOver={state === gameState.GAMEOVER}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
