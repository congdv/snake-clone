import React from 'react';
import "./Help.css";

const Help = () => {
  return (
    <div className="help">
      <div className="help-section">
        <div className="help-title">CONTROLS</div>

        <div className="control-group">
          <div className="control-label">MOVE</div>
          <div className="control-methods">
            <div className="method">
              <span className="gameboy-control">D-PAD</span>
              <span className="keyboard-control">↑↓←→</span>
            </div>
          </div>
        </div>

        <div className="control-group">
          <div className="control-label">PAUSE</div>
          <div className="control-methods">
            <div className="method">
              <span className="gameboy-control">A / START</span>
              <span className="keyboard-control">SPACE</span>
            </div>
          </div>
        </div>

        <div className="control-group">
          <div className="control-label">RESTART</div>
          <div className="control-methods">
            <div className="method">
              <span className="gameboy-control">SELECT</span>
              <span className="keyboard-control">R</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Help);