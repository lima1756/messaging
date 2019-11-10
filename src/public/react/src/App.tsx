import React from 'react';
import logo from './logo.svg';
import './App.css';

async function callExpress() {
  try {
    let response = await fetch('/api/say-hello/LIMA')
      .then(res => res.json().then(json=> alert('Hi this is a response from the backend: ' + json.message)));
    
  } catch (err) {
    alert(err);
  }
}

const App: React.FC = () => {
  callExpress();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
