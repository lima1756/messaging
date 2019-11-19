import React, {useEffect, useRef} from 'react';
import FakeChat from './FakeChat';
import MessageComponent from './MessageComponent';

interface props{
    currentChat: Contact;
    user: Contact;
}

const Chat: React.FC<props> = ({currentChat, user}) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(bottomRef && bottomRef.current)
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
      });

    if(!currentChat || !currentChat.messages){
        return <main><FakeChat /></main>;
    }    return (
        <main>
            <div className='container'>
                {currentChat.messages.map(msg=><MessageComponent message={msg.message} key={msg.timestamp} 
                        currentUser={msg.self} image={msg.self?user.image:currentChat.image}
                        />
                    )}
                { 
                }
            </div>
            <div style={{ float:"left", clear: "both" }}
                ref={bottomRef}></div>
        </main>
    );
}

export default Chat;