const express = require('express');
const app = express();
const cors = require('cors');
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173'],
        methods : ['GET', 'POST'],
    }
});
let counter = 0;
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('get-rooms', () => {
        const rooms = io.sockets.adapter.rooms;
        console.log(rooms);    
        console.log(rooms.size);
        console.log(counter);
        counter++;

        socket.emit('rooms', Array.from(rooms));
    });

    socket.on('create-room', (room) => {
        socket.join(room);
    });

    socket.on('join-room', (room) => {
        socket.join(room);
        socket.emit('joined-room', room);
    });

    socket.on('leave-room', (room) => {
        socket.leave(room);
    });

    socket.on('get-ids' , (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);
        socket.emit('ids', ids);
    });

   
});

setInterval(() => {
    const connectedSockets = io.sockets.sockets.size;
    console.log(`Number of connected sockets: ${connectedSockets}`);
}, 5000);

app.use(cors());
