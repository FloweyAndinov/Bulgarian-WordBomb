const express = require('express');
const app = express();
const cors = require('cors');
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173'],
        methods : ['GET', 'POST'],
    }
});
io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('get-rooms', () => {
        const rooms = io.sockets.adapter.rooms;
        console.log(rooms);

        socket.emit('rooms', Array.from(rooms));
    });

    socket.on('create-room', (room) => {
        socket.join(room);
        io.in(room).emit('user-connected', room);
    });

    socket.on('join-room-window', (room) => {
        socket.join(room);
        socket.emit('joined-room-window', room);
    });

    socket.on('join-room', (room) => {
        //find the room that called this function
        console.log(room);
        io.in(room).emit('user-connected', room);
    });

    socket.on('leave-room', (room) => {
        socket.leave(room);
    });

    socket.on('get-ids' , (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);
        socket.emit('ids', ids);
    });
    socket.on('start-game', (roomID) => {
        io.to(roomID).emit('start-game');
    });
   
});

setInterval(() => {
    const connectedSockets = io.sockets.sockets.size;
    console.log(`Number of connected sockets: ${connectedSockets}`);
}, 5000);

app.use(cors());
