const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROUTES_DIR = 'routes';

const routesToResourcesMap = {
    '/': 'index.html',
    '/title': 'title.html',
    '/levels': 'levels.html',
    '/create-level': 'create-level.html',
    '/credits': 'credits.html',
    '/style.css': 'style.css',
    '/router.js': 'router.js',
    '/sketch.js': 'sketch.js',
    '/Lane.js': 'Lane.js',
    '/Car.js': 'Car.js',
    '/CarBrain.js': 'CarBrain.js',
    '/Sensor.js': 'Sensor.js',
    '/levels.js': 'levels.js',
    '/images/green.png': 'images/green.png',
    '/images/red_rotated.png': 'images/red_rotated.png',
    '/favicon.ico': 'images/icon.png',
    '/LuckiestGuy-Regular.ttf': 'LuckiestGuy-Regular.ttf',
    '/Roboto-Regular.ttf': 'Roboto-Regular.ttf',
}

const getContentType = (fileName) => {
    const ct = {
        'html': 'text/html',
        'png': 'image/x-png',
        'ico': 'image/x-icon',
        'js': 'text/javascript',
        'css': 'text/css',
        'ttf': 'font/ttf',
    }
    const mime = fileName.substring(fileName.lastIndexOf('.') + 1);
    return ct[mime];
}

const sendFile = (fileName, req, res) => {
    console.log('SENDING FILE:', fileName);
    fs.readFile(path.join(__dirname, fileName),
        (err, data) => {
            if (err) {
                res.writeHead(500, 'Error while loading html response..');
                return res.end();
            }
            const contentType = getContentType(fileName);
            if (!contentType)
                return sendError(400, `Content type not supported ${fileName}`, req, res);
            res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': data.length });
            res.write(data);
            res.end();
        }
    );
}

const sendError = (status, err, req, res) => {
    console.log('SENDING ERROR:', status, err);
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    res.write(err);
    res.end();
}

const handleRequest = (req, res) => {
    if (req.method !== 'GET') {
        return sendError(405, "Don't do that please..");
    }
    if (req.url in routesToResourcesMap) {
        const req_route = routesToResourcesMap[req.url];
        const resource = req_route.endsWith('html') ? `${ROUTES_DIR}/${req_route}` : req_route;
        return sendFile(resource, req, res);
    } else {
        return sendError(404, `${req.url} not found..`, req, res);
    }
}

const server = http.createServer((req, res) => {
    handleRequest(req, res);
    console.log(`Server listening on port ${PORT}`);
}).listen(PORT);
