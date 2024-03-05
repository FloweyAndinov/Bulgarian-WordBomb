import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import styles from "../WordSection/WordSection.module.scss"

interface Props {
    socket : Socket
    enabled : boolean
    word : string
    playerword : string
    roomIDProp : string
}

interface EnabledProps {
    socket : Socket
    roomIDProp : string
}
function WordSection({socket, enabled, roomIDProp}: Props) {
    const [typeable, setTypeable] = useState(false)
    const [roomId, setRoomID] = useState<string>("")
    const [currentword, setCurrentWord] = useState("")
    

   
    useEffect(() => {
    setTypeable(enabled)
    // console.log(enabled)
    // console.log(typeable)
    },[enabled])
    
    useEffect(() => {
        setRoomID(roomIDProp)
    }, [roomIDProp])

    // socket.on('recieve-player-word', (word : string) => {
    //     setPlayerWord(word)
    // })

    // socket.on ('recieve-word-to-play', (word : string) => {
    //     setCurrentWord(word)
    // })

   

   

  return (
    <>
    {typeable? <Enabled socket={socket} roomIDProp={roomId}/> : <Disabled/>}
    </>
  )

  
}

function Enabled({socket, roomIDProp}: EnabledProps) {

    const [playerWord, setPlayerWord] = useState("")
    const [roomId, setRoomID] = useState<string>("")
    const chars = useRef('')
    useEffect(() => {
       
        console.log(roomIDProp? 'id found' : 'id not found')
        window.addEventListener('keydown', submitWordtoServer);

        return () => {
            window.removeEventListener('keydown', submitWordtoServer);
        };


    }, [playerWord])

    useEffect(() => {
            setRoomID(roomIDProp)

            window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
          };
    }, [])
    
  
    function handleKeyDown( event : KeyboardEvent) {
        if (event.code == "Backspace") {
          chars.current = chars.current.slice(0, -1)
          setPlayerWord(chars.current)
          return
        }
        if (event.code == "Space" || event.code == "Delete") {
          chars.current = "";
          setPlayerWord(chars.current)
          return
        }
        if (event.key.length > 1)
          return
        chars.current = chars.current + event.key
        setPlayerWord(chars.current)
        
      }

    
    const submitWordtoServer = (event: KeyboardEvent) => {
        console.log("send word " + playerWord)
        const wordToSend = playerWord;
        if (event.key === 'Enter' && wordToSend.trim()) {
            console.log("i pressed enter")
            socket.emit('request-submit-word', wordToSend, roomId)
          }
        
    };
    

       
    return (
        <>
        <span className={styles.textInput} >Press Enter to send</span>
        <br/>

        <div style={{display:'flex', height : '1.5em', justifyContent:'center'}}>
        {playerWord.length < 1 ? 
        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'brown', textAlign:'center', margin:'0.1em'}}></div> :
         playerWord.split('').map((char) => (
        <div style={{borderRadius : '5px', fontSize:'2em', width:'1em', height : '1.5em', backgroundColor : 'brown', textAlign:'center', margin:'0.1em'}}> {char} </div>
        ))}
        </div>
            
        </>
    )
}

const Disabled = () => {
    return (
        <>
        <span>Disabled</span>
        </>
    )
}



export default WordSection
