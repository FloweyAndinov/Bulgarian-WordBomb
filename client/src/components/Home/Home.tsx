
import { useEffect, useState } from 'react';
import styles from './Home.module.scss'
import Lobby from '../Lobby/Lobby';
import Join from '../Join/Join';
import { Socket } from 'socket.io-client';

interface Props {
    socket: Socket;
}

function Home( {socket}: Props) {

    const [showJoin, setShowJoin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    
    useEffect(() => {
        socket.on('connect', () => {
        // console.log(socket.id);
        });
    }, [socket]);

    if (showJoin) {
        return <Join />;
    }

    if (showCreate) {
        return <Lobby socket={socket} isOwner={true}/>
    }
  return (
    <>
    <div className={styles.title}>
        WordBomb на български
    </div>
    <div className={styles.actionButtons}>
        <button onClick={() => setShowCreate(true)}>Create</button>
        <button onClick={() => setShowJoin(true)}>Join</button>
    </div>
    </>
  )
}

export default Home