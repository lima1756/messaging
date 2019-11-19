import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as socketIO from 'socket.io'
import SocketIOController from './controllers/socketio/SocketIOController';
import cors from 'cors';


class MessagingServer extends Server {

    private io: SocketIOController;
    private port: number | string;
    private static readonly PORT: number = 3001;
    private static readonly SERVER_START_MSG: string = 'Server started on port: ';
    private static readonly DEV_MSG: string = 'Express Server is running in development mode. ' + 
        'No front-end content is being served.';
    private static readonly PATH: string = path.join(__dirname, 'public', 'messaging-react');

    constructor() {
        super(true);
        //this.app.use(cors);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static(MessagingServer.PATH));
        this.port = process.env.PORT || MessagingServer.PORT;
        this.io = new SocketIOController(socketIO.listen(3002));
        this.setupControllers();
        if (process.env.NODE_ENV !== 'production'){
            this.app.get('*', (req, res) => res.send(MessagingServer.DEV_MSG));
        }
        else{
            this.app.get('*', (req, res) => {
                Logger.Info("SERVING!!!");
                res.sendFile(path.join(MessagingServer.PATH, 'index.html' ))
            });
        }
    }

    private setupControllers(): void {
        const ctlrInstances =  [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) { 
                let Controller = (controllers as any)[name];
                ctlrInstances.push(new Controller());
            }
        }
        super.addControllers(ctlrInstances);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            Logger.Imp(MessagingServer.SERVER_START_MSG + this.port);
        });

        this.io.socketEvents();
    }
}

export default MessagingServer;