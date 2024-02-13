import React, { CSSProperties, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';
import WordSection from '../WordSection/WordSection';
import Home from '../Home/Home';
import styles from '../Game/Game.module.scss'
import bombPicture from '../../assets/bomb.png'
import arrowPicture from '../../assets/arrow.png'

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
  const [arrowAngle, setArrowAngle] = useState(0)
  const [playerList, setPlayerList] = useState<Array<string>>([])

  useEffect(() => {

    
    const id = socket.id.slice(-6)
    if (isOwner) {
      socket.emit('start-game', id)
    }
    //event for *play word* and *wait for word*
    socket.on('play-type', (serverWord : string, playerAngle : number) => {
      setPlayType(true)
      setWord(serverWord)
      console.log(playerAngle)
      setArrowAngle(playerAngle)
    })
    socket.on('play-wait', (serverWord : string, playerAngle : number) => {
      setPlayType(false)
      setWord(serverWord)
      console.log(playerAngle)
      setArrowAngle(playerAngle)
    })
    socket.on('recieve-player-word', (playerWord : string) => {
      setPlayerWord(playerWord)
      
    })
    socket.on('recieve-players-names', (recievedList : Array<string>) => {
        setPlayerList(recievedList)
        console.log('recieved players')
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

  const playerStyle  = (index : number) : CSSProperties => ({
    position: 'absolute',
    width: 'max-content',
    transform: `rotate(${index * 45}deg) translate(20vh) rotate(-${index * 45}deg)`
  });

  if (showHome) {
    return <Home socket={socket}/>
  }
  return (
    
    <>
    <div>Game</div>
    <div className={styles.container}>

    <div style={{position:'absolute', width:'max-content', height:'100px', left:'-120%', top:'11vh', }}>
      <span style={{width: 'max-content'}}>Write a word that cointains</span>
      <br />
      <span style={{color: 'red'}}>{word}</span>
    </div>

    <div className={styles.arrowpic} style={{position: 'absolute', left : '4vh', top: '-4vh',transformOrigin: 'center left',  transform: `rotate(${arrowAngle}deg)`}}>
      <img src={arrowPicture} alt="arrow" style={{width : '15vh', height: '15vh'}}/>
    </div>

    <div className={styles.bombpic} style={{position: 'absolute', left : '-7vh', top: '-7vh'}}>
      <img src={bombPicture} alt="bomb" style={{width : '20vh', height: '20vh'}}/>
    </div>

   
    
    <span style={{color:'transparent'}}>Player 0</span> {/*helps with positioning the image */}
       <div className='players'>
        {playerList.map((player, index) => (  

        <div key={player} style={playerStyle(index)}>
          {player}
        </div>

        ))}
       </div>
      
    </div>
    
    
    <div className={styles.textsend}>
      <WordSection socket={socket} enabled={playType} word={word} playerword={playerWord} roomID={roomIDProp} />
      </div>
    </>
  )
}

export default Game