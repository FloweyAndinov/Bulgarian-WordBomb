const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const Timeout = require('timeout-refresh')


const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173'],
        methods : ['GET', 'POST'],
    }
});
const syllablesPath = 'words.csv';

let syllables = [];

class Room {
    constructor(id) {
        this.id = id
        this.public = true
        this.locked = false
    }
}

class GameTurns{
    constructor(turnArray) {
        this.turnArray = turnArray
        this.turnCounter = Math.floor(Math.random() * turnArray.length);
        let randomsyllableId = Math.floor(Math.random() * syllables.length);
        this.syllable = syllables[randomsyllableId]
        this.turnTimer = 5000000;
        this.turnTimeout = null
        this.usedWords = []
    }
    GenerateSyllable() {
        let randomsyllableId = Math.floor(Math.random() * syllables.length);
        this.syllable = syllables[randomsyllableId]
        return this.syllable
    }
    RemovePlayerByIndex(index) {
        try {
            this.turnArray[index] = deadString
        }
        catch {
            
        }
    }
    RemovePlayerByID(id) {
        const index = this.turnArray.findIndex(element => element === id);
        if (index != -1)
        this.turnArray[index] = deadString
    }
    PassTurn(used_word) {
        if (used_word == 'fail') {
            return this.GetNextTurn() //user didn't submit word
        }
        else if (this.usedWords.indexOf(used_word) != -1) {
            
            return false; //user submit used word
            
        }
        else {
            this.usedWords.push(used_word) // user submits new word
            if (this.turnTimer <=2000) this.turnTimer -= 25;
            return this.GetNextTurn()
        }
    }
    CheckEnd() {
        let counter = 0;
        this.turnArray.forEach(
            player => {
                if (player!=deadString)
                counter++;
            }
        )
        //console.log(counter , "counter for players")
        return counter <=1 ? true : false
    }

    GetNextTurn() {
        while (true) {
            let nextTurn = this.turnCounter!=this.turnArray.length-1? this.turnCounter + 1 : 0;
            console.log(nextTurn)
            if (this.turnArray[nextTurn] != deadString) {
                let obj = {
                 id: this.turnArray[nextTurn],
                 index: nextTurn
            }
                this.turnCounter = nextTurn
                return obj
            }
            this.turnCounter = nextTurn
           
        }
    }
}

let gamesMap = new Map();

let namesMap = new Map(); // id : name

let avatarsMap = new Map(); //id : link

let roomsMap = new Map();

const deadString = '______' //this replaces id when player dies

const stream = fs.createReadStream(syllablesPath, { encoding: 'utf-8' })

stream.on('error', (error) => {
    //console.error('Error opening the file:', error);
});




// Handle 'open' event
stream.on('open', () => {
    // //console.log('File found. Reading data...');

    // Pipe the stream to the CSV parser
    stream.pipe(csv())
        .on('data', (data) => {
            syllables.push(Object.values(data)[0]);
        })
        .on('end', () => {
            // //console.log('CSV data loaded:', syllables);
        })
        .on('error', (error) => {
            //console.error('Error parsing CSV:', error);
        });
});

const wordsPath = 'cyrillic_words.txt';
const data = fs.readFileSync(wordsPath, { encoding: 'utf8', flag: 'r' });

function checkStringInFile(wordsPath, searchString) {
        
        return data.includes(searchString);
}


io.on('connection', (socket) => {
    //console.log(socket.id);
    debugUserCount()

    socket.on('get-rooms', () => {
        const rooms = io.sockets.adapter.rooms;
        let roomsArray = Array.from(rooms.keys());
        roomsArray = roomsArray.filter(name => {
            return roomsMap.has(name) && roomsMap.get(name).public == true && roomsMap.get(name).locked == false;
        });
        console.log(roomsArray)
        socket.emit('rooms', roomsArray);
    });

    socket.on('set-name', (name) => {
        const findInMap = (map, val) => {
            for (let [k, v] of map) {
              if (v === val) { 
                return true; 
              }
            }  
            return false;
          }


        if (findInMap(namesMap, name) == false)
        namesMap.set(socket.id, name);
        else {
            while (true) {
                console.log("name was duplicate, will get random name")
                let random = Math.floor(Math.random() * 1000)
                if (findInMap(namesMap, name + random.toString()) == false) {
                    namesMap.set(socket.id, name + random.toString());
                    break;
                }
            }
        }
        //console.log("name added")
    })

    socket.on('lock-room', (room) => {
        if (socket.id.slice(-6) == room) {
            roomsMap.get(room).locked = true
        }
    })

    socket.on('unlock-room', (room) => {
        if (socket.id.slice(-6) == room) {
            roomsMap.get(room).locked = false
        }
    })

    socket.on('change-public-room', (room) => {
        if (socket.id.slice(-6) == room) {
            roomsMap.get(room).public = true
        }
    })

    socket.on('change-private-room', (room) => {
        if (socket.id.slice(-6) == room) {
            roomsMap.get(room).public = false
        }
    })

    socket.on('check-ownership', () => {
        if (roomsMap.has(socket.id.slice(-6))) {
            socket.emit('ownership-confirmed')
        }
        else {
            socket.emit('ownership-denied')
        }
    })

    socket.on('create-room', (room) => {
        socket.join(room);
        roomsMap.set(room, new Room(room));
        io.in(room).emit('user-connected', room);

        const roomID = io.sockets.adapter.rooms.get(room);
        const ids = Array.from(roomID);

        let namesArray = GetNameArray(ids)
        io.to(room).emit('recieve-players-names', namesArray)
    });

    socket.on('join-room-window', (room) => {
        if (io.sockets.adapter.rooms.get(room) && roomsMap.get(room).locked == false) {
            socket.join(room);
            socket.emit('joined-room-window', room);

            
        }
        else {
            socket.emit('join-room-denied');
        }
    });

    socket.on('join-room', (room) => {
        //console.log(room); //find the room that called this function
        io.in(room).emit('user-connected', room);

        const roomID = io.sockets.adapter.rooms.get(room);
        const ids = Array.from(roomID);

        let namesArray = GetNameArray(ids)
        io.to(room).emit('recieve-players-names', namesArray)
    });

    socket.on('leave-room', (room) => {// lower priority
        socket.leave(room);
        //TODO : put user back in main menu
    });

    socket.on('get-ids' , (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);
        let namesArray = GetNameArray(ids);
        
        socket.emit('ids', ids, namesArray);
    });
    socket.on('send-game-screen', (roomID) => {
        //send everyone to game screen
        io.to(roomID).emit('send-game-screen');
    });
    socket.on('recieve-preview-word', (word, roomID) => {
        io.to(roomID).except(socket.id).emit('broadcast-preview-word', word);
        console.log("word" , word , " RoomID" , roomID);
    }
    )

    function TimedOutTurn(roomID) {
        try {
            gamesMap.get(roomID).RemovePlayerByIndex(gamesMap.get(roomID).turnCounter)
        }
        catch (error) {
            console.log(error)
        }

        if (gamesMap.get(roomID).CheckEnd()) {
            gamesMap.get(roomID).turnTimeout.destroy()
            gamesMap.delete(roomID)
            console.log("game ended")
            io.to(roomID).emit('send-lobby');
            io.in(roomID).socketsLeave(roomID);
            return
        }
            
        let nextObj = gamesMap.get(roomID).PassTurn('fail')
        let nextPerson = nextObj.id
        let nextIndex = nextObj.index
        let nextSyllable = gamesMap.get(roomID).GenerateSyllable()

        io.to(roomID).except(nextPerson).emit('play-wait',nextSyllable, nextIndex);
        io.to(nextPerson).emit('play-type',nextSyllable, nextIndex);
        console.log("passed turn")
    }

    socket.on('request-players-names', (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);

        let namesArray = GetNameArray(ids)
        io.to(roomID).emit('recieve-players-names', namesArray)
    })

    socket.on('kick-player', (player, room) => {
        let playerId = ""
        namesMap.forEach((value, key) => {
            if (value == player) {
                playerId = key
                return
            }
        })

        if (socket.id.slice(-6) == room) { //verify the owner sent this event
            TimedOutTurn(room)
            RemoveAlive(room, player)
            const roomObject = io.sockets.adapter.rooms.get(room);
            const ids = Array.from(roomObject);

            ids.forEach(id => {
                console.log(id, " ", playerId)
                if (id===playerId) {
                    console.log("kicking player")
                    io.to(id).emit('kicked')
                }
            })
        }
    })

    socket.on('request-avatar', (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);
        let localavatarsMap = new Map()
        ids.forEach ((id) => {
            let name = namesMap.get(id)
            localavatarsMap.set(name, avatarsMap.get(id))
            
        })
        console.log(localavatarsMap)
        io.to(roomID).emit('recieve-avatars', Object.fromEntries(localavatarsMap))
    })

    socket.on('set-avatar', (url, roomID) => {
        avatarsMap.set(socket.id, url)
        

        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);
        let localavatarsMap = new Map()
        ids.forEach ((id) => {
            let name = namesMap.get(id)
            localavatarsMap.set(name, avatarsMap.get(id))
            
        })
        console.log(localavatarsMap)
        io.to(roomID).emit('recieve-avatars', Object.fromEntries(localavatarsMap))
        
    })

    socket.on('start-game', (roomID) => {
        const room = io.sockets.adapter.rooms.get(roomID);
        const ids = Array.from(room);

        let namesArray = GetNameArray(ids)
        //console.log(namesArray, 'are being sent')
        io.to(roomID).emit('recieve-players-names', namesArray)

        //choose random id
        // const randomIndex = Math.floor(Math.random() * ids.length);
        // const randomplayerId = ids[randomIndex];

        const aliveArray = Array.from(room);
        gamesMap.set(roomID, new GameTurns(aliveArray))
        //console.log(gamesMap.get(roomID), ' ', roomID)
        // currentsyllableMap.set(roomID , currentSyllable);
        let currentSyllable = gamesMap.get(roomID).syllable
        let currentPlayerIndex = gamesMap.get(roomID).turnCounter
        let currentPlayer = gamesMap.get(roomID).turnArray[currentPlayerIndex]

        //send each id the appropriate event
        ids.forEach(id => {
            if (id !== currentPlayer) {
              io.to(id).emit('play-wait', currentSyllable, currentPlayerIndex); 
            } else {
              io.to(currentPlayer).emit('play-type', currentSyllable, currentPlayerIndex); 
            }
          });

        gamesMap.get(roomID).turnTimeout = Timeout.on(gamesMap.get(roomID).turnTimer, function () {
            TimedOutTurn(roomID)
        })
        
       
    })

    socket.on('request-submit-word',(user_word, roomID) => {
        

        const word = user_word.toLowerCase()
        //console.log(word)
        const syllable =  gamesMap.get(roomID).syllable
        const containsBool = word.includes(syllable)
        if (containsBool) {
            const found = checkStringInFile(wordsPath, word)
            if (found) {
                let nextObj = gamesMap.get(roomID).PassTurn(user_word)
                if (nextObj != false) {
                    gamesMap.get(roomID).turnTimeout.refresh()
                    let nextPerson = nextObj.id
                    let nextIndex = nextObj.index
                   
                    let nextSyllable = gamesMap.get(roomID).GenerateSyllable()
   
   
                   //console.log(nextPerson)
                   io.to(roomID).except(nextPerson).emit('play-wait',nextSyllable, nextIndex);
                   io.to(nextPerson).emit('play-type',nextSyllable, nextIndex);
                   
                }
                else {
                    io.to(roomID).emit('word-submit-denied');
                }
            }
            else {
                
            }
        }
    })

    socket.on('out-of-time', (roomID, userID, user_word, syllable) => {
            //TODO : take health from client that didn't submit
            io.to(roomID).emit('pass-turn', nextPerson);
            RemoveAlive(roomID, userID);
        
    })

    socket.on('disconnect', () => {
        namesMap.delete(socket.id) // won't throw error if doesn't exist
        io.sockets.adapter.rooms.forEach((value, key) => {
            //console.log(`Key: ${key}, Value: ${Array.from(value).length}`);
            if (key.length===6) {
                //console.log(key + " attempting to remove user")
                RemoveAlive(key, socket.id)
            }
          });
      });

    socket.on('delete-room', (roomId) => {
        io.to(roomId).emit('send-lobby');
        io.in(roomId).socketsLeave(roomId);

    });
    socket.on('user-disconnect', (roomID) => {
        RemoveAlive(roomID, socket.id)
    })
      
});





setInterval(() => {
    // const connectedSockets = io.sockets.sockets.size;
    // //console.log(`Number of connected sockets: ${connectedSockets}`);
    // io.sockets.adapter.rooms.forEach((value, key) => {
    //     //console.log(`Key: ${key}, Value: ${Array.from(value).length}`);
    //     if (key.length===6) {
    //         //console.log("i see a room")
    //     }
    //   });
    
    // io.sockets.adapter.rooms.forEach((key, value) => {
    //   //console.log(`Room ${key} has ${value.length} users`);
    // });
        
}, 5000);

function debugUserCount() {
    const connectedSockets = io.sockets.sockets.size;
    //console.log(`Number of connected sockets: ${connectedSockets}`);
}

function GetNameArray(ids) {
    //console.log(ids)
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

// function ResetAlive(roomID, resetArray, randomplayerId) {
//         // aliveMap[roomID] = resetArray
//         // //console.log(aliveMap[roomID])
//         // //console.log(roomID)
        

// }

function RemoveAlive(roomID, deadID) {
   
    if (gamesMap.get(roomID) == null) return 
    
    gamesMap.get(roomID).RemovePlayerByID(deadID)

    if (gamesMap.get(roomID).CheckEnd() === true) {
        //console.log("sending player/s to lobby")
        
        io.to(roomID).emit('send-lobby');
        io.in(roomID).socketsLeave(roomID);

    }

}


app.use(cors());
