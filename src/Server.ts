import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as socketIO from 'socket.io'
import { ChatEvent } from './constants/ChatEvent';
import { ChatMessage } from './types/ChatMessage';


class MessagingServer extends Server {

    private io: SocketIO.Server;
    private port: number | string;
    private static readonly PORT: number = 3000;
    private static readonly SERVER_START_MSG: string = 'Demo server started on port: ';
    private static readonly DEV_MSG: string = 'Express Server is running in development mode. ' + 
        'No front-end content is being served.';

    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.port = process.env.PORT || MessagingServer.PORT;
        this.io = socketIO.listen(this);
        this.setupControllers();
        if (process.env.NODE_ENV !== 'production'){
            this.app.get('*', (req, res) => res.send(MessagingServer.DEV_MSG));
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

        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            console.log('Connected client on port %s.', this.port);
      
            socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
              console.log('[server](message): %s', JSON.stringify(m));
              this.io.emit('message', m);
            });
      
            socket.on(ChatEvent.DISCONNECT, () => {
              console.log('Client disconnected');
            });
        });
    }
}

export default MessagingServer;