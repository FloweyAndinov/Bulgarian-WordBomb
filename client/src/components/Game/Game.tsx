import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';
import WordSection from '../WordSection/WordSection';
import Home from '../Home/Home';
import styles from '../Game/Game.module.scss'
import bombPicture from '../../assets/bomb.png'
import arrowPicture from '../../assets/arrow.png'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PlayerSettings from '../GameSettings/PlayerSettings';
import OwnerSettings from '../GameSettings/OwnerSettings';
import { Toaster } from "@/components/ui/sonner"
import { spawn } from 'child_process';
import { Button } from '../ui/button';
import { socket } from '@/socket';
import { toast } from 'sonner';



interface Props {
  isOwner: boolean;
  roomIDProp: string;
}

function Game({isOwner, roomIDProp} : Props) {

  const [showHome, setShowHome] = useState(false)
  const [word, setWord] = useState("")
  const [playType , setPlayType] = useState(false)
  const [playerWord, setPlayerWord] = useState("")
  const [arrowAngle, setArrowAngle] = useState(0)
  const [playerList, setPlayerList] = useState<Array<string>>([])
  const [roomID, setRoomID] = useState("")
  const [ownership, setOwnership] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {

    let id = socket.id.slice(-6);
    if (isOwner) {
        setRoomID(id);
        console.log("owner created room")
        socket.emit('create-room', id);
    }
    else {
        setRoomID(roomIDProp);
        socket.emit('join-room', roomIDProp);
    }

    //event for *play word* and *wait for word*
    socket.on('play-type', (serverWord : string, playerAngle : number) => {
      setGameStarted(true)
      setPlayType(true)
      setWord(serverWord)
      console.log(playerAngle)
      setArrowAngle(playerAngle)
    })
    socket.on('play-wait', (serverWord : string, playerAngle : number) => {
      setGameStarted(true)
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
        socket.emit('delete-room', roomID)
      }
      
    };

    socket.emit('check-ownership')

    socket.on('ownership-confirmed', () => {
      setOwnership(true)
    })

    socket.on('ownership-denied', () => {
      setOwnership(false)
    })

    socket.on('kicked', () => {
      console.log('kicked')
      socket.disconnect()
      setShowHome(true)
      setTimeout(() => {
      toast("You have been kicked from the room")
      } , 100)
    })
  
    
    // Attach an event listener for the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    
  }, [])

  function createGame () {
    socket.emit('start-game', socket.id.slice(-6))
  }

  const playerStyle  = (index : number) : CSSProperties => ({
    position: 'fixed',
    width: 'max-content',
    transform: `translate(-50%, -50%) rotate(${index * 45}deg) translate(clamp(5rem, 20vw, 20rem)) rotate(-${index * 45}deg)`
  });

  if (showHome) {
    return <Home socket={socket}/>
  }
  return (
    
    <>
    
    <div>Game</div>
    <div>
      <span>{roomID} : room ID</span>
      <br />
      <span>{socket.id.slice(-6)} : user ID</span>
    </div>

    <div style={{position:'fixed', right : '5vw', top: '2em', width : '20em', display:'flex', justifyContent:'flex-end'}}>
      {ownership ? <OwnerSettings roomID={roomID}/> : <PlayerSettings roomID={roomID}/>}

  
    </div>


    <div className='' style={{position:'fixed', height:'10em', width:'10em', top:'40vh', left:'50vw', display:'flex', transform:'translate(-50%, -50%)'}}>
        
        
          <div className='self-center bg-orange-900' style={{}}>
          <img src={bombPicture} className='self-center'/>
            <img src={arrowPicture} alt="arrow" style={{position: 'absolute', left : '0', top: '0', transformOrigin: 'center left',  transform: `translate(45%, 5%) rotate(${arrowAngle * 45}deg)`, zIndex:'0', opacity:'30%', width : '15em', height: '10em', transition:'0.3s ease-in-out'}}/>
          </div>


        
        <div style={{position:'absolute', top:'50%', left:'50%'}}>
        {playerList.map((player, index) => (  
        <div className='' key={player} style={{display:'flex', flexDirection:'column', ...playerStyle(index)}}>
          <Avatar className='mx-auto my-1'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className='mx-auto '>{player}</span>
        </div>
        ))}
        </div>
        
      
      <div className='flex flex-col' style={{position:'absolute', width:'max-content', height:'100px', top:'13em', left:'-1em'}}>
        <span style={{width: 'max-content'}}>Write a word that cointains</span>
        <br />
        <span style={{color: 'red', textAlign:'center'}}>{word}</span>
      </div>


    </div>
    
    
    <div className={styles.textsend}>
      {gameStarted ? <WordSection socket={socket} enabled={playType} word={word} playerword={playerWord} roomIDProp={roomID} /> : null}
      </div>
      <div style={{position:'fixed', bottom:'10vh', left:'50%', transform:'translateX(-50%)'}}>
          {ownership && !gameStarted? <Button disabled={playerList.length <= 1 ? true : false} onClick={createGame}>Start Game</Button> : null}
      </div>
      <Toaster/>
    </>
  )
}

export default Game