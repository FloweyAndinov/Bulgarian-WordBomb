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
const syllablesPath = 'words.csv';

let syllables = [];

let turnsMap = {};

let aliveMap = {};

let currentsyllableMap = new Map();

let namesMap = new Map(); // id : name

const deadString = '______' //this replaces id when player dies

const stream = fs.createReadStream(syllablesPath, { encoding: 'utf-8' })

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
            // console.log('CSV data loaded:', syllables);
        })
        .on('error', (error) => {
            console.error('Error parsing CSV:', error);
        });
});

const wordsPath = 'cyrillic_words.txt';
const data = fs.readFileSync(wordsPath, { encoding: 'utf8', flag: 'r' });

function checkStringInFile(wordsPath, searchString) {
        
        return data.includes(searchString);
}


io.on('connection', (socket) => {
    console.log(socket.id);
    debugUserCount()

    socket.on('get-rooms', () => {
        const rooms = io.sockets.adapter.rooms;
        // console.log(rooms);

        socket.emit('rooms', Array.from(rooms));
    });

    socket.on('set-name', (name) => {
        namesMap.set(socket.id, name);
        console.log("name added")
    })

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

    socket.on('leave-room', (room) => {// lower priority
        socket.leave(room);
        //TODO : put user back in main menu
    });

    socket.on('get-ids' , (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);
        let namesArray = GetNameArray(ids)
        socket.emit('ids', ids, namesArray);
    });
    socket.on('send-game-screen', (roomID) => {
        //send everyone to game screen
        io.to(roomID).emit('send-game-screen');
    });

    socket.on('start-game', (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);

        let namesArray = GetNameArray(ids)
        console.log(namesArray, 'are being sent')
        socket.emit('recieve-players-names', namesArray)

        //choose random id
        const randomIndex = Math.floor(Math.random() * ids.length);
        const randomplayerId = ids[randomIndex];

        let randomsyllableId = Math.floor(Math.random() * syllables.length);
        let currentSyllable = syllables[randomsyllableId]

        currentsyllableMap.set(roomID , currentSyllable);


        //send each id the appropriate event
        ids.forEach(id => {
            if (id !== randomplayerId) {
              // Send event to all IDs except the special one
              io.to(id).emit('play-wait', currentSyllable, 0); //TODO : dynamic player angle
            } else {
              // Send different event to the special ID
              io.to(randomplayerId).emit('play-type', currentSyllable, 0); //TODO : dynamic player angle
            }
          });


        //randomize order (optional)
        //game: cycle ids, force current id to type word, others to wait

        const aliveArray = Array.from(room);
        ResetAlive(roomID, aliveArray)
        // io.sockets.adapter.rooms.forEach(function(room){
        //     console.log(room)
        //     RemoveAlive(room, socket.id)
        // });
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

    socket.on('request-submit-word',(user_word, roomID) => {
        
        const word = user_word.toLowerCase()
        const syllable = currentsyllableMap.get(roomID)
        console.log(syllable)
        const containsBool = word.includes(syllable)
        if (containsBool) {
            const found = checkStringInFile(wordsPath, word)
            if (found) {
                console.log('word found')
                 //TODO : pass the turn to next person
                // io.to(roomID).emit('submit-word', nextPerson);
            }
            else {
                console.log('no word found, correct syllable')
                //TODO : flash the user red text (to indicate fail)
            }
        }
    })

    socket.on('out-of-time', (roomID, userID, user_word, syllable) => {
            //TODO : take health from client that didn't submit
            io.to(roomID).emit('out-of-time-pass', nextPerson);
            RemoveAlive(roomID, userID);
        
    })

    socket.on('disconnect', () => {
        namesMap.delete(socket.id) // won't throw error if doesn't exist
        io.sockets.adapter.rooms.forEach((value, key) => {
            console.log(`Key: ${key}, Value: ${Array.from(value).length}`);
            if (key.length===6) {
                console.log(key + " attempting to remove user")
                RemoveAlive(key, socket.id)
            }
          });
      });

    socket.on('delete-room', (roomId) => {
        io.to(roomId).emit('send-lobby');
        socket.leave(roomId)
    });
    socket.on('user-disconnect', (roomID) => {
        RemoveAlive(roomID, socket.id)
    })
      
});





setInterval(() => {
    // const connectedSockets = io.sockets.sockets.size;
    // console.log(`Number of connected sockets: ${connectedSockets}`);
    // io.sockets.adapter.rooms.forEach((value, key) => {
    //     console.log(`Key: ${key}, Value: ${Array.from(value).length}`);
    //     if (key.length===6) {
    //         console.log("i see a room")
    //     }
    //   });
    
    // io.sockets.adapter.rooms.forEach((key, value) => {
    //   console.log(`Room ${key} has ${value.length} users`);
    // });
        
}, 5000);

function debugUserCount() {
    const connectedSockets = io.sockets.sockets.size;
    console.log(`Number of connected sockets: ${connectedSockets}`);
}

function UpdateTurns(roomID,size,reset) {
   if (reset) {
    turnsMap[roomID] = 0;
   }
   else {
    turnsMap[roomID]++;
   }
}

function GetNameArray(ids) {
    console.log(ids)
    let namesArr = []
    ids.forEach(element => {
        
        if (namesMap.has(element)) {
            namesArr.push(namesMap.get(element))
            
        }
        else {
            
            namesArr.push(element.slice(-6))
        }
    });
   
    return namesArr
}

function ResetAlive(roomID, resetArray) {
        aliveMap[roomID] = resetArray
        console.log(aliveMap[roomID])
        console.log(roomID)

}

function RemoveAlive(roomID, deadID) {
    console.log()
    if (aliveMap[roomID] == null) return 
    let elementIndex = aliveMap[roomID].indexOf(deadID);
    if (elementIndex !== -1) {
        aliveMap[roomID][elementIndex] = deadString
    }
    console.log("check for game end")
    let counter = 0;
    for (let i=0; i<aliveMap[roomID].length; i++) {
        if (aliveMap[roomID][i]!==deadString) {
            counter++;
        }
    }
    
    if (counter<=1) {
        io.to(roomID).emit('send-lobby')
    }
}


app.use(cors());
