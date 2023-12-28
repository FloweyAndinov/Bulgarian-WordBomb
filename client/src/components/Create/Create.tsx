import { useEffect, useState } from 'react'
import {Socket, io} from 'socket.io-client'
import Game from '../Game/Game';

interface Props {
    socket: Socket;
    isOwner: boolean;
}
function Create( {socket , isOwner}: Props) {
    const [roomID, setRoomID] = useState<string>('');
    const [ids, setIds] = useState<string[]>([]);
    const [startGame, setStartGame] = useState<boolean>(false);

    useEffect(() => {
       if (isOwner) {
        console.log(socket.id);
        const id = socket.id.slice(-6);
        setRoomID(id);
        socket.emit('create-room', id);
        console.log("user created room" )
        
       }
       else {
        console.log("user joined room")
        socket.emit('joined-room');
       }
       function handleJoinOrLeave (roomID: string) {
        console.log("get the ids")
          getIds(roomID);
      };
  
      socket.on('join-room', handleJoinOrLeave);
      socket.on('leave-room', handleJoinOrLeave);
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
            <li key={index}>{id}</li>
        ))}
    </ul>
    {isOwner ? <button onClick={() => socket.emit('start-game', roomID)}>Start Game</button> : <></>}
    </div>
}
    </>
  )
}

export default Create