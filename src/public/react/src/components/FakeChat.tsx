import React from 'react';
import MessageComponent from './MessageComponent';

const FakeChat: React.FC = () => {
   return (
    <div>
        <MessageComponent message="Welcome to this chat! Why you don't add some friends on the input to the left!" currentUser={false} />
        <MessageComponent message="If you already have some friends go ahead and select the conversation with them and start chatting!" currentUser={false} />
    </div>
   );
}

export default FakeChat;