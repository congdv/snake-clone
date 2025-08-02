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
  const isMobile = window.innerWidth <= 768;
  // Should have better logic to determine the width and height for the board
  if (isMobile) {
    width = 11;
    height = 18;
  }
  return new Array(height).fill(new Array(width)).map((line) => line.fill(0));
};


const useGame = (width = 12, height = 12) => {
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

  const generateNewFoodPosition = useCallback((currentSnake = snake) => {
    let newX, newY;
    let attempts = 0;
    const maxAttempts = width * height; // Prevent infinite loop

    do {
      newX = Math.floor(Math.random() * width);
      newY = Math.floor(Math.random() * height);
      attempts++;
    } while (
      attempts < maxAttempts &&
      currentSnake.some(segment => segment.x === newX && segment.y === newY)
    );

    setFoodX(newX);
    setFoodY(newY);
  }, [width, height]);

  const up = useCallback(() => {
    // Prevent moving directly backwards into the snake body
    if (currDirection !== direction.DOWN) {
      setDirection(direction.UP);
    }
  }, [currDirection]);

  const down = useCallback(() => {
    // Prevent moving directly backwards into the snake body
    if (currDirection !== direction.UP) {
      setDirection(direction.DOWN);
    }
  }, [currDirection]);

  const left = useCallback(() => {
    // Prevent moving directly backwards into the snake body
    if (currDirection !== direction.RIGHT) {
      setDirection(direction.LEFT);
    }
  }, [currDirection]);

  const right = useCallback(() => {
    // Prevent moving directly backwards into the snake body
    if (currDirection !== direction.LEFT) {
      setDirection(direction.RIGHT);
    }
  }, [currDirection]);

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
    setDirection(direction.UP);
    setApples(0);
    setFoodX(Math.floor(Math.random() * width));
    setFoodY(Math.floor(Math.random() * height));
  };

  useInterval(() => {
    if (state === gameState.PAUSED || state === gameState.GAMEOVER) return;

    const head = snake[0];
    let newX = head.x;
    let newY = head.y;

    // Calculate new head position based on direction
    switch (currDirection) {
      case direction.UP:
        newY = head.y === 0 ? height - 1 : head.y - 1;
        break;
      case direction.DOWN:
        newY = newY === height - 1 ? 0 : newY + 1;
        break;
      case direction.LEFT:
        newX = newX === 0 ? width - 1 : newX - 1;
        break;
      case direction.RIGHT:
        newX = newX === width - 1 ? 0 : newX + 1;
        break;
      default:
        break;
    }

    const newHead = { x: newX, y: newY };

    // Check for collision with self BEFORE creating new snake
    // We check against the current snake body (excluding head which will be replaced)

    const collision = snake.slice(1).some(segment =>
      segment.x === newHead.x && segment.y === newHead.y
    );


    if (collision) {
      setState(gameState.GAMEOVER);
      return;
    }

    // Check if food is eaten
    const ateFood = newX === foodPosX && newY === foodPosY;

    // Create new snake
    const newSnake = [newHead, ...snake];

    // If no food eaten, remove tail (snake doesn't grow)
    if (!ateFood) {
      newSnake.pop();
    } else {
      // Food eaten - snake grows, generate new food, increment score
      setApples(prev => prev + 1);
      generateNewFoodPosition(newSnake);
    }

    setSnake(newSnake);
  }, Math.floor((1000 * 22) / 60));

  // Initialize food position on mount and when snake changes
  useEffect(() => {
    generateNewFoodPosition();
  }, []);

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
