import * as bodyParser from 'body-parser';
import { Application } from 'express';
import { Server } from '@overnightjs/core';;


class TestServer extends Server {

    private readonly SERVER_START_MSG = 'Demo server started on port: ';
    private readonly DEV_MSG = 'Express Server is running in development mode. ' + 
        'No front-end content is being served.';

    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    public setController(ctrlr: object): void {
        super.addControllers(ctrlr);
    }

    public getExpressInstance(): Application {
        return this.app;
    }
}

export default TestServer;