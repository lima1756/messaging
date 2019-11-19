import './App.css';
import React, {useState} from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import SignUpModal from './components/SignUpModal';
import ls from 'local-storage';
import socketIOClient from "socket.io-client";
import request from 'superagent';
import {Secrets} from './secrets/secrets';
import Primes from './constants/primes';
import int from 'int';
import Footer from './components/Footer';

const powerModulus = (base: string, exponent: string, modulo: string) : string => {
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
  return res.toString();
}


const cypher = (msg: string, key: string[]) : string => {
  let encrypted = ""
  for(let i = 0; i < msg.length; i++){
    encrypted += powerModulus(msg.charCodeAt(i).toString(), key[1], key[0])+ ',';
  }
  return encrypted;
}

const decypher = (msg: string, key: string[]) : string => {
  let decrypted = ""
  const msgData = msg.split(',');
  for(let i = 0; i < msgData.length-1; i++){
    decrypted += String.fromCharCode(parseInt(powerModulus(msgData[i], key[2], key[0])));
  }
  return decrypted;
}


const gcdExt = (a: any, b: any) : any[] => {
  if(parseInt(b.toString()) === 0)
    return [a, int(1), int(0)];
  let [gcd, x, y] = gcdExt(b, a.mod(b));
  return [gcd, y, x.sub(a.div(b).mul(y))];
}

const genKeysRSA = () => {
  const p = int(Primes[Math.floor(Math.random()*2000)]);
  const q = int(Primes[Math.floor(Math.random()*2000)]);
  const n = p.mul(q);
  const phi = int(p.sub(1)).mul(q.sub(1));
  let gcd = int(0);
  let e  = int(3);
  let d = int(0);
  for(let i = 3; i < phi; i++){ 
    e = int(i);
    [gcd, d, ] = gcdExt(e,phi);
    if(parseInt(gcd.toString())===1) {break;} 
  }
  d = parseInt(d.toString())>0?d:phi.add(d).toString();
  return [n.toString(), e.toString(), d.toString()];
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
    const decypherMsg = decypher(data.message, ls("keys") as any);
    let friends = ls("friends") as any;
    friends[data.from.email].messages.push({
      message: decypherMsg,
      self: false,
      timestamp: Date.now()
    })
    setFriendList(friends);
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
      friendEmail: cypher(email, ls("keys") as any),
    });
  }

  const selectContact = (contact: Contact) : void => {
    setCurrentChat(contact);
  }

  const sendMessage = (message: string) => {
    socket.emit("addFriend", {
      from: currentUser,
      to: currentChat,
      message: message
    });
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
      <Footer sendMessage={sendMessage}/>
      <SignUpModal visible={signUpModal} signUp={signUp} setVisible={setSignUpModal}/>
      <div className="sidenav-overlay" style={overlayStyle} onClick={()=>{setSideBarVisible(false);}}></div>
    </div>
  );
}

export default App;
