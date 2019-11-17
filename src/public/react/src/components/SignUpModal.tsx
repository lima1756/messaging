import React, { useState, createRef } from 'react';
import { Button, Icon, Modal, TextInput } from 'react-materialize';

interface props{
    visible: Boolean;
    signUp: Function;
    signUpError: Function;
    setVisible: Function;
}

const changeHandle = (e: React.FormEvent<HTMLInputElement>, setter: Function) => {
    if(e && e.currentTarget && e.currentTarget.value){
        setter(e.currentTarget.value);
    }
}

const SignUpModal: React.FC<props> = ({visible, signUp, signUpError, setVisible}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [img, setImg] = useState("");
    let fileInput = createRef<HTMLInputElement>();
    return (
        <Modal header="Welcome!" bottomSheet open={visible}
            actions={[
                <Button type="submit" waves="light" onClick={() => { signUp(name, email, fileInput && fileInput.current && fileInput.current.files ? fileInput.current.files[0]:null) }}>
                    Sign-Up
            <Icon right>
                        assignment_turned_in
            </Icon>
                </Button>
            ]}
            options={{ dismissible: false }}
        >
            Before start chatting with your friends, please create your account:
            <TextInput label="Name" value={name} onChange={(e:React.FormEvent<HTMLInputElement>) => changeHandle(e, setName)}/>
            <TextInput label="email" value={email} onChange={(e:React.FormEvent<HTMLInputElement>) => changeHandle(e, setEmail)}/>
            <div className="file-field input-field">
                <div className="btn">
                    <span>File</span>
                    <input type="file" ref={fileInput} onChange={()=>{console.log(fileInput)}}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload your profile img"/>
                </div>
            </div>
        </Modal>
    )
}

export default SignUpModal;