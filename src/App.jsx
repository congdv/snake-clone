import './App.css';
import Board from './components/Board.jsx';
import SnakeLogo from './snake-logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header_container">
          <img src={SnakeLogo} alt="Snake Game Logo" className="App-logo" />
          <h1>Snake Game</h1>
        </div>

      </header>
      <Board />
    </div>
  );
}

export default App;
