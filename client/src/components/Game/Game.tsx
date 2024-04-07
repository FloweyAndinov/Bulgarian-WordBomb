import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';
import WordSection from '../WordSection/WordSection';
import Home from '../Home/Home';
import styles from '../Game/Game.module.scss'
import tablePicture from '@/assets/table.svg'
import pistolPicture from '@/assets/pistol.png'
import background from '@/assets/game_bg.svg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PlayerSettings from '../GameSettings/PlayerSettings';
import OwnerSettings from '../GameSettings/OwnerSettings';
import { Toaster } from "@/components/ui/sonner"
import { spawn } from 'child_process';
import { Button } from '../ui/button';
import { toast } from 'sonner';
 // @ts-ignore
import Timeout from 'timeout-refresh'


import bomb_clock_sound from '@/assets/sfx/Clock.wav'
import bomb_fuse_sound from '@/assets/sfx/Bomb_Fuse.wav'
import change_turn_sounds from '@/assets/sfx/Change_Turn.wav'
import wrong_sound from '@/assets/sfx/Wrong_Word.mp3'
import { BugPlay } from 'lucide-react';
import links from '@/components/AvatarPicture/AvatarPictures'
import ReactDOM from 'react-dom';



interface Props {
  isOwner: boolean;
  roomIDProp: string;
  socket : Socket;
  clearGame: (newValue: boolean) => void ;
}



function Game({isOwner, roomIDProp, socket, clearGame} : Props) {
  

  const [showHome, setShowHome] = useState(false)
  const [word, setWord] = useState("")
  const [playType , setPlayType] = useState(false)
  const [playerWord, setPlayerWord] = useState("")
  const [arrowAngle, setArrowAngle] = useState(0)
  const [playerList, setPlayerList] = useState<Array<string>>([])
  const [roomID, setRoomID] = useState("")
  const [ownership, setOwnership] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [bombclockSfx] =useState(new Audio(bomb_clock_sound))
  const [bombfuseSfx] =useState(new Audio(bomb_fuse_sound))
  const [changeturnSfx] =useState(new Audio(change_turn_sounds))
  const [wrongSfx] =useState(new Audio(wrong_sound))
  const [debug, setDebug] = useState(false)
  const [angleMultiplier, setAngleMultiplier] = useState(0)
  const [avatarsMap, setAvatarsMap] = useState(new Map<string, number>())
  const [userID , setUserID] = useState("")
  const [intialised, setInitialised] = useState(false)
  

  bombclockSfx.preload = 'metadata'
  

  function play() {
    bombclockSfx.play()
  }

  function loopPlay() {
    bombclockSfx.loop = true
    if (!bombclockSfx.paused) {
      speedUpSfx() // this happens when changing turns
    }
    bombclockSfx.play()
  }

  function sfxSetup() {
    bombclockSfx.playbackRate = 0.95
    bombfuseSfx.volume = 0.1
    bombfuseSfx.loop = true;
    bombfuseSfx.play()

  }
  function speedUpSfx() {
    bombclockSfx.pause()
    bombclockSfx.playbackRate += 0.01
    bombclockSfx.currentTime = 0
  }

  function stopSfx() {
    bombclockSfx.pause()
    bombfuseSfx.pause()
    bombclockSfx.currentTime = 0
    bombfuseSfx.currentTime = 0
  }

  useEffect(() => {


    const checkId = setInterval(() => {
        setUserID(socket.id.slice(-6))
      }, 1000)
    
    let id = socket.id.slice(-6)
    console.log(id, "is the user id")
    if (isOwner) {
        setRoomID(id);
        // console.log("owner created room")
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
      setArrowAngle(playerAngle)
      if (playerAngle == 0) {
        setAngleMultiplier(prev => prev + 1)
      }
     
      
     changeturnSfx.play()
        loopPlay()
    })
    socket.on('play-wait', (serverWord : string, playerAngle : number) => {
      setGameStarted(true)
      setPlayType(false)
      setWord(serverWord)
      console.log(playerAngle)
      setArrowAngle(playerAngle)
      if (playerAngle == 0) {
        setAngleMultiplier(prev => prev + 1)
      }
     
     
     

     changeturnSfx.play()
      loopPlay()
      
    })
    socket.on('broadcast-preview-word', (playerWord : string) => {
      setPlayerWord(playerWord)
      
    })
    socket.on('recieve-players-names', (recievedList : Array<string>) => {
        setPlayerList(recievedList)
        // console.log('recieved players')
    })

    

    socket.on('send-lobby', () => {
      clearInterval(checkId)
      if (isOwner) {
        socket.emit('unlock-room', roomID)
      }
      stopSfx()
      clearGame(false)
    })

    const handleBeforeUnload = () => {
      
      if(isOwner) {
        socket.emit('delete-room', roomID)
      }
      else {
        socket.emit('leave-room', roomIDProp)
      }
    };

    socket.emit('check-ownership')

    socket.on('recieve-avatars', (avatarsMap) => {
      let localavatarsMap = new Map()
      Object.entries(avatarsMap).forEach((key) => {
        localavatarsMap.set(key[0], key[1])
      })
      setAvatarsMap(localavatarsMap)
    })

    socket.on('ownership-confirmed', () => {
      setOwnership(true)
    })

    socket.on('ownership-denied', () => {
      setOwnership(false)
    })

    socket.on('kicked', () => {
      // console.log('kicked')
      stopSfx()
      socket.disconnect()
      setShowHome(true)
      setTimeout(() => {
      toast("You have been kicked from the room")
      } , 100)
    })

    socket.on('word-submit-denied', () => {
      wrongSfx.play()
    })
   
    
  
    
    // Attach an event listener for the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    
    
  }, [])

 useEffect(() => {
  if (!intialised && roomID.length === 6) {
    setInitialised(true)
    const avatarsInterval = setInterval(() => {
        socket.emit('request-avatars', (roomID))
        clearInterval(avatarsInterval)
        console.log("requested avatars")
      
    }, 500)
  }
  else {
    console.log("waiting for avatars")
  }
 }, [roomID])

  

  function createGame () {
    socket.emit('start-game', socket.id.slice(-6))
    sfxSetup()
  }

  function playerStyle (index : number) : CSSProperties 
  {
    let translateLength = 17;
    let degrees = 0;
    if (index!=0) {
      if (index%4==0) {
        translateLength = 17;
      }
      else if (index%2==0) {
        translateLength = 15;
        
      }
      else if (index%2==1) {
        translateLength = 16;
      }
    }
    let degreeOffset = 5;
    switch (index) {
      case 1 :
        degrees = degreeOffset;
        break;
      case 3:
        degrees = -degreeOffset;
        break;
      case 5 :
        degrees = degreeOffset;
        break;
      case 7:
        degrees = -degreeOffset;
        break;
      default:
        degrees = 0;
    }
    return (
      {
      position: 'fixed',
      width: 'max-content',
      transform: `translate(-50%, -50%) rotate(${(index * 45) - degrees}deg) translate(${translateLength}em) rotate(-${(index * 45) - degrees}deg)`
    }
    )
  };

  if (showHome) {
    stop()
    return <Home socket={socket}/>
  }

  let avatarLinks = links()
  return (
    
    <>
    
    
    <div style={{height : '100vh', width : '100vw', position : 'fixed', backgroundImage : `url(${background})`, opacity : '10%', }}/>
    {debug ? 
    <div>
      <div style={{position:'fixed'}}>
      <span>{roomID} : room ID</span>
      <br />
      <span>{userID ? userID : 'error'} : user ID</span>
      </div>
    </div> : 
    null}

    <div style={{position:'relative', left : '85vw', top: '2em', width : '15vw', display:'flex', justifyContent:'space-evenly'}}>
      <Button style={{opacity:'50%'}} variant={debug ? "destructive" : "ghost"} onClick={() => {setDebug(!debug)}}>
        <BugPlay />
      </Button>


      {ownership ? <OwnerSettings roomID={roomID}/> : <PlayerSettings roomID={roomID}/>}
    </div>


    <div className='' style={{position:'relative', height:'25em', width:'25em', top:'25em', left:'50vw', display:'flex', transform:'translate(-50%, -50%)'}}>
        
        
          
          <img src={tablePicture} className='self-center' style={{pointerEvents:'none'}}/>
          <img src={pistolPicture} alt="arrow" style={{pointerEvents:'none', position: 'absolute', left : '35%', top: '50%', transform: `translate(0%, -50%) rotate(${((angleMultiplier * 360) + (arrowAngle * 45))}deg)`, zIndex:'1', width : 'auto', height: '5em', transition: arrowAngle === 8 ? '' : 'transform 0.3s ease-in-out' }}/>
          


        
        <div style={{position:'absolute', top:'50%', left:'50%'}}>
        {playerList.map((player, index) => (  
        <div className='' key={player} style={{display:'flex', flexDirection:'column', ...playerStyle(index)}}>
          <Avatar className='mx-auto my-2' style={{width : '4em', height:'auto'}}>
            <AvatarImage src={avatarLinks.get(avatarsMap.get(player) || 1)} style={{pointerEvents:'none'}}/>
            <AvatarFallback>{player[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className='mx-auto text-2xl'>{player}</span>
        </div>
        ))}
        </div>
        
     


    </div>

     
    {gameStarted ? 
      <div className='flex flex-col' style={{position:'relative', width:'max-content', height:'100px', bottom:'-20em', justifyContent:'center', left:'50%', transform:'translateX(-50%)', marginBottom : '25em'}}>
        <span style={{width: 'max-content', fontSize:'1.5em'}}>Напиши дума която съдържа</span>
        <br />
        <span style={{fontSize:'1.5em', color:'red', textAlign:'center'}}>{word}</span>
        {gameStarted ? <WordSection socket={socket} enabled={playType} word={word} playerword={playerWord} roomIDProp={roomID} /> : null}
      </div>
       :
       <div className='flex flex-col' style={{position:'relative', width:'max-content', height:'100px', top:'-20em', justifyContent:'center', left:'50%', transform:'translateX(-50%)'}}>
        <span style={{width: 'max-content', fontSize:'1.5em'}}>Изчакай да започне играта</span>
        </div>
        }
    
    
    <div className={styles.textsend}>
      
      </div>
      <div style={{ display : 'flex' , position:'relative', bottom:'-15em', justifyContent:'center', width:'100vw'}}>
          {ownership && !gameStarted? <Button style={{fontSize:'1.5em', padding:'1em'}} disabled={playerList.length <= 1 ? true : false} onClick={createGame}>Започни игра</Button> : null}
      </div>
      <Toaster/>
    </>
  )
}

export default Game