import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Icon, Button, SideNav, SideNavItem, Textarea } from 'react-materialize';

const App: React.FC = () => {
  return (
    <div className="App">
      
      <header>
        <SideNav fixed={true}>
          <SideNavItem href="#!icon" icon="cloud">
            First Link  With Icon
          </SideNavItem>
        </SideNav>
      </header>
      <main>
        <div className='container'>
          <div className='row'>
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
          </div>
          
        </div>
      </main>
      <footer className="message-footer">
        <div className="container">
          <div className="row">
          <div className="col s11">
              <Textarea label="Write Your Message" className="messagebox input-field" s={12}/>
            </div>
            <div className="col s1">
              <Button type="submit" waves="light" className="input-field">
                <Icon center>
                send
                </Icon>
              </Button>
            </div>
          </div>
        </div>
          
      </footer>
    </div>
  );
}

export default App;
