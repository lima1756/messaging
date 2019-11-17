import React, {useState} from 'react';
import Header from './components/Header';
import SignUpModal from './components/SignUpModal';
import Message from './components/Message';
import './App.css';
import { Button ,Icon, Textarea } from 'react-materialize';
import ls from 'local-storage';
import socketIOClient from "socket.io-client";
import request from 'superagent';
import {Secrets} from './secrets/secrets'


const SelectContact = (contact: Contact) : void => {
  
}



const signUpError = () : void => {

}

const App: React.FC = () => {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [signUpModal, setSignUpModal] = useState(ls("current")===null);
  const [currentUser, setCurrentUser] = useState<Contact>(ls("current") as unknown as Contact);

  

  const socket = socketIOClient.connect("http://localhost:3002");

  const signUp = (name: string, email: string, image: any) : void => {
    if(image){
      request.post(`https://api.cloudinary.com/v1_1/${ Secrets.C_NAME }/upload`)
        .field('upload_preset', 'unique')
        .field('file', image)
        .end((error, response) => {
            if(!error){
              const user : Contact = {
                name: name,
                email: email,
                image: response.body.secure_url,
                publicKey: {}
              }
              ls("current", user);
              setCurrentUser(user);
              socket.emit("signup", user);
              setSignUpModal(false);
            }
            else
            {
              alert("There was an error, please try again later.") 
            }
        });
    }
    
  }

  const overlayStyle = {
    display: sideBarVisible||signUpModal?"block":"none", 
    opacity: sideBarVisible?1:0
  };
 
  return (
    <div>
      <Header currentUser={currentUser} sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} onContactClick={SelectContact}/>
      <main>
        <div className='container'>
          <Message message="test" currentUser={true} image={currentUser.image}/>
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
