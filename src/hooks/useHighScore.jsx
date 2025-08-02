import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = 'SNAKE_HIGH_SCORE'

const useHighScore = () => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const loadHighScore = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const score = stored ? parseInt(stored, 10) : 0;
        setHighScore(score);
      } catch (error) {
        console.warn('Failed to load high score from localStorage:', error);
        setHighScore(0);
      }
    };

    loadHighScore();
  }, [])

  const saveHighScore = useCallback((score) => {
    try {
      localStorage.setItem(STORAGE_KEY, score.toString());
      setHighScore(score);
    } catch (error) {
      console.warn('Failed to save high score to localStorage:', error);
    }
  }, []);

  const updateHighScore = useCallback((currentScore) => {
    if (currentScore > highScore) {
      saveHighScore(currentScore);
      return true;
    }
    return false;
  }, [highScore, saveHighScore]);



  return {
    highScore,
    updateHighScore,
    saveHighScore
  };
}

export default useHighScore;