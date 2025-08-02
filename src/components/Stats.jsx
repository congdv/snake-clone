import React from 'react';
import "./Stats.css";

const Stats = ({ score = 0, highScore = 0 }) => {
  return (
    <>
      <div className="scores">
        <div className="score">
          <div>Score:</div>
        </div>
        <div className="values">
          <div>{score}</div>
        </div>
      </div>
      <div className="scores">
        <div className="score">
          <div>High Score:</div>
        </div>
        <div className="values">
          <div>{highScore}</div>
        </div>
      </div>
    </>
  )
}

export default React.memo(Stats);