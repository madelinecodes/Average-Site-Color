const { spawn } = require('child_process');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

app.ws('/crawler', function(ws, req) {
    ws.on('message', function incoming(message) {
        const crawler = spawn('python3', ['crawler.py', message, '10']);
        crawler.stdout.on('data', function (data) {
            // We may get concatted JSON so here we clean it
            String(data).split('\n').filter(Boolean).forEach(line => ws.send(line));
        });

        crawler.stderr.on('data', function (data) {
            console.log(String(data));
        });
    });
});


app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

// listen for requests 
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
