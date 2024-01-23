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
    debugUserCount()

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
        console.log(room); //find the room that called this function
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
    
   
    socket.on('request-syllable', () => {
        let client_inTurn = 0 // needs parameter
        const random = Math.floor(Math.random() * syllables.length);
        let syllable = syllables[random]
        io.to(roomID).emit('send-syllable', client_inTurn, syllable); //send it to all, let only one client fill the word
        
    })
    socket.on('request-word-check', (user_word, syllable) => {
        //check the word
        

        const word = user_word.toLowerCase()
        const containsBool = word.includes(syllable)
        if (containsBool) {
            io.to(roomID).emit('accept-word');// add to client option to press enter to submit
        }
        else {
            io.to(roomID).emit('deny-word');  //remove option from client to submit word
        }
    })

    socket.on('request-submit-word', (roomID , user_word, syllable) => {
        const word = user_word.toLowerCase()
        const containsBool = word.includes(syllable)
        if (containsBool) {
            //pass the turn to next person
            io.to(roomID).emit('submit-word', nextPerson);
        }
    })

    socket.on('out-of-time', (user_word, syllable) => {
        if (totalRemainingPlayers<=1) {
            //TODO : end game
        }
        else {
            //TODO : take health from client that didn't submit
            io.to(roomID).emit('out-of-time-pass', nextPerson);
        }
    })

    socket.on('disconnect', () => { // doesn't need client side implementation
        debugUserCount()
      });
});



// setInterval(() => {
    // const connectedSockets = io.sockets.sockets.size;
    // console.log(`Number of connected sockets: ${connectedSockets}`);
// }, 5000);

function debugUserCount() {
    const connectedSockets = io.sockets.sockets.size;
    console.log(`Number of connected sockets: ${connectedSockets}`);
}

app.use(cors());
