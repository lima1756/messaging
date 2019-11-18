import React from 'react';
import FakeChat from './FakeChat';
import MessageComponent from './MessageComponent';

interface props{
    currentChat: Contact;
    user: Contact;
}

const Chat: React.FC<props> = ({currentChat, user}) => {
    if(!currentChat || !currentChat.messages){
        return <main><FakeChat /></main>;
    }
    return (
        <main>
            <div className='container'>
                {currentChat.messages.forEach(msg=>
                    <MessageComponent message={msg.message} key={msg.timestamp} 
                        currentUser={msg.self} image={msg.self?user.image:currentChat.image}
                        />
                    )}
                { 
                }
            </div>
        </main>
    );
}

export default Chat;