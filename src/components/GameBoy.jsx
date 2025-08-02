import { useGameContext } from '../contexts/GameContext';
import { gameState } from '../hooks/useGame';
import './GameBoy.css';

const GameBoy = ({ children }) => {
  const { state, up, down, left, right, togglePause, restart } = useGameContext();

  const handleDPadPress = (direction) => {
    switch (direction) {
      case 'up':
        up();
        break;
      case 'down':
        down();
        break;
      case 'left':
        left();
        break;
      case 'right':
        right();
        break;
      default:
        break;
    }
  };

  const handleActionButton = (button) => {
    switch (button) {
      case 'A':
        togglePause();
        break;
      case 'B':
        // Additional functionality can be added here
        break;
      case 'START':
        togglePause();
        break;
      case 'SELECT':
        restart();
        break;
      default:
        break;
    }
  };

  return (
    <div className="gameboy-container">
      <div className="gameboy-body">
        {/* Top section with Nintendo branding */}
        <div className="gameboy-top">
          <div className="gameboy-brand">
            <div className="nintendo-text">Brick Game</div>
            <div className="gameboy-text">RETRO</div>
          </div>
          <div className={`power-led ${state === gameState.RUNNING ? 'power-on' : ''}`}></div>
        </div>

        {/* Screen area */}
        <div className="gameboy-screen-area">
          <div className="screen-label">DOT MATRIX WITH STEREO SOUND</div>
          <div className="gameboy-screen">
            {children}
          </div>
        </div>

        {/* D-Pad and buttons section */}
        <div className="gameboy-controls">
          <div className="dpad-section">
            <div className="dpad-container">
              <button
                className="dpad-button dpad-up"
                onTouchStart={() => handleDPadPress('up')}
                onClick={() => handleDPadPress('up')}
                aria-label="Up"
              >
                ▲
              </button>
              <button
                className="dpad-button dpad-left"
                onTouchStart={() => handleDPadPress('left')}
                onClick={() => handleDPadPress('left')}
                aria-label="Left"
              >
                ◀
              </button>
              <div className="dpad-center"></div>
              <button
                className="dpad-button dpad-right"
                onTouchStart={() => handleDPadPress('right')}
                onClick={() => handleDPadPress('right')}
                aria-label="Right"
              >
                ▶
              </button>
              <button
                className="dpad-button dpad-down"
                onTouchStart={() => handleDPadPress('down')}
                onClick={() => handleDPadPress('down')}
                aria-label="Down"
              >
                ▼
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <div className="ab-buttons">
              <button
                className="action-button button-b"
                onTouchStart={() => handleActionButton('B')}
                onClick={() => handleActionButton('B')}
              >
                B
              </button>
              <button
                className="action-button button-a"
                onTouchStart={() => handleActionButton('A')}
                onClick={() => handleActionButton('A')}
              >
                A
              </button>
            </div>

          </div>
        </div>

        {/* Bottom section with speaker */}
        <div className="gameboy-bottom">
          <div className="select-start-buttons">
            <button
              className="control-button select-button"
              onTouchStart={() => handleActionButton('SELECT')}
              onClick={() => handleActionButton('SELECT')}
            >
              SELECT
            </button>
            <button
              className="control-button start-button"
              onTouchStart={() => handleActionButton('START')}
              onClick={() => handleActionButton('START')}
            >
              START
            </button>
          </div>
          <div className="speaker-grille-wrapper">
            <div className="speaker-grille">
              {Array.from({ length: 3 }, (_, row) => (
                <div key={row} className="speaker-row">
                  {Array.from({ length: 10 }, (_, col) => (
                    <div key={col} className="speaker-hole"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GameBoy;
