import React from 'react';

import Cell from './Cell';
import useKeyboard from '../hooks/useKeyboard';
import useGame from '../hooks/useGame';
import Help from './Help';
import Stats from './Stats';


const Board = () => {
  const { 
    board,
    foodPosX,
    foodPosY,
    snake,
    up,
    down,
    right,
    left,
    apples,
    togglePause
  } = useGame();
  

  useKeyboard((event) => {
    switch(event.code) {
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
      default:
        break;
    }
    event.preventDefault();
  }, ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);


  return (
    <div className="board">
      <Help/>
      <div className="lines border">
        {board.map((line, y) => 
          <div key={y} className="block-line">
            {
              line.map((value, x) => {
                // const isHighlight = x === posX && y === posY;
                const isHighlight = snake.some((value) => value.x === x && value.y === y);
                const isFood = x === foodPosX && y === foodPosY;
                return <Cell isHighlight={isHighlight} key={`${x}-${y}`} isFood={isFood}/>
              })
            }
          </div>
        )}
      </div>
      <div className="stats">
        <Stats apples={apples}/>
      </div>
    </div>
  )
}

export default Board;