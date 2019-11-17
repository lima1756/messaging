import React, {useState} from 'react';
import Header from './components/Header';
import SignUpModal from './components/SignUpModal';
import Message from './components/Message';
import './App.css';
import { Button ,Icon, Textarea } from 'react-materialize';
import ls from 'local-storage';
import socketIOClient from "socket.io-client";
import request from 'superagent';
import {Secrets} from './secrets/secrets';
import Primes from './constants/primes';


const SelectContact = (contact: Contact) : void => {
  
}

const gcd = (n: number, m: number) : number => {
  if(m===0)
    return n;
  return gcd(m, n%m);
}

const genKeysRSA = () => {
  const p = Primes[Math.floor(Math.random()*2000)];
  const q = Primes[Math.floor(Math.random()*2000)];
  const n = p*q;
  const phi = (p-1)*(q-1);
  let e : number;
  for(e = 3; e < phi && gcd(e,phi)===1; e++){ continue; }
  let d : number;
  for(d = phi-1; (e * d) % phi == 1; d--) { continue; }
  return [n, e, d];
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
              const keys = genKeysRSA();
              const user : Contact = {
                name: name,
                email: email,
                image: response.body.secure_url,
                publicKey: [keys[0], keys[1]]
              }
              ls("current", user);
              ls("p_key",keys[2]);
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
      <SignUpModal visible={signUpModal} signUp={signUp} setVisible={setSignUpModal}/>
      <div className="sidenav-overlay" style={overlayStyle} onClick={()=>{setSideBarVisible(false);}}></div>
    </div>
  );
}

export default App;
