import React, {useState} from 'react';
import Header from './components/Header';
import SignUpModal from './components/SignUpModal';
import Message from './components/Message';
import './App.css';
import { Button ,Icon, Modal, SideNav, SideNavItem, TextInput, Textarea } from 'react-materialize';

const SelectContact = (contact: Contact) : void => {
  
}

const App: React.FC = () => {

  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [signUpModal, setSignUpModal] = useState(true);
  const overlayStyle = {
    display: sideBarVisible||signUpModal?"block":"none", 
    opacity: sideBarVisible?1:0
  };
  const signUp = ():boolean=>{return true}
  const signUpError = ():void=>{}
  return (
    <div>
      <Header sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} onContactClick={SelectContact}/>
      <main>
        <div className='container'>
          <Message message="test" currentUser={true} />
          <Message message="test2" currentUser={false} />

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
      <SignUpModal visible={signUpModal} signUp={signUp} signUpError={signUpError} setVisible={setSignUpModal}/>
      <div className="sidenav-overlay" style={overlayStyle} onClick={()=>{setSideBarVisible(false);}}></div>
    </div>
  );
}

export default App;
