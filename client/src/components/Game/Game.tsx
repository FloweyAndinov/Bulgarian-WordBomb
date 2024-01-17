import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client';
import WordSection from '../WordSection/WordSection';

interface Props {
  socket: Socket;
  isOwner: boolean;
  roomIDProp?: string;
}

function Game({socket , isOwner, roomIDProp} : Props) {

  useEffect(() => {
    //event for *play word* and *wait for word*
    socket.on('play-type', () => {

    })
    socket.on('play-wait', () => {

    })

  }, [])
  return (
    <>
    <div>Game</div>
    <WordSection enabled={false}/>
    </>

  )
}

export default Game