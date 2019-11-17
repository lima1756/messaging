import React from 'react';

interface props{
    message: string;
    currentUser: Boolean;
    image?: string;
}

const Message: React.FC<props> = ({message, currentUser = true, image}) => {
    if(currentUser)
        return (
            <div className='row message-block'>
            <div className="col s10 offset-s1">
              <div className="card blue lighten-3">
                <div className="card-content white-text">
                  <p>{message}</p>
                </div>
              </div>
            </div>
            <div className="col s1 circular user-bubble">
                <img src={image?image:"person.jpg"} alt="" className="circle responsive-img"/>
            </div>
          </div>
        )
    else
        return (
            <div className='row message-block'>
            <div className="col s1 circular user-bubble">
                <img src={image?image:"person.jpg"} alt="" className="circle responsive-img"/>
            </div>
            <div className="col s10">
              <div className="card grey lighten-1">
                <div className="card-content white-text">
                    <p>{message}</p>
                </div>
              </div>
            </div>
            <div className="col s1"></div>
          </div>
        )
    
}

export default Message;