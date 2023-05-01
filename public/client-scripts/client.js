

// This function simply sets up the listeners for all server message events (when the server sends a message to the client) 
// This function is to be called only once.
const setupIncomingEvents = (socket) => {
    /*
    
    socket.on('event', (data) => {
        // DO STUFF WITH SERVER LOGIC
    });
    
    // To send the server data with a js object
    socket.emit('event', {DATAOBJECT});
    
    */
}

// On document is ready/loaded. This is the entry point of the client script
$(() => {
    const socket = io(); // The socket variable to be passed into different functions/components to talk to the server
    setupIncomingEvents(socket); // 
});

setupIncomingEvents();