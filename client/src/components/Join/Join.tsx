import React, { useEffect, useRef } from 'react'
import styles from './Join.module.scss'
import {Socket, io} from 'socket.io-client'
import {socket} from '../../socket'

function Join() {
  const [rooms, setRooms] = React.useState<Map<string, Set<string>>>(new Map());
    const counter = useRef(0);


    useEffect(() => {
        socket.emit('get-rooms');
        socket.on('rooms', (roomsMap) => {
          console.log(roomsMap);
          setRooms(roomsMap);
          });
        counter.current++;
        console.log(counter.current);
        }, []);

        function JoinRoom (roomID: string) {
            socket.emit('join-room', roomID);
        }
  return (
    <>
      <div>
            <h1 className={styles.title}>Join a Game</h1>
            <div className={styles.gamesList}>
            {Array.from(rooms.entries()).map(([roomId, roomSet], index) => (
              <button key={roomId} onClick={() => JoinRoom(roomId)}>
                  Join {Array.from(roomSet)[0]}
              </button>
            ))}
            </div>
        </div>
    </>
  )
}

export default Join