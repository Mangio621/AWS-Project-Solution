/*
    Project AWS Solution: Swinburne University of Technology
    Author: Cole P. Mangio 103602247
    File Purpose: Establish a the backbone of the backend architecture
*/

import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const PORT = 3000; // Standardized HTML port. Change if necessary or if this port is in use!

// Set up the server with express
const app = express();
const server = createServer(app);
// Configure the socket-io server
const io = new Server(server, {
    cors: {
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true 
});

// Determining filenames for our directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setting up the app to use the following public directories for static files.
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());

// TODO: Setup main server-sided components here (E.G the CSV fetcher module etc)

// Render the ejs file to the client on request to '/'
app.get('/', (req, res) => {
    res.render('index');
});

// Setup the "from client" event communication listener
io.on('connection', (socket) => {
    console.log("Client has established a connection!");
    socket.on('command', (data) => {
        console.log(data);
    });
    
    /*
    Communication event example:
    socket.on('event', (data) => {
        // Do Logic here
        io.emit('event', DATAOBJECT);
    });
    */
});

// Listen from localhost.
server.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT);
});