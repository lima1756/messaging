import React, {useState} from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import SignUpModal from './components/SignUpModal';
import './App.css';
import { Button ,Icon, Textarea } from 'react-materialize';
import ls from 'local-storage';
import socketIOClient from "socket.io-client";
import request from 'superagent';
import {Secrets} from './secrets/secrets';
import Primes from './constants/primes';
import int from 'int';

const powerModulus = (base: number, exponent: number, modulo: number) : number => {
  let intBase = int(base);
  let intExponent = int(exponent);
  let intModulo = int(modulo);
  let res = int(1);
  intBase = intBase.mod(intModulo);
  while(parseInt(intExponent.toString())>0){
    if( intExponent.mod(2).toString() === int(1).toString()){
      
      res = res.mul(intBase).mod(intModulo);
    }
    intExponent = intExponent.div(2);
    intBase = intBase.mul(intBase).mod(intModulo);
  }
  return parseInt(res.toString());
}


const cypher = (msg: string, key: number[]) : string => {
  let encrypted = ""
  for(let i = 0; i < msg.length; i++){
    encrypted += powerModulus(msg.charCodeAt(i), key[1], key[0])+ ',';
  }
  return encrypted;
}

const decypher = (msg: string, key: number[]) : string => {
  let decrypted = ""
  const msgData = msg.split(',').map(val=>parseInt(val));
  for(let i = 0; i < msgData.length-1; i++){
    console.log("enc - " + msgData[i] + ' #### dec - ' + powerModulus(msgData[i], key[2], key[0]));
    decrypted += String.fromCharCode(powerModulus(msgData[i], key[2], key[0]));
  }
  return decrypted;
}


const gcdExt = (a: number, b: number) : number[] => {
  if(b === 0)
    return [a, 1, 0];
  let [gcd, x, y] = gcdExt(b, a%b);
  return [gcd, y, x - Math.floor(a/b) * y];
}

const genKeysRSA = () => {
  const p = Primes[Math.floor(Math.random()*2000)];
  const q = Primes[Math.floor(Math.random()*2000)];
  const n = p*q;
  const phi = (p-1)*(q-1);
  let gcd = 0;
  let e  = 0;
  let d = 0;
  for(e = 3; e < phi; e++){ 
    [gcd, d, ] = gcdExt(e,phi);
    if(gcd===1) {break;} 
  }
  console.log(phi);
  return [n, e, d>0?d:phi+d];
}

const App: React.FC = () => {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [signUpModal, setSignUpModal] = useState(ls("current")===null);
  const [currentUser, setCurrentUser] = useState<Contact>(ls("current") as unknown as Contact);
  const [currentChat, setCurrentChat] = useState();
  const [friendList, setFriendList] = useState(ls("friends") as any||{});

  const helpUser : Contact = {
    name: "Welcome!",
    image: "person.jpg",
    email: "",
    publicKey: "",
  }

  const socket = socketIOClient.connect("http://localhost:3002");
  socket.on("addFriend", (data: any)=>{
    if(data.userExist){
      const list = Object.assign({}, friendList);
      if(!list[data.user.email])
      {
        list[data.user.email] = data.user;
        list[data.user.email].messages = [];
      }
      else{
        list[data.user.email].name = data.user.name;
        list[data.user.email].email = data.user.email;
        list[data.user.email].image = data.user.image;
        list[data.user.email].publicKey = data.user.name;
      }
      setFriendList(list);
      ls("friends", list);
    }
    else {
      alert("User doesn't exist, please check the email.")
    }
  });
  socket.on("sendMsg", (data: any)=>{
    const decypherMsg = data.message
  })

  if(currentUser){
    socket.emit("signup", currentUser);
  };
 
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
              ls("keys",keys);
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

  const addFriend = (email: string): void => {
    socket.emit("addFriend", {
      from: currentUser,
      friendEmail: email,
    });
  }

  const selectContact = (contact: Contact) : void => {
    setCurrentChat(contact);
  }

  const overlayStyle = {
    display: sideBarVisible||signUpModal?"block":"none", 
    opacity: sideBarVisible?1:0
  };
 
  return (
    <div>
      <Header currentUser={currentUser} sideBarVisible={sideBarVisible} 
        setSideBarVisible={setSideBarVisible} onContactClick={selectContact} 
        chatUser={currentChat ? currentChat : helpUser}
        addFriend={addFriend} contacts={friendList}/>
      <Chat currentChat={currentChat} user={currentUser}/>
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
