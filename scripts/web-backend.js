#!/usr/bin/env node
/*
 * We need this service to interact with the file system
 * until some standard emerges for doing it from browser.
 * For example: https://github.com/WICG/native-file-system
 */
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.static('static'));
app.use(express.json());
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});

app.get('/file/:path', (request, response) => {
    const filePath = decodeURIComponent(request.params.path);
    fs.readFile(filePath, {encoding: 'utf-8'}, (error, data) => {
        if (error) {
            console.warn(`file not loaded from ${filePath}: ${error}`);
            response.status(400).json({error: error.toString()});
        } else {
            console.info(`file loaded from ${filePath}`);
            response.json({content: data});
        }
    });
});

app.post('/file/:path', (request, response) => {
    const filePath = decodeURIComponent(request.params.path);
    const content = request.body.content;
    fs.writeFile(filePath, content, (error) => {
        if (error) {
            console.warn(`file not saved to ${filePath}: ${error}`);
            response.status(400).json({error: error.toString()});
        } else {
            console.info(`file saved to ${filePath}`);
            response.json({});
        }
    });
});

app.get('/*', (request, response) => {
    // Handle angular routes
    response.sendFile(__dirname + '/static/index.html');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`file manager running at http://localhost:${PORT}/`);
});
