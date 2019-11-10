import MessagingServer from './Server';

if(process.argv[2] !== 'test'){
    let server = new MessagingServer();
    server.start(3000);
}