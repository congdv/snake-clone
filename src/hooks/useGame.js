import { useCallback, useEffect, useState } from 'react';

import useInterval from '../hooks/useInterval';
import useGameAudio from './useGameAudio';
import useHighScore from './useHighScore';

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
const getResponsiveBoardSize = (initWidth, initHeight) => {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    return {
      width: 11,
      height: 18
    };
  }
  return {
    width: initWidth,
    height: initHeight
  };
};

const useGame = (initWidth = 12, initHeight = 12) => {
  const { width, height } = getResponsiveBoardSize(initWidth, initHeight);
  const [board] = useState(() => getInitBoard(width, height));
  const [state, setState] = useState(gameState.PAUSED);
  const [snake, setSnake] = useState([
    { x: Math.floor(width / 2), y: Math.floor(height / 2) },
    { x: Math.floor(width / 2), y: Math.floor(height / 2) + 1 }
  ]);
  const [foodPosX, setFoodX] = useState(() => Math.floor(Math.random() * width));
  const [foodPosY, setFoodY] = useState(() => Math.floor(Math.random() * height));
  const [currDirection, setDirection] = useState(direction.UP);
  const [apples, setApples] = useState(0);
  const { highScore, updateHighScore } = useHighScore();
  const {
    playMoveSound,
    playEatSound,
    playGameOverSound,
    playPauseSound,
    playStartSound,
    toggleMute,
    musicLoaded,
    startBackgroundMusic,
    isMuted,
  } = useGameAudio();


  const generateNewFoodPosition = useCallback((currentSnake = snake) => {
    let newX, newY;
    let attempts = 0;
    const maxAttempts = width * height;

    do {
      newX = Math.floor(Math.random() * width);
      newY = Math.floor(Math.random() * height);
      attempts++;
    } while (
      attempts < maxAttempts &&
      currentSnake.some(segment => segment.x === newX && segment.y === newY)
    );

    newX = Math.max(0, Math.min(newX, width - 1));
    newY = Math.max(0, Math.min(newY, height - 1));

    setFoodX(newX);
    setFoodY(newY);
  }, [width, height, snake]);

  const up = useCallback(() => {
    if (currDirection !== direction.DOWN) {
      setDirection(direction.UP);
    }
  }, [currDirection]);

  const down = useCallback(() => {
    if (currDirection !== direction.UP) {
      setDirection(direction.DOWN);
    }
  }, [currDirection]);

  const left = useCallback(() => {
    if (currDirection !== direction.RIGHT) {
      setDirection(direction.LEFT);
    }
  }, [currDirection]);

  const right = useCallback(() => {
    if (currDirection !== direction.LEFT) {
      setDirection(direction.RIGHT);
    }
  }, [currDirection]);

  const togglePause = () => {
    if (state === gameState.GAMEOVER) return;
    const newState = state === gameState.PAUSED ? gameState.RUNNING : gameState.PAUSED;
    setState(newState);
    if (newState === gameState.RUNNING) {
      playStartSound();
    } else {
      playPauseSound();
    }
  };

  const restart = () => {
    setState(gameState.PAUSED);
    setSnake([
      { x: Math.floor(width / 2), y: Math.floor(height / 2) },
      { x: Math.floor(width / 2), y: Math.floor(height / 2) + 1 }
    ]);
    setDirection(direction.UP);
    setApples(0);
    setFoodX(Math.floor(Math.random() * width));
    setFoodY(Math.floor(Math.random() * height));
    playStartSound();
  };

  useInterval(() => {
    if (state === gameState.PAUSED || state === gameState.GAMEOVER) return;

    const head = snake[0];
    let newX = head.x;
    let newY = head.y;

    switch (currDirection) {
      case direction.UP:
        newY = head.y - 1;
        break;
      case direction.DOWN:
        newY = head.y + 1;
        break;
      case direction.LEFT:
        newX = head.x - 1;
        break;
      case direction.RIGHT:
        newX = head.x + 1;
        break;
      default:
        break;
    }

    if (newX < 0) {
      newX = width - 1;
    } else if (newX >= width) {
      newX = 0;
    }

    if (newY < 0) {
      newY = height - 1;
    } else if (newY >= height) {
      newY = 0;
    }

    const newHead = { x: newX, y: newY };

    const collision = snake.slice(1).some(segment =>
      segment.x === newHead.x && segment.y === newHead.y
    );

    if (collision) {
      updateHighScore(apples)
      setState(gameState.GAMEOVER);
      playGameOverSound();
      return;
    }

    const ateFood = newX === foodPosX && newY === foodPosY;
    const newSnake = [newHead, ...snake];

    if (!ateFood) {
      newSnake.pop();
      playMoveSound()
    } else {
      setApples(prev => prev + 1);
      generateNewFoodPosition(newSnake);
      playEatSound();
    }

    setSnake(newSnake);
  }, Math.floor((1000 * 22) / 60));

  useEffect(() => {
    generateNewFoodPosition();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (musicLoaded) {
      startBackgroundMusic();
    }

  }, [musicLoaded, startBackgroundMusic]);


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
    highScore,
    togglePause,
    restart,

    toggleMute,
    isMuted
  };
};

export default useGame;
