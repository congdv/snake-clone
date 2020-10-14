import React from 'react';

const Help =  () => {
  return (
    <div className="help">
      <div className="description">
        <div>&uarr;</div>
        <div>&larr;  &rarr;</div>
        <div>&darr;</div>
        <div>space</div>
      </div>
      <div className="instructions">
        <div>Up</div>
        <div>Left/Right</div>
        <div>Down</div>
        <div>Play/Pause Game</div>
      </div>
    </div>
  )
}

export default React.memo(Help);