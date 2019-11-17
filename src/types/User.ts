interface User{
    name: string;
    email: string;
    image: string;
    publicKey: Object;
    socket: SocketIO.Socket;
}

export default User;