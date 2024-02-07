import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';
import WordSection from '../WordSection/WordSection';
import Home from '../Home/Home';
import styles from '../Game/Game.module.scss'

interface Props {
  socket: Socket;
  isOwner: boolean;
  roomIDProp?: string;
}

function Game({socket , isOwner, roomIDProp} : Props) {

  const [showHome, setShowHome] = useState(false)
  const [word, setWord] = useState("")
  const [playType , setPlayType] = useState(false)
  const [playerWord, setPlayerWord] = useState("")

  useEffect(() => {

    
    const id = socket.id.slice(-6)
    if (isOwner) {
      socket.emit('start-game', id)
    }
    //event for *play word* and *wait for word*
    socket.on('play-type', (serverWord : string) => {
      setPlayType(true)
      setWord(serverWord)
      console.log("received type")
    })
    socket.on('play-wait', (serverWord : string) => {
      setPlayType(false)
      setWord(serverWord)
      console.log("received wait")
    })
    socket.on('recieve-player-word', (playerWord : string) => {
      setPlayerWord(playerWord)
    })



    socket.on('send-lobby', () => {
      console.log('send-home')
      setShowHome(true)
    })

    const handleBeforeUnload = () => {
      if(isOwner) {
        socket.emit('delete-room', id)
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
    <div className={styles.container}>

        <div className={styles.circle_deg_0}>
        Player 1
      </div> 

      <div className={styles.circle_deg_45}>
        Player 2
      </div> 

      <div className={styles.circle_deg_90}>
        Player 3
      </div> 

      <div className={styles.circle_deg_135}>
        Player 4
      </div> 

      <div className={styles.circle_deg_180}>
        Player 5
      </div> 

      <div className={styles.circle_deg_225}>
        Player 6
      </div> 

      <div className={styles.circle_deg_270}>
        Player 7
      </div> 

      <div className={styles.circle_deg_315}>
        Player 8
      </div> 

    </div>
    <WordSection socket={socket} enabled={playType} word={word} playerword={playerWord}/>
    </>
  )
}

export default Game