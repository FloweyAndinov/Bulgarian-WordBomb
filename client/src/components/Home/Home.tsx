
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Home.module.scss'
import Lobby from '../Lobby/Lobby';
import Join from '../Join/Join';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button"


import ThemeSwitch from '../ThemeSwitch/ThemeSwitch';
import ConnectButton from '../ConnectButton/ConnectButton';



import { Toaster } from "@/components/ui/sonner"
import CreateButton from '../CreateButton/CreateButton';
import Rules from '@/components/Rules/Rules';
import JoinButton from '../JoinButton/JoinButton';
import React from 'react';
import styled, { css, keyframes } from "styled-components";
import LetterBackground from '../LetterBackground/LetterBackground';




interface Props {
    socket: Socket;
}

function Home( {socket}: Props) {

    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('id'))
    const [showJoin, setShowJoin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showJoinInvite, setShowJoinInvite] = useState(false);
    const [roomID, setRoomID] = React.useState<string>('');
    const [joinedRoom, setJoinedRoom] = React.useState<boolean>(false);

    
    
    useEffect(() => {
        console.log(query)

        socket.on('connect', () => {
            
            if (query?.trim()!=null) {
                console.log("query is not null!!")
                socket.emit('join-room-window', query);
            }
        });
        
        socket.on('joined-room-window' , () => {
            ActivateJoinInvite()
        })

        socket.on('joined-room-window', (roomID) => {
            
            setJoinedRoom(true); 
            setRoomID(roomID);
            });
    }, [socket]);

   function createRoom() {
    setShowCreate(true) 
   }

   if (showCreate) {
    return <Lobby socket={socket} isOwner={true}/>
}
    function ActivateJoinInvite() {
        setShowJoinInvite(true)
    }

    if (joinedRoom) {
       return <Lobby socket={socket} isOwner={false} roomIDProp={roomID}/> 
    }

    if (showJoinInvite) {
        if (query) 
        return <Lobby socket={socket} isOwner={false} roomIDProp={query}/>
    }

    
  return (
    <>

        <LetterBackground/>

        <div style={{position:'fixed', display:'flex', right:0 , marginRight:'5vw', marginTop: '1em'}}>
      <ThemeSwitch/>
      {/* <LanguageSwitch language="en" passLanguage={(language : string) => { ChangeLanguage(language)}} /> */}
      
      </div>
      
      <div style={{position: 'relative', display:'flex', flexDirection:'column', width:'fit-content', left: '5vw', top: '30vh'}}>
        <CreateButton socket={socket} callParentFunction={() => createRoom()}/>
        <JoinButton callParentFunction={() => createRoom()}/>
        <Rules/>
        </div>


    <div className={styles.title}>
        WordBomb на български
    </div>
    
    <div style={{position: 'fixed', float:'right', right: '5vw', bottom: '5vh'}}>
      <ConnectButton/>
      </div>
      <Toaster />
    </>
    
  )
}

export default Home