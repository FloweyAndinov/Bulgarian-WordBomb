const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');


const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173'],
        methods : ['GET', 'POST'],
    }
});
const filePath = 'words.csv';

let syllables = [];

const stream = fs.createReadStream(filePath, { encoding: 'utf-8' })

stream.on('error', (error) => {
    console.error('Error opening the file:', error);
});

// Handle 'open' event
stream.on('open', () => {
    // console.log('File found. Reading data...');

    // Pipe the stream to the CSV parser
    stream.pipe(csv())
        .on('data', (data) => {
            syllables.push(Object.values(data)[0]);
        })
        .on('end', () => {
            console.log('CSV data loaded:', syllables);
        })
        .on('error', (error) => {
            console.error('Error parsing CSV:', error);
        });
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
    socket.on('send-game-screen', (roomID) => {
        //send everyone to game screen
        io.to(roomID).emit('send-game-screen');
    });

    socket.on('start-game', () => {
        //get all ids
        //randomize order (optional)
        //game: cycle ids, force current id to type word, others to wait
    })
    
   

    socket.on('send-word', (user_word) => {
        //check the word
        //check if game ended (has 1 person remaining)
        //pass the turn to next person

        // const word = user_word.toLowerCase()
        // const containsBool = syllables.some(syllable => word.includes(syllable))
    })
});

setInterval(() => {
    const connectedSockets = io.sockets.sockets.size;
    console.log(`Number of connected sockets: ${connectedSockets}`);
}, 5000);

app.use(cors());
