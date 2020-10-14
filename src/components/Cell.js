import React from 'react';

const Square = ({isHighlight, isFood}) => {
  const highlight = () => {
    let className = 'intern-square';
    if(isHighlight) {
      className += ' highlight';
    }
    if(isFood) {
      className += ' food';
    }
    if(isHighlight && isFood) {
      className = 'intern-square eat';
    }
    return className;
  }
  return (
    <div className={isHighlight ? 'square highlight': 'square'}>
      <div className={highlight()}/>
    </div>
  )
}

export default Square;