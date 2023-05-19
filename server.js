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
import * as csv from './csv-utils.js';

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

// Render the index ejs file to the client on request to '/'
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cust-create', (req, res) => {
    res.render('cust-create');
});

app.get('/portfolio-view', (req, res) => {
    res.render('portfolio-view');
});

// Setup the "from client" event communication listener
io.on('connection', (socket) => {
    console.log("Client has established a connection!");
    socket.on('get-all-customers', (table) => {
        csv.queryFetchAll(table, (status, data) => {
            if(status === csv.queryStatus.success) {
                socket.emit('receive-all-customers', data);
            }
        });
    });  
    socket.on('add-new-customer', (record) => {
        // Do Customer validation, or more so, the automatic ID
    });
    socket.on('get-customer-details', (custID) => {
        csv.queryFetch(csv.tables.customer, csv.fields.custID, custID, (status, data) => {
            if(status === csv.queryStatus.success) {
                socket.emit('receive-customer-details', data);
            }
        });
    });
    socket.on('get-customer-assets', (custID) => {
        csv.queryFetch(csv.tables.investments, csv.fields.custID, custID, (status, data) => {
            if(status === csv.queryStatus.success) {
                socket.emit('receive-customer-assets', data);
            }
        });
    });
    socket.on('add-new-customer', (customerRecord) => {
        csv.insertRecordToTable(csv.tables.customer, customerRecord);
        socket.emit('receive-new-customer', {});
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
    csv.queryFetch(csv.tables.customer, csv.fields.custID, '16-7944667', (status, data) => {
        if(status === csv.queryStatus.success) {
            data.forEach(record => {
                console.log(record);
            });
        }
    });
});