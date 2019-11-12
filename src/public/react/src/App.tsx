import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { Icon, Button, SideNav, SideNavItem, TextInput, Textarea } from 'react-materialize';

const App: React.FC = () => {

  const [sideBarVisible, setSideBarVisible] = useState(false);
  const overlayStyle = {
    display: sideBarVisible?"block":"none", 
    opacity: sideBarVisible?1:0
  };
  const switchSideBar = ():void=>{setSideBarVisible(!sideBarVisible)};
  return (
    <div>
      <header>
        <nav className="top-nav">
          <div className="container">
            <div className="nav-wrapper">
              <div className="row">
                <div className="col s1 m1 full hide-on-large-only">
                  <a href="#"  className="top-nav sidenav-trigger lateral-bar-btn" onClick={switchSideBar}>
                    <i className="material-icons">menu</i>
                  </a>
                </div>
                <div className="col s11 m11 l12">
                  <h2 className="header">
                    <div className="col s1 circular user-bubble lg">
                      <img src="person.jpg" alt="" className="circle responsive-img"/>
                    </div>
                    username
                  </h2>
                </div>
                
              </div>
            </div>
          </div>
        </nav>
        <SideNav fixed={true} style={sideBarVisible?{transform:"translateX(0%)"}:{transform:"translateX(-105%)"}}>
          <SideNavItem userView={true} user={{
            background:"mail.jpg",
            name: "John Doe",
            email: "jd@test.com",
            image: "person.jpg"
          }}>
            <div className="background">
              <img src="images/office.jpg"/>
            </div>
            <a href="#user"><img className="circle" src="images/yuna.jpg"/></a>
            <a href="#name"><span className="white-text name">John Doe</span></a>
            <a href="#email"><span className="white-text email">jdandturk@gmail.com</span></a>
          </SideNavItem>
          <SideNavItem divider={true}/>
          <SideNavItem>
            <TextInput icon="group_add" label="Search user" className="search" />
          </SideNavItem>
          <SideNavItem divider={true}/>
          <SideNavItem href="#!icon" icon="person">
            person
          </SideNavItem>
        </SideNav>
      </header>
      <main>
        <div className='container'>

          <div className='row message-block'>
            <div className="col s10 offset-s1">
              <div className="card blue lighten-3">
                <div className="card-content white-text">
                  <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
                </div>
              </div>
            </div>
            <div className="col s1 circular user-bubble">
              <img src="person.jpg" alt="" className="circle responsive-img"/>
            </div>
          </div>

          <div className='row message-block'>
            <div className="col s1 circular user-bubble">
              <img src="person.jpg" alt="" className="circle responsive-img"/>
            </div>
            <div className="col s10">
              <div className="card grey lighten-1">
                <div className="card-content white-text">
                  <p>I am a very simple card. I am good at containing small bits of information.
          I am convenient because I require little markup to use effectively.</p>
                </div>
              </div>
            </div>
            <div className="col s1"></div>
          </div>

        </div>
      </main>
      <footer className="message-footer">
        <div className="container">
          <div className="row">
            <div className="col s11">
              <Textarea label="Write Your Message" className="messagebox input-field" s={12} />
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
      <div className="sidenav-overlay" style={overlayStyle} onClick={switchSideBar}></div>
    </div>
  );
}

export default App;
