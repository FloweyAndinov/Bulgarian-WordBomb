import React, { useEffect, useRef } from 'react'
import styles from './Join.module.scss'
import {Socket, io} from 'socket.io-client'
import {socket} from '../../socket'
import Create from '../Create/Create';

function Join() {
  const [rooms, setRooms] = React.useState<Map<string, Set<string>>>(new Map());
  const [joinedRoom, setJoinedRoom] = React.useState<boolean>(false);
    const counter = useRef(0);


    useEffect(() => {
        socket.emit('get-rooms');
        socket.on('rooms', (roomsMap) => {
          console.log(roomsMap);
          setRooms(roomsMap);
          });
        counter.current++;
        console.log(counter.current);
        socket.on('joined-room', (roomID: string) => {
          console.log("user joined room" + roomID)
          socket.emit('get-rooms');
          setJoinedRoom(true); 
          });
        }, []);

        function JoinRoom (roomID: string) {
            socket.emit('join-room', roomID);
         
        }
  return (
    <>
    {joinedRoom ? <Create socket={socket} isOwner={false}/> :
      <div>
            <h1 className={styles.title}>Join a Game</h1>
            <div className={styles.gamesList}>
            {Array.from(rooms.entries()).filter(([roomId, roomSet]) => Array.from(roomSet)[0].length === 6)
            .map(([roomId, roomSet], index) => (
              <button key={roomId} onClick={() => JoinRoom(Array.from(roomSet)[0])}>
                  Join {Array.from(roomSet)[0]}
              </button>
            ))}
            </div>
        </div>
}
    </>
  )
}

export default Join