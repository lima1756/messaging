import React from 'react';
import { Button, Icon, Modal, TextInput } from 'react-materialize';

interface props{
    visible: Boolean;
    signUp: Function;
    signUpError: Function;
    setVisible: Function;
}

const SignUpModal: React.FC<props> = ({visible, signUp, signUpError, setVisible}) => {
    return (
        <Modal header="Welcome!" bottomSheet open={visible}
            actions={[
                <Button type="submit" waves="light" onClick={() => { if (signUp()) setVisible(false); else signUpError(); }}>
                    Sign-Up
            <Icon right>
                        assignment_turned_in
            </Icon>
                </Button>
            ]}
            options={{ dismissible: false }}
        >
            Before start chatting with your friends, please create your account:
        <TextInput label="Name" />
            <TextInput label="email" />

        </Modal>
    )
}

export default SignUpModal;