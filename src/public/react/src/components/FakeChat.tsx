import React from 'react';
import Message from './Message';

const FakeChat: React.FC = () => {
   return (
    <div>
        <Message message="Welcome to this chat! Why you don't add some friends on the input to the left!" currentUser={false} />
        <Message message="If you already have some friends go ahead and select the conversation with them and start chatting!" currentUser={false} />
    </div>
   );
}

export default FakeChat;