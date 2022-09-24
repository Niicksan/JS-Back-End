const http = require('http');
const url = require('url');
const port = 3000;
const handlers = require('./handlers');

let hostname;

http.createServer((req, res) => {
    for (let handler of handlers) {
        if (!handler(req, res)) {
            break;
        }
    }
}

).listen(port);