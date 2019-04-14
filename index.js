const { spawn } = require('child_process');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {

    /**
     * @param message a website to pass to crawler
     */
    ws.on('message', function incoming(message) {

        const crawler = spawn('python', ['crawler.py', message]);
        crawler.stdout.on('data', function (data) {
            // Buffer to string
            console.log(String(data));
            ws.send(String(data));
        });

        crawler.stderr.on('data', function (data) {
            console.log(String(data));
        });
    });
});

