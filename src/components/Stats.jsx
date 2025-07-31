import React from 'react';

const Stats = ({apples}) => {
  return (
    <>
      <div className="scores border">
        <div className="score">
          <div>Apples:</div>
        </div>
        <div className="values">
          <div>{apples}</div>
        </div>
      </div>
    </>
  )
}

export default React.memo(Stats);