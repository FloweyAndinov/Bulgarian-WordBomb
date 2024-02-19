
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Home.module.scss'
import Lobby from '../Lobby/Lobby';
import Join from '../Join/Join';
import { Socket } from 'socket.io-client';
import Game from '../Game/Game';

interface Props {
    socket: Socket;
}

function Home( {socket}: Props) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('id'))
    const [showJoin, setShowJoin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showJoinInvite, setShowJoinInvite] = useState(false);
    const [nameText, setNameText] = useState('');
    
    useEffect(() => {
        console.log(query)

        socket.on('connect', () => {
            
            if (query?.trim()!=null) {
                console.log("query is not null!!")
                setShowJoinInvite(true)
            }
        });      
    }, [socket]);

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setNameText(e.target.value);
      };

    function SetName() {
        socket.emit('set-name' , nameText)
    }

    if (showJoin) {
        return <Join />;
    }

    if (showJoinInvite) {
        if (query) {
        socket.emit('join-room-window', query);
        return <Lobby socket={socket} isOwner={false} roomIDProp={query}/>
        }
    }

    if (showCreate) {
        return <Lobby socket={socket} isOwner={true}/>
    }
  return (
    <>
    
    <div className={styles.title}>
        WordBomb на български
    </div>
    <div>
        <span>Въведи си името тук</span>
        <input type="text" onChange={handleInputChange}/>
        <button onClick={SetName}>Сложи</button>
    </div>
    <div className={styles.actionButtons}>
        <button onClick={() => setShowCreate(true)}>Create</button>
        <button onClick={() => setShowJoin(true)}>Join</button>
    </div>
    
    </>
    
  )
}

export default Home