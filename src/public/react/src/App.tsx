import './App.css';
import React, {useState} from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import SignUpModal from './components/SignUpModal';
import ls from 'local-storage';
import socketIOClient from "socket.io-client";
import request from 'superagent';
import Footer from './components/Footer';
import {genKeysRSA, cypher, decypher} from './helpers/RSA'

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

  const socket = socketIOClient.connect(":3001");
  console.log(socket);
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
    ls("friends", friends);
    setCurrentChat(friends[data.from.email]);
  })

  if(currentUser){
    socket.emit("signup", currentUser);
  };
 
  const signUp = (name: string, email: string, image: any) : void => {
    if(image){
      request.post(`https://api.cloudinary.com/v1_1/dbonajrfw/upload`)
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

  const sendMessage = (message: string) => {
    let friends = ls("friends") as any;
    socket.emit("sendMsg", {
      from: currentUser,
      to: currentChat,
      message: cypher(message, currentChat.publicKey)
    });
    friends[currentChat.email].messages.push({
      message: message,
      self: true,
      timestamp: Date.now()
    })
    setFriendList(friends);
    ls("friends", friends);
    setCurrentChat(friends[currentChat.email]);
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
        addFriend={addFriend} contacts={friendList} />
      <Chat currentChat={currentChat} user={currentUser}/>
      <Footer sendMessage={sendMessage}/>
      <SignUpModal visible={signUpModal} signUp={signUp} setVisible={setSignUpModal}/>
      <div className="sidenav-overlay" style={overlayStyle} onClick={()=>{setSideBarVisible(false);}}></div>
    </div>
  );
}

export default App;
