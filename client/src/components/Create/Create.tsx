import { useEffect, useState } from 'react'
import {Socket, io} from 'socket.io-client'

interface Props {
    socket: Socket;
    isOwner: boolean;
}
function Create( {socket , isOwner}: Props) {
    const [roomID, setRoomID] = useState<string>('');
    const [ids, setIds] = useState<string[]>([]);

    useEffect(() => {
       if (isOwner) {
        console.log(socket.id);
        const id = socket.id.slice(-6);
        setRoomID(id);
        socket.emit('create-room', id);
        console.log("user joined room" )
        
       }
       else {
        socket.emit('join-room', roomID);
       }
        const handleJoinOrLeave = (roomID: string) => {
          getIds(roomID);
      };
  
      socket.on('join-room', handleJoinOrLeave);
      socket.on('leave-room', handleJoinOrLeave);

      return () => {
        socket.off('join-room', handleJoinOrLeave);
        socket.off('leave-room', handleJoinOrLeave);
    };
    }, []);

    function getIds (roomID: string) {
        socket.emit('get-ids', roomID);
        socket.on('ids', (ids) => {
            setIds(ids);
          });
    }
  return (
    <>
    <div>Create</div>
    <div>{roomID}</div>
    <ul>
        {ids.map((id, index) => (
            <li key={index}>{id}</li>
        ))}
    </ul>
    </>
  )
}

export default Create