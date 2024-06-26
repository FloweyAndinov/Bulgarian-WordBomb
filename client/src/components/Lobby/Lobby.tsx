import { useEffect, useState } from 'react'
import {Socket, io} from 'socket.io-client'


/*
component retired
*/

interface Props {
    socket: Socket;
    isOwner: boolean;
    roomIDProp?: string;
}
function Lobby( {socket , isOwner, roomIDProp ='error_room_ID'}: Props) {
    const [roomID, setRoomID] = useState<string>('');
    const [ids, setIds] = useState<string[]>([]);
    const [names, setNames] = useState<string[]>([]);
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

      



      socket.on('send-game-screen', () => {
        setStartGame(true);
      });

    //   return () => {
    //     socket.off('join-room', handleJoinOrLeave);
    //     socket.off('leave-room', handleJoinOrLeave);
    // };
    }, []);

    function getIds (roomID: string) {
        socket.emit('get-ids', roomID);
        socket.on('ids', (ids , names) => {
            console.log(ids);
            setIds(ids);
            setNames(names)
          });
    }

    function NameisYou(index : number , id : string) {
      let idindex = ids.indexOf(id)
      if (idindex < 0) {
        return false; // this should be impossible to happen
      }
      return idindex == index ? true : false
    }

    function CopyInviteLink() {
      let baseurl = window.location.href.split('?')[0];
      let invitelink = baseurl + '?id=' + roomID
      navigator.clipboard.writeText(invitelink)
    }


  return (
    <>
    {startGame ? <></> : 
    <div>
    <div>Create</div>
    <div>{roomID}</div>
    <ul>
        {names.map((name, index) => (
            <li key={index}>{name} {name==null? ids[index] : <></>}{NameisYou(index, socket.id)? <span>(Ти)</span> : <></>}</li>
        ))}
    </ul>
    {isOwner ? <button onClick={() => socket.emit('send-game-screen', roomID)}>Start Game</button> : <></>}
    <div>
      <button onClick={() => {CopyInviteLink()}}> Copy Invite Link</button>
    </div>
    </div>
}
    </>
  )
}

export default Lobby