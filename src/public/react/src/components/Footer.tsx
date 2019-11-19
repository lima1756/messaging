
import React, {useState} from 'react';
import { Button ,Icon, Textarea } from 'react-materialize';

interface props{
    sendMessage: Function;
}

const changeHandle = (e: React.FormEvent<HTMLInputElement>, setter: Function) => {
    if(e && e.currentTarget && e.currentTarget.value){
        setter(e.currentTarget.value);
    } else if (e && e.currentTarget){
        setter("");
    }
}

const Footer: React.FC<props> = ({sendMessage}) => {
    const [message, setMessage] = useState("");

    return (
        <footer className="message-footer">
        <div className="container">
          <div className="row">
            <div className="col s11">
              <Textarea label="Write Your Message" value={message} className="messagebox input-field" s={12} onChange={(e:React.FormEvent<HTMLInputElement>) => changeHandle(e, setMessage)}/>
            </div>
            <div className="col s1">
              <Button type="submit" waves="light" className="input-field" onClick={()=>{sendMessage(message); setMessage("");}}>
                <Icon center>
                  send
                </Icon>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    );
}

export default Footer;

