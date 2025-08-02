import { useGameContext } from '../contexts/GameContext';
import { gameState } from '../hooks/useGame';
import './GameBoy.css';

const GameBoy = ({ children }) => {
  const { state, up, down, left, right, togglePause, restart, toggleMute, isMuted } = useGameContext();

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
        <div className="gameboy-top">
          <div className="gameboy-brand">
            <div className="nintendo-text">Brick Game</div>
            <div className="gameboy-text">RETRO</div>
          </div>
          <div className="gameboy-top-right">
            <div className={`power-led ${state === gameState.RUNNING ? 'power-on' : ''}`}></div>
            <button
              className={`mute-button ${isMuted ? 'muted' : ''}`}
              onClick={toggleMute}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                // Muted icon (speaker with X)
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                // Unmuted icon (speaker with sound waves)
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <a
              href="https://github.com/congdv/snake-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              title="View Source Code"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>

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
                // onTouchStart={() => handleDPadPress('up')}
                onClick={() => handleDPadPress('up')}
                aria-label="Up"
              >
                ▲
              </button>
              <button
                className="dpad-button dpad-left"
                // onTouchStart={() => handleDPadPress('left')}
                onClick={() => handleDPadPress('left')}
                aria-label="Left"
              >
                ◀
              </button>
              <div className="dpad-center"></div>
              <button
                className="dpad-button dpad-right"
                // onTouchStart={() => handleDPadPress('right')}
                onClick={() => handleDPadPress('right')}
                aria-label="Right"
              >
                ▶
              </button>
              <button
                className="dpad-button dpad-down"
                // onTouchStart={() => handleDPadPress('down')}
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
                // onTouchStart={() => handleActionButton('B')}
                onClick={() => handleActionButton('B')}
              >
                B
              </button>
              <button
                className="action-button button-a"
                // onTouchStart={() => handleActionButton('A')}
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
              // onTouchStart={() => handleActionButton('SELECT')}
              onClick={() => handleActionButton('SELECT')}
            >
              SELECT
            </button>
            <button
              className="control-button start-button"
              // onTouchStart={() => handleActionButton('START')}
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
