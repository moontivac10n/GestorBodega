import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Button from '@mui/material/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <img src={logo} className="App-logo" alt="logo" />
        <div>
      <h1>¡Hola, Bonva!</h1>
      <Button variant="contained" color="primary">
        ¡Haz clic aquí!
      </Button>
    </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <Footer />
      </header>
    </div>
  );
}

export default App;
