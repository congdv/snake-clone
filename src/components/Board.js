import React from 'react';

import Cell from './Cell';
import useKeyboard from '../hooks/useKeyboard';
import useGame, { gameState } from '../hooks/useGame';
import Help from './Help';
import Stats from './Stats';

const Board = () => {
  const { state, board, foodPosX, foodPosY, snake, up, down, right, left, apples, togglePause, restart } = useGame();

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
      <Help />
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

      <div className="stats">
        <Stats apples={apples} />
        <div className="state-bar border">
          {state === gameState.GAMEOVER ? 'Game over' : state === gameState.PAUSED ? ' Game paused' : '.....'}
        </div>
      </div>
    </div>
  );
};

export default Board;
