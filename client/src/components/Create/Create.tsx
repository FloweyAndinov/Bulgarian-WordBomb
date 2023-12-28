import { useEffect, useState } from 'react'
import {Socket, io} from 'socket.io-client'
import Game from '../Game/Game';

interface Props {
    socket: Socket;
    isOwner: boolean;
    roomIDProp?: string;
}
function Create( {socket , isOwner, roomIDProp ='errorroomID'}: Props) {
    const [roomID, setRoomID] = useState<string>('');
    const [ids, setIds] = useState<string[]>([]);
    const [startGame, setStartGame] = useState<boolean>(false);

    useEffect(() => {
       if (isOwner) {
        console.log(socket.id);
        const id = socket.id.slice(-6);
        setRoomID(id);
        socket.emit('create-room', id);
        // console.log("user created room" , id);
       }
       else {
        setRoomID(roomIDProp);
        socket.emit('join-room', roomIDProp);
       }

      socket.on('user-connected', (room) => {
        console.log("get the user ids", room);
        getIds(room);
      })





      socket.on('start-game', () => {
        setStartGame(true);
      });

    //   return () => {
    //     socket.off('join-room', handleJoinOrLeave);
    //     socket.off('leave-room', handleJoinOrLeave);
    // };
    }, []);

    function getIds (roomID: string) {
        socket.emit('get-ids', roomID);
        socket.on('ids', (ids) => {
            console.log(ids);
            setIds(ids);
          });
    }
  return (
    <>
    {startGame ? <Game/> : 
    <div>
    <div>Create</div>
    <div>{roomID}</div>
    <ul>
        {ids.map((id, index) => (
            <li key={index}>{id} {id===socket.id? <span>(Ти)</span> : <></>}</li>
        ))}
    </ul>
    {isOwner ? <button onClick={() => socket.emit('start-game', roomID)}>Start Game</button> : <></>}
    </div>
}
    </>
  )
}

export default Create