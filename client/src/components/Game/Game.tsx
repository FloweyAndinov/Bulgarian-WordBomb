import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';
import WordSection from '../WordSection/WordSection';
import Home from '../Home/Home';

interface Props {
  socket: Socket;
  isOwner: boolean;
  roomIDProp?: string;
}

function Game({socket , isOwner, roomIDProp} : Props) {

  const [showHome, setShowHome] = useState(false)

  useEffect(() => {

    
    const id = socket.id.slice(-6)
    if (isOwner) {
      socket.emit('start-game', id)
    }
    //event for *play word* and *wait for word*
    socket.on('play-type', () => {

    })
    socket.on('play-wait', () => {

    })

    socket.on('send-lobby', () => {
      console.log('send-home')
      setShowHome(true)
    })

    const handleBeforeUnload = () => {
      if(isOwner) {
        socket.emit('delete-room', id)
      }
      else {
        socket.emit('dc', socket, roomIDProp)
      }
    };

    // Attach an event listener for the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

  }, [])

  if (showHome) {
    return <Home socket={socket}/>
  }
  return (
    <>
    <div>Game</div>
    <WordSection enabled={false}/>
    </>
  )
}

export default Game