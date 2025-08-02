const Square = ({ isHighlight, isFood, isGameOver }) => {
  const highlight = () => {
    let className = 'intern-square';
    if (isHighlight) {
      className += ' highlight';
    }
    if (isFood) {
      className += ' food';
    }
    if (isHighlight && isFood) {
      className = 'intern-square eat';
    }
    if (isGameOver) {
      className += ' game-over';
    }
    return className;
  };
  return (
    <div className={isHighlight ? 'square highlight' : 'square'}>
      <div className={highlight()} />
    </div>
  );
};

export default Square;
