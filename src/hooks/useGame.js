import { useCallback, useEffect, useState } from 'react';

import useInterval from '../hooks/useInterval';

const direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

export const gameState = {
  RUNNING: 0,
  PAUSED: 1,
  GAMEOVER: 2
};

const getInitBoard = (width, height) => {
  return new Array(height).fill(new Array(width)).map((line) => line.fill(0));
};

const isCollision = (pieces) => {
  for (let i = 3; i < pieces.length; i++) {
    if (pieces[0].x === pieces[i].x && pieces[0].y === pieces[i].y) {
      return true;
    }
  }
  return false;
};

const useGame = (width = 10, height = 20) => {
  const [board] = useState(() => getInitBoard(width, height));
  const [state, setState] = useState(gameState.PAUSED);
  const [snake, setSnake] = useState([
    { x: 5, y: 5 },
    { x: 5, y: 6 }
  ]);
  const [foodPosX, setFoodX] = useState(parseInt(Math.random() * width));
  const [foodPosY, setFoodY] = useState(parseInt(Math.random() * height));
  const [currDirection, setDirection] = useState(direction.UP);
  const [apples, setApples] = useState(0);

  const newFoodPosX = useCallback(() => {
    setFoodX(parseInt(Math.random() * width));
  }, [width]);

  const newFoodPosY = useCallback(() => {
    setFoodY(parseInt(Math.random() * height));
  }, [height]);

  const up = useCallback(() => {
    setDirection(direction.UP);
  }, []);

  const down = useCallback(() => {
    setDirection(direction.DOWN);
  }, []);

  const left = useCallback(() => {
    setDirection(direction.LEFT);
  }, []);

  const right = useCallback(() => {
    setDirection(direction.RIGHT);
  }, []);

  const togglePause = () => {
    if (state === gameState.GAMEOVER) return;
    setState((prev) => (prev === gameState.PAUSED ? gameState.RUNNING : gameState.PAUSED));
  };

  const restart = () => {
    setState(gameState.PAUSED);
    setSnake([
      { x: 5, y: 5 },
      { x: 5, y: 6 }
    ]);
  };

  useInterval(() => {
    if (state === gameState.PAUSED || state === gameState.GAMEOVER) return;
    const head = snake[0];
    snake.pop();
    let x = head.x;
    let y = head.y;
    switch (currDirection) {
      case direction.UP:
        y = head.y === 0 ? height - 1 : head.y - 1;
        break;
      case direction.DOWN:
        y = y === height - 1 ? 0 : y + 1;
        break;
      case direction.LEFT:
        x = x === 0 ? width - 1 : x - 1;
        break;
      case direction.RIGHT:
        x = x === width - 1 ? 0 : x + 1;
        break;
      default:
        break;
    }
    setSnake([
      {
        x,
        y
      },
      ...snake
    ]);
  }, Math.floor((1000 * 22) / 60));

  /**
   * Food Position
   */
  useEffect(() => {
    //ate food
    if (snake[0].x === foodPosX && snake[0].y === foodPosY) {
      switch (currDirection) {
        case direction.UP:
          setSnake([
            ...snake,
            {
              x: snake[snake.length - 1].x,
              y: snake[snake.length - 1].y - 1
            }
          ]);
          break;
        case direction.DOWN:
          setSnake([
            ...snake,
            {
              x: snake[snake.length - 1].x,
              y: snake[snake.length - 1].y + 1
            }
          ]);
          break;
        case direction.LEFT:
          setSnake([
            ...snake,
            {
              x: snake[snake.length - 1].x - 1,
              y: snake[snake.length - 1].y
            }
          ]);
          break;
        case direction.RIGHT:
          setSnake([
            ...snake,
            {
              x: snake[snake.length - 1].x + 1,
              y: snake[snake.length - 1].y
            }
          ]);
          break;
        default:
          break;
      }
      newFoodPosX();
      newFoodPosY();
      setApples((prev) => prev + 1);
    } else if (isCollision(snake)) {
      setState(gameState.GAMEOVER);
    }
  }, [currDirection, foodPosX, foodPosY, newFoodPosX, newFoodPosY, snake]);

  return {
    state,
    board,
    snake,
    foodPosX,
    foodPosY,
    up,
    down,
    left,
    right,
    apples,
    togglePause,
    restart
  };
};

export default useGame;
