import UserManagement from '../../config/UserManagement';
import User from '../../types/User';
import {Logger} from '@overnightjs/logger';

class SocketIOController {

    private io: SocketIO.Server;
    private userManagement: UserManagement;

    constructor(io: SocketIO.Server) {
        Logger.Info("Configuring Socket io");
        this.io = io;
        this.userManagement = UserManagement.getUserManagement();
    }

    public socketEvents() {
        this.io.on('connection', (socket) => {
            Logger.Info("new connection");
            socket.on('addFriend', (data) => {
                Logger.Info("adding a friend");
                const userRequest: User = this.userManagement.getUser(data.from.email);
                const user = this.userManagement.getUserNoSocket(data.from.email);
                this.userManagement.updateUser(userRequest);
                const friend = this.userManagement.getUserNoSocket(data.friendEmail);
                const friendSocket = this.userManagement.getUser(data.friendEmail).socket;
                if(friend){
                    console.log(userRequest);
                    userRequest.socket.emit('addFriend', {
                        userExist: true,
                        user: friend
                    });
                    friendSocket.emit('addFriend', {
                        userExist: true,
                        user: user
                    });
                    
                    // socket.broadcast.to(userRequest.socket.id).emit('addFriend', {
                    //     userExist: true,
                    //     user: friend
                    // })
                }
                else {
                    Logger.Err("Friend not found");
                    userRequest.socket.emit('addFriend', {
                        userExist: false
                    });
                    // socket.broadcast.to(userRequest.socket.id).emit('addFriend', {
                    //     userExist: false,
                    // })
                }
            });

            socket.on('signup', (data) => {
                Logger.Info("Creating user");
                const user : User = {
                    name: data.name,
                    email: data.email,
                    image: data.image,
                    publicKey: data.publicKey,
                    socket: socket,
                }
                this.userManagement.connectUser(user);
            });

            socket.on('message', (data) => {
                Logger.Info("Sending a message");
                this.userManagement.updateUser(this.userManagement.getUser(data.from.email));
                const to: User = this.userManagement.getUser(data.to.email);
                let from = this.userManagement.getUserNoSocket(data.from.email);
                socket.broadcast.to(to.socket.id).emit('sendMsg', {
                    msg: data.msg,
                    from: from
                });
            });

        });
    }

}

export default SocketIOController;