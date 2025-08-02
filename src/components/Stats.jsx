import React from 'react';
import "./Stats.css";

const Stats = ({ apples }) => {
  return (
    <>
      <div className="scores">
        <div className="score">
          <div>Score:</div>
        </div>
        <div className="values">
          <div>{apples}</div>
        </div>
      </div>
    </>
  )
}

export default React.memo(Stats);