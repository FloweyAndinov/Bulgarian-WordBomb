import { useEffect, useState } from 'react'
import {Socket, io} from 'socket.io-client'
function Create() {
    const [roomID, setRoomID] = useState<string>('');
    const [ids, setIds] = useState<string[]>([]);

    // useEffect(() => {
    //     socket.on('connect', () => {
    //     console.log(socket.id);
    //     // const id = socket.id.slice(-6);
    //     // setRoomID(id);
    //     // socket.emit('create-room', id);
    //     });

    //     // socket.on('user-joined', (roomID) => {
    //     //     getIds(roomID);
    //     // });

    //     // socket.on('user-left', (roomID) => {
    //     //     getIds(roomID);
    //     // });
    // }, []);

    // function getIds (roomID: string) {
    //     socket.emit('get-ids', roomID);
    //     socket.on('ids', (ids) => {
    //         setIds(ids);
    //       });
    // }
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