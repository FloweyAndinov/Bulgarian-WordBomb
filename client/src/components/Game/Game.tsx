import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';
import WordSection from '../WordSection/WordSection';
import Home from '../Home/Home';
import styles from '../Game/Game.module.scss'
import bombPicture from '../../assets/bomb.png'
import arrowPicture from '../../assets/arrow.png'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  socket: Socket;
  isOwner: boolean;
  roomIDProp: string;
}

function Game({socket , isOwner, roomIDProp} : Props) {

  const [showHome, setShowHome] = useState(false)
  const [word, setWord] = useState("")
  const [playType , setPlayType] = useState(false)
  const [playerWord, setPlayerWord] = useState("")
  const [arrowAngle, setArrowAngle] = useState(0)
  const [playerList, setPlayerList] = useState<Array<string>>([])
  const [roomID, setRoomID] = useState("")

  

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

 

  useEffect(() => {
    setRoomID(roomIDProp)
  }, [roomIDProp])


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
    <div className='' style={{position:'fixed', height:'10em', width:'10em', top:'40vh', left:'50vw', display:'flex', transform:'translate(-50%, -50%)'}}>
        
        
          <div className='self-center bg-orange-800' style={{}}>
          <img src={bombPicture} className='self-center'/>
            <img src={arrowPicture} alt="arrow" style={{position: 'absolute', left : '0', top: '0', transformOrigin: 'center left',  transform: `translate(45%, 5%) rotate(${arrowAngle * 45}deg)`, zIndex:'0', opacity:'30%', width : '15em', height: '10em', transition:'0.3s ease-in-out'}}/>
          </div>


        
        <div style={{position:'absolute', top:'50%', left:'50%'}}>
        {playerList.map((player, index) => (  
        <div className='' key={player} style={{display:'flex', flexDirection:'column', ...playerStyle(index)}}>
          <Avatar className='mx-auto'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {player}
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
      <WordSection socket={socket} enabled={playType} word={word} playerword={playerWord} roomIDProp={roomID} />
      </div>
    </>
  )
}

export default Game